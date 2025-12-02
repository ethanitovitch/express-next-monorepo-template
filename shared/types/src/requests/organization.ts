import { z } from 'zod'

export const GetCreditBalanceRequestSchema = z.object({
  organizationId: z.string(),
})

export type GetCreditBalanceRequest = z.infer<typeof GetCreditBalanceRequestSchema>