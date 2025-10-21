import { Request, Response, NextFunction } from 'express'
import Sentry from '@/lib/sentry'
import logger from '@/lib/logger'
import { ZodError } from 'zod'
import { StatusCodes } from 'http-status-codes'
import { config } from '@/config'

interface ErrorWithStatus extends Error {
  status?: number
  statusCode?: number
}

export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Determine status code
  const statusCode =
    err.status ||
    err.statusCode ||
    (err instanceof ZodError
      ? StatusCodes.BAD_REQUEST
      : StatusCodes.INTERNAL_SERVER_ERROR)

  // Prepare error details for logging
  const errorDetails = {
    name: err.name,
    message: err.message,
    stack: err.stack,
    status: statusCode,
    ...(err instanceof ZodError ? { validation: err.issues } : {}),
  }

  // Log error with request context
  logger.error(
    {
      err: errorDetails,
      req: {
        id: req.headers['x-request-id'],
        method: req.method,
        url: req.originalUrl || req.url,
        params: req.params,
        query: req.query,
        body: req.body,
        headers: {
          'user-agent': req.get('user-agent'),
          'x-request-id': req.get('x-request-id'),
          authorization: req.get('authorization') ? '[REDACTED]' : undefined,
        },
      },
    },
    `Request failed: ${err.message}`,
  )

  // Send to Sentry
  Sentry.captureException(err)

  // Send response
  const isValidationError = err instanceof ZodError
  const isProd = config.nodeEnv === 'production'

  res.status(statusCode).json({
    status: 'error',
    message: isValidationError ? 'Validation failed' : err.message,
    ...(isValidationError ? { details: err.issues } : {}),
    ...(!isProd && !isValidationError ? { stack: err.stack } : {}),
  })
}
