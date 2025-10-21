import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import logger from '@/lib/logger'
import { asyncLocalStorage } from '@/lib/context'
import Sentry from '@/lib/sentry'

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestId = (req.headers['x-request-id'] as string) || uuidv4()
  const startTime = Date.now()

  // Store context
  asyncLocalStorage.run(
    { requestId, jobId: '', userId: '', sessionId: '' },
    () => {
      // Log request start
      Sentry.setContext('request', {
        requestId,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        body: req.body,
      })
      logger.info(
        {
          req: {
            method: req.method,
            url: req.url,
            params: req.params,
            query: req.query,
            body: req.body,
          },
        },
        'Request started',
      )

      // Log when the request completes
      res.on('finish', () => {
        const duration = Date.now() - startTime
        logger.info(
          {
            res: {
              statusCode: res.statusCode,
              duration: `${duration}ms`,
            },
          },
          'Request completed',
        )
      })

      // Add request ID to response headers
      res.setHeader('x-request-id', requestId)
      next()
    },
  )
}
