import { getPusher } from '@/lib/pusher'
import { channels, PUSHER_EVENTS } from '@shared/types/src'
import { Notification } from '@shared/types/src'

// Send notification to user
export const pushNotification = async (
  userId: string,
  notification: Notification,
) => {
  const pusher = getPusher()
  if (!pusher) return

  return pusher.trigger(
    channels.privateUser(userId),
    PUSHER_EVENTS.NOTIFICATION,
    notification,
  )
}

// Authorize private channel subscription
export const authorizeChannel = (socketId: string, channel: string) => {
  const pusher = getPusher()
  if (!pusher) return null

  return pusher.authorizeChannel(socketId, channel)
}
