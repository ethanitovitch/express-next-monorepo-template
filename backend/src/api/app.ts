import express from 'express'
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler'
import { requestLogger } from './middlewares/requestLogger'
import { initializeAuth } from './middlewares/auth'
import { apiRoutes } from './routes'
import authRoutes from './routes/auth'
import bodyParser from 'body-parser'
import { config } from '@/config'
import Sentry from '@/lib/sentry'

const app = express()

// Middleware
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cookie',
      'X-Requested-With',
    ],
    exposedHeaders: ['Set-Cookie'],
  }),
)

app.use('/api/auth', authRoutes)

app.use(express.json())
app.use(requestLogger)
app.use(bodyParser.json())

// Routes
app.use('/api', apiRoutes)

Sentry.setupExpressErrorHandler(app)

// Error handling
app.use(errorHandler)

export { app }
