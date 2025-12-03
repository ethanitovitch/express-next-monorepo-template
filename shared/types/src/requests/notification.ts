import { z } from 'zod';
import { DBNotification, CreateNotificationInput } from '@shared/db/src/types';
import { 
  CursorPaginationRequestSchema, 
  CursorPaginationRequest,
  CursorPaginatedResponseWithMeta 
} from './pagination';

// Re-export DB types for convenience
export type { DBNotification, CreateNotificationInput };

// Request schemas
export const GetNotificationsRequestSchema = CursorPaginationRequestSchema.extend({
  unreadOnly: z.string().default('false').transform((val) => val === 'true'),
});

export const MarkNotificationReadRequestSchema = z.object({
  notificationId: z.string().uuid(),
});

export const MarkAllNotificationsReadRequestSchema = z.object({});

export const CreateNotificationRequestSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1).max(255),
  message: z.string().min(1).max(1000),
  link: z.string().url().nullable().optional(),
});

// Request types
export type GetNotificationsRequest = CursorPaginationRequest & {
  unreadOnly?: boolean;
};
export type MarkNotificationReadRequest = z.infer<typeof MarkNotificationReadRequestSchema>;
export type CreateNotificationRequest = z.infer<typeof CreateNotificationRequestSchema>;

// Response types
export type NotificationsResponse = CursorPaginatedResponseWithMeta<DBNotification, { unreadCount: number }>;
export type NotificationResponse = DBNotification;
export type UnreadCountResponse = { count: number };

// Alias for backward compatibility
export type Notification = DBNotification;
