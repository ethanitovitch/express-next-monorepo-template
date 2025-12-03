import { Router } from 'express'
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '@/api/controllers/notification.controller'
import { authenticatedRoute } from './utils'
import { withBetterAuth } from '../middlewares/auth'
import { validateAndMerge } from '../middlewares/validationMiddleware'
import {
  GetNotificationsRequest,
  GetNotificationsRequestSchema,
  MarkNotificationReadRequest,
  MarkNotificationReadRequestSchema,
} from '@shared/types/src'

const router = Router()

// Get paginated notifications (cursor-based for infinite scroll)
router.get(
  '/',
  withBetterAuth,
  validateAndMerge(GetNotificationsRequestSchema),
  authenticatedRoute<GetNotificationsRequest>(getNotifications),
)

// Get unread count
router.get(
  '/unread-count',
  withBetterAuth,
  authenticatedRoute<{}>(getUnreadCount),
)

// Mark single notification as read
router.post(
  '/mark-read',
  withBetterAuth,
  validateAndMerge(MarkNotificationReadRequestSchema),
  authenticatedRoute<MarkNotificationReadRequest>(markAsRead),
)

// Mark all notifications as read
router.post(
  '/mark-all-read',
  withBetterAuth,
  authenticatedRoute<{}>(markAllAsRead),
)

export default router
