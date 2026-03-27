'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getStreamFeed(classId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch all feed elements in parallel
  const [
    { data: announcements },
    { data: assignments },
    { data: materials },
    { data: polls },
    { data: attendances }
  ] = await Promise.all([
    supabase
      .from('announcements')
      .select('*, users(full_name,email)')
      .eq('class_id', classId)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false }),
    
    supabase
      .from('assignments')
      .select('*, users(full_name,email)')
      .eq('class_id', classId)
      .order('created_at', { ascending: false }),
    
    supabase
      .from('materials')
      .select('*, users:created_by(full_name)')
      .eq('class_id', classId)
      .order('created_at', { ascending: false }),
      
    supabase
      .from('polls')
      .select('*, users(full_name,email), poll_responses(*)')
      .eq('class_id', classId)
      .order('created_at', { ascending: false }),
      
    supabase
      .from('attendances')
      .select('*, users(full_name,email), attendance_records(*)')
      .eq('class_id', classId)
      .order('created_at', { ascending: false })
  ])

  // Map types and combine
  const combined = [
    ...(announcements || []).map((a: any) => ({ ...a, type: 'announcement' as const })),
    ...(assignments || []).map((a: any) => ({ ...a, type: 'assignment' as const })),
    ...(materials || []).map((m: any) => ({ ...m, type: 'material' as const })),
    ...(polls || []).map((p: any) => ({ ...p, type: 'poll' as const })),
    ...(attendances || []).map((a: any) => ({ ...a, type: 'attendance' as const })),
  ]

  // Sort by pinned first, then by created_at descending
  combined.sort((a, b) => {
    const aPinned = a.type === 'announcement' && (a as any).pinned ? 1 : 0
    const bPinned = b.type === 'announcement' && (b as any).pinned ? 1 : 0
    if (aPinned !== bPinned) return bPinned - aPinned
    
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  })

  return combined
}
