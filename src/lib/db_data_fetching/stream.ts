'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database'

type AnnouncementRow = Database['public']['Tables']['announcements']['Row']
type AssignmentRow = Database['public']['Tables']['assignments']['Row']
type MaterialRow = Database['public']['Tables']['materials']['Row']
type PollRow = Database['public']['Tables']['polls']['Row']
type AttendanceRow = Database['public']['Tables']['attendances']['Row']

export type StreamItemType = 'announcement' | 'assignment' | 'material' | 'poll' | 'attendance'

export interface BaseStreamItem {
  id: string
  created_at: string | null
  type: StreamItemType
  pinned?: boolean | null
}

export type StreamItem = 
  | (AnnouncementRow & { type: 'announcement'; users?: { full_name: string | null; email: string | null } | null })
  | (AssignmentRow & { type: 'assignment'; users?: { full_name: string | null; email: string | null } | null })
  | (MaterialRow & { type: 'material'; users?: { full_name: string | null } | null })
  | (PollRow & { type: 'poll'; users?: { full_name: string | null; email: string | null } | null; poll_responses?: any[] })
  | (AttendanceRow & { type: 'attendance'; users?: { full_name: string | null; email: string | null } | null; attendance_records?: any[] })


export async function getStreamFeed(classId: string): Promise<StreamItem[]> {
  const { redisSafe } = await import('@/lib/redis')
  const cacheKey = `feed:class:${classId}`

  // 1. Check cache first
  const cached = await redisSafe.get<StreamItem[]>(cacheKey)
  if (cached) {
    return cached
  }

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
      .select('*, users:created_by(full_name, email)')
      .eq('class_id', classId)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false }),
    
    supabase
      .from('assignments')
      .select('*, users:created_by(full_name, email)')
      .eq('class_id', classId)
      .order('created_at', { ascending: false }),
    
    supabase
      .from('materials')
      .select('*, users:created_by(full_name)')
      .eq('class_id', classId)
      .order('created_at', { ascending: false }),
      
    supabase
      .from('polls')
      .select('*, users:created_by(full_name, email), poll_responses(*)')
      .eq('class_id', classId)
      .order('created_at', { ascending: false }),
      
    supabase
      .from('attendances')
      .select('*, users:created_by(full_name, email), attendance_records(*)')
      .eq('class_id', classId)
      .order('created_at', { ascending: false })
  ])

  const combined: StreamItem[] = [
    ...(announcements || []).map(a => ({ ...(a as object), type: 'announcement' as const })) as StreamItem[],
    ...(assignments || []).map(a => ({ ...(a as object), type: 'assignment' as const })) as StreamItem[],
    ...(materials || []).map(m => ({ ...(m as object), type: 'material' as const })) as StreamItem[],
    ...(polls || []).map(p => ({ ...(p as object), type: 'poll' as const })) as StreamItem[],
    ...(attendances || []).map(a => ({ ...(a as object), type: 'attendance' as const })) as StreamItem[],
  ]

  // Sort by pinned first, then by created_at descending
  combined.sort((a, b) => {
    const aPinned = a.pinned ? 1 : 0
    const bPinned = b.pinned ? 1 : 0
    if (aPinned !== bPinned) return bPinned - aPinned
    
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  })

  // 2. Cache the result for 1 hour
  await redisSafe.set(cacheKey, combined, { ex: 3600 })

  return combined
}
