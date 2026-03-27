'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Fetches all members (teachers & students) for a specific class.
 */
export async function getClassMembers(classId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { members: [], error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('class_members')
    .select('*, users(full_name, email, avatar_url)')
    .eq('class_id', classId)
    .order('role', { ascending: false })
    .order('joined_at', { ascending: true })

  return { members: data || [], error: error?.message || null }
}
