import { createClient } from '@/lib/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

export const UserService = {
  async getProfile(userId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data, error } = await supabase
      .from('users')
      .select('full_name, avatar_url')
      .eq('id', userId)
      .maybeSingle()

    if (error) throw error
    return data
  }
}
