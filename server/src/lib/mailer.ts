import { Resend } from 'resend'
import { config } from '../config.js'

const resend = new Resend(config.resendApiKey)

type SendPasswordResetEmailParams = {
  to: string
  resetLink: string
}

export async function sendPasswordResetEmail({ to, resetLink }: SendPasswordResetEmailParams) {
  await resend.emails.send({
    from: config.emailFrom,
    to,
    subject: 'Reset your Veloura password',
    text: `Use this link to reset your password: ${resetLink}\n\nThis link expires in 15 minutes.`,
    html: `<p>Use this link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>This link expires in 15 minutes.</p>`,
  })
}
