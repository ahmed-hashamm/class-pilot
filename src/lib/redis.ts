import { Redis } from '@upstash/redis'

/**
 * Singleton Redis client for serverless environments.
 * Uses REST-based communication via Upstash for zero-latency connection management.
 */

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn('[Redis] Missing UPSTASH environment variables. Redis features will be disabled.')
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

/**
 * Safe Redis Wrapper
 * Wraps Redis calls in a try-catch to ensure the main application logic 
 * never fails if Redis is down or misconfigured.
 */
export const redisSafe = {
  async get<T>(key: string): Promise<T | null> {
    try {
      return await redis.get<T>(key)
    } catch (error) {
      console.error(`[Redis Error] GET ${key}:`, error)
      return null
    }
  },

  async set(key: string, value: any, options?: { ex?: number }): Promise<void> {
    try {
      await redis.set(key, value, options as any)
    } catch (error) {
      console.error(`[Redis Error] SET ${key}:`, error)
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      console.error(`[Redis Error] DEL ${key}:`, error)
    }
  },

  async incr(key: string): Promise<number | null> {
    try {
      return await redis.incr(key)
    } catch (error) {
      console.error(`[Redis Error] INCR ${key}:`, error)
      return null
    }
  },

  async expire(key: string, seconds: number): Promise<void> {
    try {
      await redis.expire(key, seconds)
    } catch (error) {
      console.error(`[Redis Error] EXPIRE ${key}:`, error)
    }
  },

  /**
   * Clears the cached feed for a specific class.
   * Call this in actions when a new post is created.
   */
  async invalidateFeedCache(classId: string): Promise<void> {
    const key = `feed:class:${classId}`
    await this.del(key)
  }
}
