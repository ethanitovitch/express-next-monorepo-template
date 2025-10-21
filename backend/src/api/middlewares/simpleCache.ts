import { Request, Response, NextFunction } from 'express'
import { getRedis } from '@/lib/redis'
import logger from '@/lib/logger'

interface SimpleCacheOptions {
  key: string | ((req: Request) => string)
  ttl: number // seconds
  isPublic: boolean
}

export function simpleCache(options: SimpleCacheOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const redis = getRedis()

      // Build cache key (static string or dynamic function)
      const cacheKey =
        typeof options.key === 'function' ? options.key(req) : options.key

      // Try to get cached data
      const cached = await redis.get(cacheKey)
      logger.info(`Found cached data: ${cached}`)
      if (cached) {
        // Parse and return cached response
        logger.info(`Cache hit for key: ${cacheKey}`)
        const cachedData = JSON.parse(cached)
        if (options.isPublic) {
          res.setHeader('X-Cache', 'HIT')
          res.setHeader(
            'Cloudflare-CDN-Cache-Control',
            `max-age=${options.ttl}`,
          )
          res.setHeader('X-Cache-Key', cacheKey)
          return res.json(cachedData)
        }
      }

      // No cache hit, continue to handler
      if (options.isPublic) {
        res.setHeader('X-Cache', 'MISS')
        res.setHeader('Cloudflare-CDN-Cache-Control', `max-age=${options.ttl}`)
        res.setHeader('X-Cache-Key', cacheKey)
      }

      // Override res.json to cache the response
      const originalJson = res.json.bind(res)
      res.json = function (body: any) {
        // Cache the response
        logger.info(`Caching response for key: ${cacheKey}`)
        redis
          .setex(cacheKey, options.ttl, JSON.stringify(body))
          .catch(console.error)
        return originalJson(body)
      }

      next()
    } catch (error) {
      logger.error(error, 'Cache middleware error')
      next() // Continue without caching on error
    }
  }
}
