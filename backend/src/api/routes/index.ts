import { Router } from 'express'
import exampleRoutes from './example'

const router = Router()

router.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})
router.use('/example', exampleRoutes)

router.use('/sentry', (req, res) => {
  throw new Error('Testing sentry error')
})

export const apiRoutes = router
