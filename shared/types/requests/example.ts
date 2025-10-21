import { z } from 'zod';

export const GetExampleRequestSchema = z.object({
  id: z.string(),
})

export type GetExampleRequest = z.infer<typeof GetExampleRequestSchema>