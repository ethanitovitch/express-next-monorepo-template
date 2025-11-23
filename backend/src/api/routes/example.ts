import { Router } from 'express'
import { getExample } from '@/api/controllers/example.controller'
import { validateAndMerge } from '@/api/middlewares/validationMiddleware'
import { GetExampleRequestSchema } from '@shared/types/src'
import { validatedRoute } from './utils'

const router = Router()

router.get(
  '/:id',
  validateAndMerge(GetExampleRequestSchema),
  validatedRoute(getExample),
)

export default router
