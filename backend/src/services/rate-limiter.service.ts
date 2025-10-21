import { getRedis } from '@/lib/redis'
import logger from '@/lib/logger'

export interface RateLimitOptions {
  windowSeconds: number
  maxRequests: number
  keyGenerator: (req: any) => string
  message?: string
  onLimitReached?: (req: any, res: any, rateLimitInfo: any) => void
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

export class RedisRateLimiter {
  /**
   * Creates a flexible Redis-based rate limiter
   * @param options Configuration options
   */
  static create(options: RateLimitOptions) {
    return async (req: any, res: any, next: any) => {
      const key = `rate_limit:${options.keyGenerator(req)}`
      const now = Date.now()
      const windowStart = now - options.windowSeconds * 1000

      try {
        // Use Redis pipeline for atomic operations
        const pipeline = getRedis().pipeline()

        // Remove old entries outside the window
        pipeline.zremrangebyscore(key, '-inf', windowStart)

        // Count current requests in window
        pipeline.zcard(key)

        // Add current request
        pipeline.zadd(key, now, `${now}-${Math.random()}`)

        // Set expiration
        pipeline.expire(key, options.windowSeconds)

        const results = await pipeline.exec()
        const currentRequests = (results?.[1]?.[1] as number) || 0

        // Check if limit exceeded
        if (currentRequests >= options.maxRequests) {
          logger.info(`Rate limit exceeded for key: ${key}`)
          // Get the oldest request to calculate retry time
          const oldestRequest = await getRedis().zrange(key, 0, 0, 'WITHSCORES')
          const retryAfter =
            oldestRequest.length > 0
              ? Math.ceil(
                  (options.windowSeconds * 1000 -
                    (now - parseFloat(oldestRequest[1]))) /
                    1000,
                )
              : options.windowSeconds

          const rateLimitInfo = {
            limit: options.maxRequests,
            current: currentRequests,
            remaining: 0,
            resetTime: new Date(now + retryAfter * 1000),
            retryAfter,
          }

          // Custom handler if provided
          if (options.onLimitReached) {
            return options.onLimitReached(req, res, rateLimitInfo)
          }

          // Default response
          return res.status(429).json({
            error: 'Rate limit exceeded',
            message:
              options.message ||
              `Too many requests. Please try again in ${retryAfter} seconds.`,
            retryAfter,
            limit: options.maxRequests,
            windowSeconds: options.windowSeconds,
          })
        }

        // Add rate limit info to response headers
        res.set({
          'X-RateLimit-Limit': options.maxRequests.toString(),
          'X-RateLimit-Remaining': (
            options.maxRequests -
            currentRequests -
            1
          ).toString(),
          'X-RateLimit-Reset': new Date(
            now + options.windowSeconds * 1000,
          ).toISOString(),
        })

        // Store original end function to conditionally count requests
        const originalEnd = res.end
        res.end = function (...args: any[]) {
          // Remove the request from count if it should be skipped
          if (
            (options.skipSuccessfulRequests && res.statusCode < 400) ||
            (options.skipFailedRequests && res.statusCode >= 400)
          ) {
            getRedis().zrem(key, `${now}-${Math.random()}`)
          }

          originalEnd.apply(res, args)
        }

        next()
      } catch (error) {
        console.error('Rate limit check failed:', error)
        // Fail open - allow request if Redis is down
        next()
      }
    }
  }

  /**
   * Pre-built rate limiters for common use cases
   */
  static presets = {
    // Per-user rate limiting
    perUser: (windowSeconds: number = 60, maxRequests: number = 1) =>
      RedisRateLimiter.create({
        windowSeconds,
        maxRequests,
        keyGenerator: (req) => `user:${req.user?.id || 'anonymous'}`,
        message: `You can only make ${maxRequests} request(s) per ${windowSeconds} seconds`,
      }),

    // Per-IP rate limiting
    perIP: (windowSeconds: number = 60, maxRequests: number = 10) =>
      RedisRateLimiter.create({
        windowSeconds,
        maxRequests,
        keyGenerator: (req) => `ip:${req.ip || req.connection.remoteAddress}`,
        message: `Too many requests from this IP. Limit: ${maxRequests} per ${windowSeconds} seconds`,
      }),

    // Per-endpoint rate limiting
    perEndpoint: (windowSeconds: number = 60, maxRequests: number = 100) =>
      RedisRateLimiter.create({
        windowSeconds,
        maxRequests,
        keyGenerator: (req) =>
          `endpoint:${req.method}:${req.route?.path || req.path}`,
        message: `This endpoint is temporarily overloaded. Please try again later.`,
      }),

    // Combined user + endpoint
    perUserEndpoint: (windowSeconds: number = 60, maxRequests: number = 5) =>
      RedisRateLimiter.create({
        windowSeconds,
        maxRequests,
        keyGenerator: (req) =>
          `user_endpoint:${req.user?.id}:${req.route?.path || req.path}`,
        message: `You're making too many requests to this endpoint`,
      }),
  }
}
