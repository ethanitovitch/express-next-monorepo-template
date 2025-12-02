import { Router } from 'express'
import { validateAndMerge } from '../middlewares/validationMiddleware'
import { authenticatedRoute } from './utils'
import { withBetterAuth } from '../middlewares/auth'
import { GetCreditBalanceRequestSchema } from '@shared/types/src'
import { getOrganizationCreditBalanceController } from '@/api/controllers/organization.controller'
import { validateMemberOfOrganization } from '../middlewares/auth'

const router = Router()

router.get(
  '/:organizationId/credit-balance',
  withBetterAuth,
  validateAndMerge(GetCreditBalanceRequestSchema),
  validateMemberOfOrganization,
  authenticatedRoute(getOrganizationCreditBalanceController),
)

export default router
