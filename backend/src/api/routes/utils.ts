import {
  AuthRequest,
  AuthRequestHandler,
  ValidatedRequest,
  ValidatedRequestHandler,
} from '@/types/handlers'
import { RequestHandler } from 'express'
import { setRequestContext } from '@/lib/context'

export const validatedRoute = <T>(
  handler: ValidatedRequestHandler<T>,
): RequestHandler => {
  return (req, res, next) => {
    return handler(req as ValidatedRequest<T>, res, next)
  }
}

export const authenticatedRoute = <T>(
  handler: AuthRequestHandler<T>,
): RequestHandler => {
  return (req, res, next) => {
    // At this point, we assume withAuth has already run and attached user
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    setRequestContext('userId', (req.user as any).id)
    return handler(req as AuthRequest<T>, res, next)
  }
}
