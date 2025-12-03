import { AuthRequestHandler } from '@/types/handlers'
import { authorizeChannel } from '@/clients/pusher.client'
import { privateUserChannelPrefix, PusherAuthRequest } from '@shared/types/src'

export const authChannel: AuthRequestHandler<PusherAuthRequest> = async (
  req,
  res,
) => {
  const { socket_id, channel_name } = req.validated
  const user = req.user

  // Only allow private-user-{userId} channels where userId matches the authenticated user
  if (!channel_name.startsWith(privateUserChannelPrefix)) {
    res.status(403).json({ error: 'Invalid channel' })
    return
  }

  const channelUserId = channel_name.replace(privateUserChannelPrefix, '')
  if (channelUserId !== user.id) {
    res.status(403).json({ error: 'Forbidden' })
    return
  }

  const authResponse = authorizeChannel(socket_id, channel_name)
  res.json(authResponse)
}
