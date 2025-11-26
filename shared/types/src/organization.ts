export const OrganizationRole = {
  ADMIN: 'admin',
  OWNER: 'owner',
  MEMBER: 'member',
} as const;

export type OrganizationRole = (typeof OrganizationRole)[keyof typeof OrganizationRole];