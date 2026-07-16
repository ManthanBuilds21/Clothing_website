import dotenv from 'dotenv'

dotenv.config()

function getRequiredEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  jwtSecret: getRequiredEnv('JWT_SECRET'),
  razorpayKeyId: getRequiredEnv('RAZORPAY_KEY_ID'),
  razorpayKeySecret: getRequiredEnv('RAZORPAY_KEY_SECRET'),
  razorpayWebhookSecret: getRequiredEnv('RAZORPAY_WEBHOOK_SECRET'),
  resendApiKey: getRequiredEnv('RESEND_API_KEY'),
  emailFrom: getRequiredEnv('EMAIL_FROM'),
}

