import { Router } from 'express'
import { getUser, getAccount } from '@/api/controllers/user.controller'
import { authenticatedRoute } from './utils'
import { withBetterAuth } from '../middlewares/auth'

const router = Router()

router.get('/me', withBetterAuth, authenticatedRoute<{}>(getUser))

router.get('/account', withBetterAuth, authenticatedRoute<{}>(getAccount))

export default router
