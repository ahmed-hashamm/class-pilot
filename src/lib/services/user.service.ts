import { createClient } from '@/lib/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

export const UserService = {
  async getProfile(userId: string) {
    const { redisSafe } = await import('@/lib/redis')
    const cacheKey = `user:profile:${userId}`
    
    // 1. Try cache
    const cached = await redisSafe.get<{ full_name: string | null; avatar_url: string | null }>(cacheKey)
    if (cached) return cached

    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data, error } = await supabase
      .from('users')
      .select('full_name, avatar_url')
      .eq('id', userId)
      .maybeSingle()

    if (error) throw error
    
    // 2. Save to cache (1 Hour)
    if (data) {
      await redisSafe.set(cacheKey, data, { ex: 3600 })
    }
    
    return data
  }
}
