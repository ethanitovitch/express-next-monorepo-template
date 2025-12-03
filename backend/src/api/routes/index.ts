import { Router } from 'express'
import exampleRoutes from './example'
import adminRoutes from './admin'
import organizationRoutes from './organization'
import userRoutes from './user'
import notificationRoutes from './notification'
import pusherRoutes from './pusher'

const router = Router()

router.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

router.use('/example', exampleRoutes)
router.use('/admin', adminRoutes)
router.use('/organization', organizationRoutes)
router.use('/user', userRoutes)
router.use('/notifications', notificationRoutes)
router.use('/pusher', pusherRoutes)
router.use('/sentry', (req, res) => {
  throw new Error('Testing sentry error')
})

export const apiRoutes = router
