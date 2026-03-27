'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Fetches all materials for a specific class.
 */
export async function getMaterialsByClass(classId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { materials: [], error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('materials')
    .select('*, users(full_name, email)')
    .eq('class_id', classId)
    .order('created_at', { ascending: false })

  return { materials: data || [], error: error?.message || null }
}
