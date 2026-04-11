import { Redis } from '@upstash/redis'

/**
 * Singleton Redis client for serverless environments.
 * Uses REST-based communication via Upstash for zero-latency connection management.
 */

const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

if (!hasRedis) {
  console.warn("⚠️  Redis configuration missing in .env. Upstash Redis caching will be disabled safely.");
}

export const redis = hasRedis 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : ({
      get: async () => null,
      set: async () => "OK",
      del: async () => 1,
      incr: async () => null,
      expire: async () => 1,
    } as unknown as Redis);

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
      return null
    }
  },

  async set(key: string, value: any, options?: { ex?: number }): Promise<void> {
    try {
      await redis.set(key, value, options as any)
    } catch (error) {
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
    }
  },

  async incr(key: string): Promise<number | null> {
    try {
      return await redis.incr(key)
    } catch (error) {
      return null
    }
  },

  async expire(key: string, seconds: number): Promise<void> {
    try {
      await redis.expire(key, seconds)
    } catch (error) {
    }
  },

  /**
   * Clears the cached profile for a user.
   */
  async invalidateUserCache(userId: string): Promise<void> {
    await this.del(`user:profile:${userId}`)
  },

  /**
   * Clears the cached metadata for a class.
   */
  async invalidateClassCache(classId: string): Promise<void> {
    await this.del(`class:name:${classId}`)
  },

  /**
   * Clears the cached role for a user in a specific class.
   */
  async invalidateRoleCache(classId: string, userId: string): Promise<void> {
    await this.del(`role:class:${classId}:user:${userId}`)
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
