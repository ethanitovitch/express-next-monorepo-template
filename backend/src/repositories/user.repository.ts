import { db } from '@/lib/db'

export const findById = async (id: string) => {
  const user = await db
    .selectFrom('user')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst()
  return user
}

export const findAccountByUserId = async (userId: string) => {
  const account = await db
    .selectFrom('account')
    .where('account.userId', '=', userId)
    .selectAll()
    .executeTakeFirst()
  return account
}

export const isMemberOfOrganization = async (
  userId: string,
  organizationId: string,
) => {
  const member = await db
    .selectFrom('member')
    .where('userId', '=', userId)
    .where('organizationId', '=', organizationId)
    .selectAll()
    .executeTakeFirst()
  return member !== null
}
