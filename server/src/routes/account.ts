import { Router } from 'express'
import { z } from 'zod'
import { asyncHandler } from '../lib/http.js'
import { prisma } from '../lib/prisma.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.use(authenticate)

router.get(
  '/orders',
  asyncHandler(async (request, response) => {
    const userId = request.auth!.userId

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    })

    response.json({ orders })
  }),
)

router.get(
  '/addresses',
  asyncHandler(async (request, response) => {
    const userId = request.auth!.userId

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    response.json({ addresses })
  }),
)

const deleteAddressSchema = z.object({
  id: z.string().min(1),
})

router.delete(
  '/addresses',
  asyncHandler(async (request, response) => {
    const { id } = deleteAddressSchema.parse(request.body)
    const userId = request.auth!.userId

    await prisma.address.delete({
      where: { id, userId },
    })

    response.json({ success: true })
  }),
)

export default router
