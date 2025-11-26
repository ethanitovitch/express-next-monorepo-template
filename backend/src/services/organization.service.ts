import { findMember } from '@/repositories/organization.repository'
import { OrganizationRole } from '@shared/types/src/organization'

export const isMemberOfOrganization = async (
  userId: string,
  organizationId: string,
) => {
  const member = await findMember(organizationId, userId)
  if (!member) {
    return false
  }
  return true
}

export const doesMemberHaveRole = async (
  userId: string,
  organizationId: string,
  roles: OrganizationRole[],
) => {
  const member = await findMember(organizationId, userId)
  if (!member) {
    return false
  }
  return roles.includes(member.role as OrganizationRole)
}
