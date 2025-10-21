import { config } from '@/config'
import Redis from 'ioredis'
import logger from '@/lib/logger'

export const redisConfig = {
  ...(config.redis.useTLS && {
    tls: {
      rejectUnauthorized: false,
      checkServerIdentity: () => undefined,
    },
  }),
}

let _redis: Redis | null = null

export function getRedis(): Redis {
  if (!_redis) {
    try {
      _redis = new Redis(config.redis.url, {
        ...redisConfig,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      })
    } catch (error) {
      logger.error(`[Redis Lib] Error initializing Redis: ${error}`)
      throw error
    }
  }
  return _redis
}

export async function invalidateCache(key: string): Promise<boolean> {
  try {
    const redis = getRedis()
    const result = await redis.del(key)
    logger.info({ key, deleted: result > 0 }, 'Cache invalidation')
    return result > 0
  } catch (error) {
    logger.error({ key, error }, 'Cache invalidation failed')
    return false
  }
}
