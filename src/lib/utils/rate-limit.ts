import { redisSafe } from '@/lib/redis'

/**
 * FEATURE LIMITS (Optimal hourly caps)
 * 100 per hour: High-volume teacher grading.
 * 50 per hour: Active student using AI assistant.
 */
export const LIMITS = {
  AI_GRADING: 100,
  AI_ASSISTANT: 50,
  DEFAULT: 100,
} as const

type LimitFeature = keyof typeof LIMITS

/**
 * Rate Limiter Utility using Redis
 * Uses a fixed-window counter (1 hour).
 */
export async function checkRateLimit(
  userId: string, 
  feature: LimitFeature
): Promise<{ success: boolean; current: number; limit: number }> {
  const limit = LIMITS[feature] || LIMITS.DEFAULT
  const key = `ratelimit:${feature}:${userId}`

  // 1. Increment the counter for this hour
  const current = await redisSafe.incr(key)
  
  if (current === null) {
    // If Redis is down, we allow the request (fail open)
    return { success: true, current: 0, limit }
  }

  // 2. Set expiration on first increment
  if (current === 1) {
    await redisSafe.expire(key, 3600) // 1 hour window
  }

  // 3. Return results
  return {
    success: current <= limit,
    current,
    limit,
  }
}
