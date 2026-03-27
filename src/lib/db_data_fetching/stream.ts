'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database.utf8'

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
  | (AnnouncementRow & { type: 'announcement' })
  | (AssignmentRow & { type: 'assignment' })
  | (MaterialRow & { type: 'material' })
  | (PollRow & { type: 'poll' })
  | (AttendanceRow & { type: 'attendance' })


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
  const combined: StreamItem[] = [
    ...(announcements || []).map(a => ({ ...a, type: 'announcement' as const })),
    ...(assignments || []).map(a => ({ ...a, type: 'assignment' as const })),
    ...(materials || []).map(m => ({ ...m, type: 'material' as const })),
    ...(polls || []).map(p => ({ ...p, type: 'poll' as const })),
    ...(attendances || []).map(a => ({ ...a, type: 'attendance' as const })),
  ]

  // Sort by pinned first, then by created_at descending
  combined.sort((a, b) => {
    const aPinned = a.type === 'announcement' && (a as AnnouncementRow).pinned ? 1 : 0
    const bPinned = b.type === 'announcement' && (b as AnnouncementRow).pinned ? 1 : 0
    if (aPinned !== bPinned) return bPinned - aPinned
    
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  })

  return combined
}
