import { Router } from 'express'
import { withBetterAuth } from '../middlewares/auth'
import { validateAndMerge } from '../middlewares/validationMiddleware'
import { authenticatedRoute } from './utils'
import { authChannel } from '../controllers/pusher.controller'
import { PusherAuthRequest, PusherAuthRequestSchema } from '@shared/types/src'

const router = Router()

// Pusher channel authentication endpoint
// Called by Pusher client when subscribing to private/presence channels
router.post(
  '/auth',
  withBetterAuth,
  validateAndMerge(PusherAuthRequestSchema),
  authenticatedRoute<PusherAuthRequest>(authChannel),
)

export default router
