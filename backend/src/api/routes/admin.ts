import { Router } from 'express'
import { withBetterAuth } from '../middlewares/auth'
import { adminOnlyRoute } from './utils'
import {
  getAdminStats,
  getAdminUsers,
  getAdminOrganizations,
  addOrganizationCredits,
} from '@/api/controllers/admin.controller'
import { validateAndMerge } from '@/api/middlewares/validationMiddleware'
import {
  AddOrganizationCreditsRequestSchema,
  AddOrganizationCreditsRequest,
} from '@shared/types/src'

const router = Router()

router.get('/stats', withBetterAuth, adminOnlyRoute<{}>(getAdminStats))
router.get('/users', withBetterAuth, adminOnlyRoute<{}>(getAdminUsers))
router.get(
  '/organizations',
  withBetterAuth,
  adminOnlyRoute<{}>(getAdminOrganizations),
)
router.post(
  '/organizations/:organizationId/credits',
  withBetterAuth,
  validateAndMerge(AddOrganizationCreditsRequestSchema),
  adminOnlyRoute<AddOrganizationCreditsRequest>(addOrganizationCredits),
)

export default router
