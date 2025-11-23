import { findById } from '@/repositories/example.repository'
import { GetExampleRequest } from '@shared/types/src'
import { ValidatedRequestHandler } from '@/types/handlers'

export const getExample: ValidatedRequestHandler<GetExampleRequest> = async (
  req,
  res,
) => {
  const { id } = req.validated
  const example = await findById(id)
  res.json(example)
}
