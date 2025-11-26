import { Express, Request, Response, NextFunction } from 'express'
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { config } from '@/config'
import logger from '@/lib/logger'
import { findById } from '@/repositories/user.repository'
import { fromNodeHeaders } from 'better-auth/node'
import { auth } from '@/lib/better-auth'
import { AuthRequest } from '@/types/handlers'
import {
  doesMemberHaveRole,
  isMemberOfOrganization,
} from '@/services/organization.service'
import { OrganizationRole } from '@shared/types/src/organization'

export const withAuth = passport.authenticate('jwt', { session: false })

export function initializeAuth(app: Express) {
  app.use(passport.initialize())

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwt.secret,
      },
      async (payload, done) => {
        try {
          const user = await findById(payload.id)
          if (!user) {
            return done(null, false)
          }
          return done(null, user)
        } catch (error) {
          return done(error, false)
        }
      },
    ),
  )

  return passport
}

export const withApiKeyAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers.authorization
  if (!apiKey || apiKey !== config.webhookApiKey) {
    logger.error('Unauthorized request')
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

export const withBetterAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // attach to req so handlers can use it
  ;(req as any).user = session.user
  ;(req as any).session = session

  next()
}

export const validateMemberOfOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authReq = req as AuthRequest<{ organizationId: string }>
  const { organizationId } = req.validated
  const isMember = await isMemberOfOrganization(authReq.user.id, organizationId)
  if (!isMember) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

export const validateMemberOfOrganizationIs =
  (roles: OrganizationRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest<{ organizationId: string }>
    const { organizationId } = req.validated
    const hasRole = await doesMemberHaveRole(
      authReq.user.id,
      organizationId,
      roles,
    )
    if (!hasRole) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    next()
  }
