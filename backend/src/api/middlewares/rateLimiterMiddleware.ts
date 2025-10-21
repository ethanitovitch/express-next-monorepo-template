import { RedisRateLimiter } from '@/services/rate-limiter.service'

// 1 request per minute per user
export const exampleRateLimit = RedisRateLimiter.presets.perUserEndpoint(60, 1)
