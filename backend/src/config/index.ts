import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  PORT: z.coerce.number().default(8000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  CORS_ORIGIN: z
    .union([z.string(), z.array(z.string())])
    .default(
      process.env.NODE_ENV === 'production'
        ? ['http://localhost:3000', 'http://127.0.0.1:3000']
        : '*',
    ),
  DATABASE_URL: z.string().url(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  BETTERSTACK_TOKEN: z.string(),
  BETTERSTACK_HOST: z.string(),
  SENTRY_DSN: z.string(),
  JWT_SECRET: z.string(),
  WEBHOOK_API_KEY: z.string(),
})

const env = envSchema.parse(process.env)

export const config = {
  webhookApiKey: env.WEBHOOK_API_KEY,
  jwt: {
    secret: env.JWT_SECRET,
  },
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  corsOrigin: env.CORS_ORIGIN,
  databaseUrl: env.DATABASE_URL,
  db: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
  redis: {
    url: env.REDIS_URL,
    useTLS: env.REDIS_URL.startsWith('rediss://'),
  },
  logger: {
    betterstackToken: env.BETTERSTACK_TOKEN,
    betterstackHost: env.BETTERSTACK_HOST,
  },
  sentry: {
    dsn: env.SENTRY_DSN,
  },
} as const

export type Config = typeof config
