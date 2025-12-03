import { db } from '@/lib/db'
import { sql } from 'kysely'
import { withIdAndTimestamps } from './utils'
import {
  CreateNotificationInput,
  CursorPaginationRequest,
  CursorPaginatedResponse,
  DBNotification,
} from '@shared/types/src'

type FindByUserIdOptions = CursorPaginationRequest & {
  unreadOnly?: boolean
}

export const findByUserId = async (
  userId: string,
  options: FindByUserIdOptions,
): Promise<CursorPaginatedResponse<DBNotification>> => {
  let query = db
    .selectFrom('notification')
    .where('userId', '=', userId)
    .orderBy('createdAt', 'desc')
    .limit(options.limit + 1) // Fetch one extra to check if there are more

  if (options.unreadOnly) {
    query = query.where('readAt', 'is', null)
  }

  if (options.cursor) {
    const cursorNotification = await db
      .selectFrom('notification')
      .where('id', '=', options.cursor)
      .select('createdAt')
      .executeTakeFirst()

    if (cursorNotification) {
      query = query.where('createdAt', '<', cursorNotification.createdAt)
    }
  }

  const notifications = await query.selectAll().execute()

  const hasMore = notifications.length > options.limit
  const data = hasMore ? notifications.slice(0, -1) : notifications
  const nextCursor = hasMore ? (data[data.length - 1]?.id ?? null) : null

  return {
    data,
    nextCursor,
    hasMore,
  }
}

export const getUnreadCount = async (userId: string) => {
  const result = await db
    .selectFrom('notification')
    .where('userId', '=', userId)
    .where('readAt', 'is', null)
    .select(sql<number>`count(*)::int`.as('count'))
    .executeTakeFirst()

  return result?.count ?? 0
}

export const findById = async (id: string) => {
  return db
    .selectFrom('notification')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst()
}

export const markAsRead = async (id: string) => {
  return db
    .updateTable('notification')
    .set({ readAt: new Date(), updatedAt: new Date() })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export const markAllAsRead = async (userId: string) => {
  return db
    .updateTable('notification')
    .set({ readAt: new Date(), updatedAt: new Date() })
    .where('userId', '=', userId)
    .where('readAt', 'is', null)
    .execute()
}

export const create = async (data: CreateNotificationInput) => {
  return db
    .insertInto('notification')
    .values(withIdAndTimestamps(data, true))
    .returningAll()
    .executeTakeFirst()
}

export const deleteById = async (id: string) => {
  return db.deleteFrom('notification').where('id', '=', id).executeTakeFirst()
}
