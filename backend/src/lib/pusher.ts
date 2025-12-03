import Pusher from 'pusher'
import { config } from '@/config'

let pusherInstance: Pusher | null = null

export const getPusher = (): Pusher | null => {
  if (!config.pusher.enabled) return null

  if (!pusherInstance) {
    pusherInstance = new Pusher({
      appId: config.pusher.appId,
      key: config.pusher.key,
      secret: config.pusher.secret,
      host: config.pusher.host,
      port: String(config.pusher.port),
      useTLS: config.pusher.useTLS,
    })
  }

  return pusherInstance
}

export default getPusher
