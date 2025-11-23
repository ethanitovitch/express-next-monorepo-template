import { findAccountByUserId } from '@/repositories/user.repository'
import { AuthRequestHandler } from '@/types/handlers'

export const getUser: AuthRequestHandler<{}> = async (req, res) => {
  const user = req.user
  res.json(user)
}

export const getAccount: AuthRequestHandler<{}> = async (req, res) => {
  const account = await findAccountByUserId(req.user.id)
  res.json(account)
}
