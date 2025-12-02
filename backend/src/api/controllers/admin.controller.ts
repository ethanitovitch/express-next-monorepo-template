import { AuthRequestHandler } from '@/types/handlers'
import { db } from '@/lib/db'
import {
  AdminUsersRequestSchema,
  AdminOrganizationsRequestSchema,
  type AdminUsersResponse,
  type AdminOrganizationsResponse,
  type AdminStats,
  type AddOrganizationCreditsRequest,
} from '@shared/types/src'
import { sql } from 'kysely'
import { withIdAndTimestamps } from '@/repositories/utils'

export const getAdminStats: AuthRequestHandler<{}> = async (req, res) => {
  const [usersCount, organizationsCount] = await Promise.all([
    db
      .selectFrom('user')
      .select(db.fn.countAll().as('count'))
      .executeTakeFirst(),
    db
      .selectFrom('organization')
      .select(db.fn.countAll().as('count'))
      .executeTakeFirst(),
  ])

  const response: AdminStats = {
    users: Number(usersCount?.count || 0),
    organizations: Number(organizationsCount?.count || 0),
  }

  res.json(response)
}

export const getAdminUsers: AuthRequestHandler<{}> = async (req, res) => {
  const params = AdminUsersRequestSchema.parse(req.query)
  const { page, limit, search } = params
  const offset = (page - 1) * limit

  // Base query for users with their organization memberships
  let query = db
    .selectFrom('user')
    .leftJoin('member', 'member.userId', 'user.id')
    .leftJoin('organization', 'organization.id', 'member.organizationId')
    .select([
      'user.id',
      'user.email',
      'user.name',
      'user.createdAt',
      'user.role',
      'user.emailVerified',
      sql<string>`string_agg(distinct "organization"."name", ', ')`.as(
        'organizations',
      ),
    ])
    .groupBy([
      'user.id',
      'user.email',
      'user.name',
      'user.createdAt',
      'user.role',
      'user.emailVerified',
    ])

  // Apply search filter
  if (search) {
    const searchLower = `%${search.toLowerCase()}%`

    // For the main query, we need to search across user fields and org names
    // Note: "user" is a reserved keyword in PostgreSQL, so we quote it
    query = query.where((eb) =>
      eb.or([
        eb(sql`lower("user"."email")`, 'like', searchLower),
        eb(sql`lower("user"."name")`, 'like', searchLower),
        eb(sql`lower("organization"."name")`, 'like', searchLower),
      ]),
    )
  }

  // Build count query based on whether we have search
  const getCount = async () => {
    if (search) {
      const searchLower = `%${search.toLowerCase()}%`
      const result = await db
        .selectFrom('user')
        .leftJoin('member', 'member.userId', 'user.id')
        .leftJoin('organization', 'organization.id', 'member.organizationId')
        .select(sql<number>`count(distinct "user"."id")`.as('count'))
        .where((eb) =>
          eb.or([
            eb(sql`lower("user"."email")`, 'like', searchLower),
            eb(sql`lower("user"."name")`, 'like', searchLower),
            eb(sql`lower("organization"."name")`, 'like', searchLower),
          ]),
        )
        .executeTakeFirst()
      return result
    }
    return db
      .selectFrom('user')
      .select(db.fn.countAll().as('count'))
      .executeTakeFirst()
  }

  const [users, totalResult] = await Promise.all([
    query
      .orderBy('user.createdAt', 'desc')
      .limit(limit)
      .offset(offset)
      .execute(),
    getCount(),
  ])

  const total = Number(totalResult?.count || 0)
  const totalPages = Math.ceil(total / limit)

  const response: AdminUsersResponse = {
    data: users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      createdAt: u.createdAt.toISOString(),
      role: u.role,
      emailVerified: u.emailVerified,
      organizations: u.organizations ? u.organizations.split(', ') : [],
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }

  res.json(response)
}

export const getAdminOrganizations: AuthRequestHandler<{}> = async (
  req,
  res,
) => {
  const params = AdminOrganizationsRequestSchema.parse(req.query)
  const { page, limit, search } = params
  const offset = (page - 1) * limit

  let query = db
    .selectFrom('organization')
    .leftJoin('member', 'member.organizationId', 'organization.id')
    .leftJoin(
      'credit_transaction',
      'credit_transaction.organizationId',
      'organization.id',
    )
    .select([
      'organization.id',
      'organization.name',
      'organization.slug',
      'organization.createdAt',
      sql<number>`count(distinct "member"."id")::int`.as('memberCount'),
      sql<number>`coalesce(sum("credit_transaction"."amount"), 0)::int`.as(
        'creditBalance',
      ),
    ])
    .groupBy([
      'organization.id',
      'organization.name',
      'organization.slug',
      'organization.createdAt',
    ])

  let countQuery = db
    .selectFrom('organization')
    .select(db.fn.countAll().as('count'))

  if (search) {
    const searchLower = `%${search.toLowerCase()}%`
    query = query.where((eb) =>
      eb.or([
        eb(sql`lower("organization"."name")`, 'like', searchLower),
        eb(sql`lower("organization"."slug")`, 'like', searchLower),
      ]),
    )
    countQuery = countQuery.where((eb) =>
      eb.or([
        eb(sql`lower("organization"."name")`, 'like', searchLower),
        eb(sql`lower("organization"."slug")`, 'like', searchLower),
      ]),
    )
  }

  const [organizations, totalResult] = await Promise.all([
    query
      .orderBy('organization.createdAt', 'desc')
      .limit(limit)
      .offset(offset)
      .execute(),
    countQuery.executeTakeFirst(),
  ])

  const total = Number(totalResult?.count || 0)
  const totalPages = Math.ceil(total / limit)

  const response: AdminOrganizationsResponse = {
    data: organizations.map((o) => ({
      id: o.id,
      name: o.name,
      slug: o.slug,
      createdAt: o.createdAt.toISOString(),
      memberCount: o.memberCount,
      creditBalance: o.creditBalance,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }

  res.json(response)
}

export const addOrganizationCredits: AuthRequestHandler<
  AddOrganizationCreditsRequest
> = async (req, res) => {
  const { organizationId, amount, reason } = req.validated

  await db
    .insertInto('credit_transaction')
    .values(
      withIdAndTimestamps({
        organizationId,
        paymentInvoiceId: `admin-${Date.now()}`,
        amount,
        type: 'interview',
        metadata: JSON.stringify({
          reason: reason || 'Admin credit adjustment',
          addedBy: req.user.id,
          addedByEmail: req.user.email,
        }),
      }),
    )
    .execute()

  // Get new balance
  const result = await db
    .selectFrom('credit_transaction')
    .where('organizationId', '=', organizationId)
    .select((eb) => eb.fn.sum<number>('amount').as('balance'))
    .executeTakeFirst()

  res.json({
    success: true,
    newBalance: result?.balance ?? 0,
  })
}
