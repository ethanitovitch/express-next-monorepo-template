import { z } from 'zod';
import { Notification } from './requests';

// ============================================
// Auth Request
// ============================================

export const PusherAuthRequestSchema = z.object({
  socket_id: z.string().min(1),
  channel_name: z.string().min(1),
});

export type PusherAuthRequest = z.infer<typeof PusherAuthRequestSchema>;

// ============================================
// Channel
// ============================================
export const privateUserChannelPrefix = 'private-user-';
export type PrivateUserChannel = `${typeof privateUserChannelPrefix}${string}`;

export const channels = {
  privateUser: (userId: string): PrivateUserChannel => `${privateUserChannelPrefix}${userId}`,
} as const;

// ============================================
// Events
// ============================================

export const PUSHER_EVENTS = {
  NOTIFICATION: 'notification',
} as const;

export type PusherEvent = typeof PUSHER_EVENTS[keyof typeof PUSHER_EVENTS];

export interface PusherEventMap {
  [PUSHER_EVENTS.NOTIFICATION]: Notification;
}
