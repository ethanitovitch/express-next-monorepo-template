import { AuthRequestHandler } from '@/types/handlers'
import * as notificationService from '@/services/notification.service'
import {
  GetNotificationsRequest,
  MarkNotificationReadRequest,
} from '@shared/types/src'

export const getNotifications: AuthRequestHandler<
  GetNotificationsRequest
> = async (req, res) => {
  const { cursor, limit, unreadOnly } = req.validated
  const result = await notificationService.getNotifications(req.user.id, {
    cursor,
    limit,
    unreadOnly,
  })
  res.json(result)
}

export const getUnreadCount: AuthRequestHandler<{}> = async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user.id)
  res.json({ count })
}

export const markAsRead: AuthRequestHandler<
  MarkNotificationReadRequest
> = async (req, res) => {
  const { notificationId } = req.validated
  const notification = await notificationService.markAsRead(
    req.user.id,
    notificationId,
  )
  res.json(notification)
}

export const markAllAsRead: AuthRequestHandler<{}> = async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user.id)
  res.json(result)
}
