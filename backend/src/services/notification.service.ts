import { pushNotification } from '@/clients/pusher.client'
import * as notificationRepository from '@/repositories/notification.repository'
import {
  GetNotificationsRequest,
  CreateNotificationInput,
  NotificationsResponse,
} from '@shared/types/src'
import { tryCatch } from '@/utils/basic'
import logger from '@/lib/logger'

export const getNotifications = async (
  userId: string,
  params: GetNotificationsRequest,
): Promise<NotificationsResponse> => {
  const { data, nextCursor, hasMore } =
    await notificationRepository.findByUserId(userId, {
      cursor: params.cursor,
      limit: params.limit,
      unreadOnly: params.unreadOnly,
    })

  const unreadCount = await notificationRepository.getUnreadCount(userId)

  return {
    data,
    nextCursor,
    hasMore,
    unreadCount,
  }
}

export const getUnreadCount = async (userId: string) => {
  return notificationRepository.getUnreadCount(userId)
}

export const markAsRead = async (userId: string, notificationId: string) => {
  const notification = await notificationRepository.findById(notificationId)

  if (!notification) {
    throw new Error('Notification not found')
  }

  if (notification.userId !== userId) {
    throw new Error('Unauthorized')
  }

  return notificationRepository.markAsRead(notificationId)
}

export const markAllAsRead = async (userId: string) => {
  await notificationRepository.markAllAsRead(userId)
  return { success: true }
}

export const createNotification = async (data: CreateNotificationInput) => {
  return notificationRepository.create(data)
}

export const createNotificationWithPush = async (
  data: CreateNotificationInput,
) => {
  const notification = await createNotification(data)
  if (notification) {
    const [, error] = await tryCatch(async () => {
      await pushNotification(notification.userId, notification)
    })
    if (error) {
      logger.error({ error }, 'Error pushing notification')
    }
  }
  return notification
}
