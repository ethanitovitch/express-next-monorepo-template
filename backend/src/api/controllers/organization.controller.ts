import { AuthRequestHandler } from '@/types/handlers'
import { GetCreditBalanceRequest } from '@shared/types/src'
import { getOrganizationCreditBalance as getOrganizationCreditBalanceRepository } from '@/repositories/subscription.repository'

export const getOrganizationCreditBalanceController: AuthRequestHandler<
  GetCreditBalanceRequest
> = async (req, res) => {
  const balance = await getOrganizationCreditBalanceRepository(
    req.validated.organizationId,
  )
  return res.json({ balance })
}
