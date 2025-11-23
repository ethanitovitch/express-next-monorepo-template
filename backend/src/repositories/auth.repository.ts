import { db } from '@/lib/db'

export const getLastActiveOrganization = async (userId: string) => {
  const user = await db
    .selectFrom('user')
    .where('id', '=', userId)
    .select('lastActiveOrganizationId')
    .executeTakeFirst()

  if (user?.lastActiveOrganizationId) {
    return user.lastActiveOrganizationId
  }

  const organizations = await db
    .selectFrom('organization')
    .innerJoin('member', 'organization.id', 'member.organizationId')
    .where('member.userId', '=', userId)
    .select('organization.id')
    .orderBy('organization.createdAt', 'desc')
    .execute()

  if (organizations.length === 0) {
    return null
  }

  return organizations[0].id
}

export const updateUserLastActiveOrganizationId = async (
  userId: string,
  activeOrganizationId: string,
) => {
  return await db
    .updateTable('user')
    .set({ lastActiveOrganizationId: activeOrganizationId })
    .where('id', '=', userId)
    .executeTakeFirst()
}

export const getOrganizationMember = async (
  organizationId: string,
  userId: string,
) => {
  return await db
    .selectFrom('member')
    .where('organizationId', '=', organizationId)
    .where('userId', '=', userId)
    .selectAll()
    .executeTakeFirst()
}
