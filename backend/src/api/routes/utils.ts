import {
  AuthRequest,
  AuthRequestHandler,
  ValidatedRequest,
  ValidatedRequestHandler,
} from '@/types/handlers'
import { RequestHandler } from 'express'
import { setRequestContext } from '@/lib/context'
import { DBUser } from '@shared/types/src'

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

export const adminOnlyRoute = <T>(
  handler: AuthRequestHandler<T>,
): RequestHandler => {
  return authenticatedRoute<T>(async (req, res, next) => {
    if ((req.user as DBUser).role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' })
    }
    return handler(req, res, next)
  })
}
