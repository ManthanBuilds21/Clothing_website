import crypto from 'crypto'
import { Router } from 'express'
import Razorpay from 'razorpay'
import { z } from 'zod'
import { config } from '../config.js'
import { asyncHandler, ApiError } from '../lib/http.js'
import { prisma } from '../lib/prisma.js'
import { authenticate } from '../middleware/auth.js'
import { calculateShipping } from '../lib/catalog.js'

const router = Router()

const razorpay = new Razorpay({
  key_id: config.razorpayKeyId,
  key_secret: config.razorpayKeySecret,
})

const addressSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().default('India'),
  phone: z.string().min(1),
})

router.use(authenticate)

router.post(
  '/address',
  asyncHandler(async (request, response) => {
    const payload = addressSchema.parse(request.body)
    const userId = request.auth!.userId

    let address
    if (payload.id) {
      address = await prisma.address.update({
        where: { id: payload.id, userId },
        data: payload,
      })
    } else {
      address = await prisma.address.create({
        data: {
          ...payload,
          userId,
        },
      })
    }

    response.json({ address })
  }),
)

const initiateSchema = z.object({
  addressId: z.string().min(1),
})

router.post(
  '/initiate',
  asyncHandler(async (request, response) => {
    const { addressId } = initiateSchema.parse(request.body)
    const userId = request.auth!.userId

    const address = await prisma.address.findUnique({
      where: { id: addressId, userId },
    })

    if (!address) {
      throw new ApiError(404, 'Address not found.')
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    })

    if (cartItems.length === 0) {
      throw new ApiError(400, 'Your cart is empty.')
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const shipping = calculateShipping(subtotal)
    const total = subtotal + shipping

    // Create Razorpay Order
    let razorpayOrder
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: total * 100, // Amount in paise
        currency: 'INR',
        receipt: `rcpt_${userId}_${Date.now()}`.slice(0, 40),
      })
    } catch (error) {
      console.error('Razorpay Error:', error)
      throw new ApiError(500, 'Failed to initialize payment gateway.')
    }

    // Create our DB order
    const order = await prisma.order.create({
      data: {
        userId,
        subtotal,
        shipping,
        total,
        addressId,
        razorpayOrderId: razorpayOrder.id,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productSlug: item.product.slug,
            productImage: item.product.images[0] ?? '',
            size: item.size,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        },
      },
    })

    response.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: config.razorpayKeyId,
    })
  }),
)

const verifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
})

router.post(
  '/verify',
  asyncHandler(async (request, response) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verifySchema.parse(
      request.body,
    )
    const userId = request.auth!.userId

    const body = razorpay_order_id + '|' + razorpay_payment_id

    const expectedSignature = crypto
      .createHmac('sha256', config.razorpayKeySecret)
      .update(body.toString())
      .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature

    if (!isAuthentic) {
      throw new ApiError(400, 'Invalid payment signature.')
    }

    // Payment is successful, update order
    const order = await prisma.order.findFirst({
      where: { razorpayOrderId: razorpay_order_id, userId },
    })

    if (!order) {
      throw new ApiError(404, 'Order not found.')
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          razorpayPaymentId: razorpay_payment_id,
          paymentProvider: 'razorpay',
        },
      })

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { userId },
      })
    })

    response.json({ orderId: order.id })
  }),
)

export default router
