import express from 'express'
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler'
import { requestLogger } from './middlewares/requestLogger'
import { initializeAuth } from './middlewares/auth'
import { apiRoutes } from './routes'
import bodyParser from 'body-parser'
import { config } from '@/config'
import Sentry from '@/lib/sentry'

const app = express()

// Middleware
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  }),
)
app.use(express.json())
app.use(requestLogger)
app.use(bodyParser.json())
initializeAuth(app)

// Routes
app.use('/api', apiRoutes)

Sentry.setupExpressErrorHandler(app)

// Error handling
app.use(errorHandler)

export { app }
