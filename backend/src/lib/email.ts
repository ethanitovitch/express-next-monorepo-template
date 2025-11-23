import nodemailer from 'nodemailer'
import { config } from '@/config'

export const transporter = nodemailer.createTransport({
  host: config.nodeEnv === 'production' ? 'smtp.resend.com' : 'localhost',
  port: config.nodeEnv === 'production' ? 465 : 1025,
  secure: config.nodeEnv === 'production',
  auth:
    config.nodeEnv === 'production'
      ? {
          user: 'resend',
          pass: config.resend.apiKey,
        }
      : undefined,
})
