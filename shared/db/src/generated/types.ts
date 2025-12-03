import type { ColumnType } from 'kysely'
export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

export type Account = {
  id: string
  accountId: string
  providerId: string
  userId: string
  accessToken: string | null
  refreshToken: string | null
  idToken: string | null
  accessTokenExpiresAt: Timestamp | null
  refreshTokenExpiresAt: Timestamp | null
  scope: string | null
  password: string | null
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
}
export type CreditTransaction = {
  id: string
  organizationId: string
  paymentInvoiceId: string
  amount: number
  type: string
  metadata: unknown
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
}
export type Example = {
  id: string
  name: string
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
}
export type Invitation = {
  id: string
  organizationId: string
  email: string
  role: string | null
  status: string
  expiresAt: Timestamp
  createdAt: Timestamp
  inviterId: string
}
export type Member = {
  id: string
  organizationId: string
  userId: string
  role: string
  createdAt: Timestamp
}
export type Notification = {
  id: string
  userId: string
  title: string
  message: string
  link: string | null
  readAt: Timestamp | null
  createdAt: Generated<Timestamp>
  updatedAt: Generated<Timestamp>
}
export type Organization = {
  id: string
  name: string
  slug: string
  logo: string | null
  createdAt: Timestamp
  metadata: string | null
}
export type Session = {
  id: string
  expiresAt: Timestamp
  token: string
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  ipAddress: string | null
  userAgent: string | null
  userId: string
  activeOrganizationId: string | null
  impersonatedBy: string | null
}
export type Subscription = {
  id: string
  plan: string
  referenceId: string
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  status: Generated<string | null>
  periodStart: Timestamp | null
  periodEnd: Timestamp | null
  trialStart: Timestamp | null
  trialEnd: Timestamp | null
  cancelAtPeriodEnd: Generated<boolean | null>
  seats: number | null
}
export type User = {
  id: string
  createdAt: Generated<Timestamp>
  updatedAt: Generated<Timestamp>
  email: string
  emailVerified: Generated<boolean>
  name: string | null
  image: string | null
  stripeCustomerId: string | null
  lastActiveOrganizationId: string | null
  role: string | null
  banned: Generated<boolean | null>
  banReason: string | null
  banExpires: Timestamp | null
}
export type Verification = {
  id: string
  identifier: string
  value: string
  expiresAt: Timestamp
  createdAt: Generated<Timestamp>
  updatedAt: Generated<Timestamp>
}
export type DB = {
  account: Account
  credit_transaction: CreditTransaction
  example: Example
  invitation: Invitation
  member: Member
  notification: Notification
  organization: Organization
  session: Session
  subscription: Subscription
  user: User
  verification: Verification
}
