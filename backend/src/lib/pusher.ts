import Pusher from 'pusher'
import { config } from '@/config'

export const pusher = new Pusher({
  appId: config.pusher.appId,
  key: config.pusher.key,
  secret: config.pusher.secret,
  host: config.pusher.host,
  port: String(config.pusher.port),
  useTLS: config.pusher.useTLS,
})

export default pusher
