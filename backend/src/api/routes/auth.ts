import { toNodeHandler } from 'better-auth/node'
import { auth } from '@/lib/better-auth'
import { Router } from 'express'

const router = Router()

router.all('/*splat', toNodeHandler(auth))

export default router
