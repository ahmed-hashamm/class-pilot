'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const FetchHistorySchema = z.object({
  classId: z.string().uuid(),
})

export async function fetchChatHistory(payload: unknown) {
  const parsed = FetchHistorySchema.safeParse(payload)
  if (!parsed.success) return { data: null, error: 'Invalid input' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  // Check if user is a member of the class (Simplified for now)
  const { data, error } = await supabase
    .from('chat_history' as any)
    .select('role, content')
    .eq('user_id', user.id)
    .eq('class_id', parsed.data.classId)
    .order('created_at', { ascending: true })

  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function clearChatHistory(payload: unknown) {
  const parsed = FetchHistorySchema.safeParse(payload)
  if (!parsed.success) return { data: null, error: 'Invalid input' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  // Use admin client to bypass RLS — same as insert in route.ts
  const adminClient = createAdminClient()
  const { error } = await (adminClient as any)
    .from('chat_history')
    .delete()
    .eq('user_id', user.id)
    .eq('class_id', parsed.data.classId)

  if (error) return { data: null, error: error.message }
  return { data: 'Success', error: null }
}