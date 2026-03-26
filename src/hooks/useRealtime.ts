
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'

let channelCounter = 0

/* ── Types ── */
interface Profile     { full_name: string | null; email: string }
interface ProfileName { full_name: string | null }

type Tables = Database['public']['Tables']

type AnnouncementRow = Tables['announcements']['Row'] & { users: Profile }
type AssignmentRow   = Tables['assignments']['Row']   & { users: Profile }
type MaterialRow     = Tables['materials']['Row']     & { users: ProfileName }
type PollResponseRow = Tables['poll_responses']['Row']
type PollRow         = Tables['polls']['Row']         & { users: Profile; poll_responses: PollResponseRow[] }
type AttendRecordRow = Tables['attendance_records']['Row']
type AttendanceRow   = Tables['attendances']['Row']   & { users: Profile; attendance_records: AttendRecordRow[] }
type ClassNoteRow    = Tables['class_notes']['Row']

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED AUTH GUARD  (singleton — resolves once, shared by every hook)
───────────────────────────────────────────────────────────────────────────── */

let authPromise: Promise<boolean> | null = null

/**
 * Ensures the Supabase browser client has a valid session before any
 * data‑fetching begins.  Only the **first** caller actually triggers
 * `getUser()` (with retries); every subsequent caller awaits the same
 * promise so there is no auth-lock contention.
 */
export function ensureAuth(supabase: ReturnType<typeof createClient>): Promise<boolean> {
  if (authPromise) return authPromise

  authPromise = (async () => {
    for (let i = 0; i < 5; i++) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) return true
      await new Promise((r) => setTimeout(r, 300))
    }
    return false
  })()

  // Reset after 10 s so a future mount can re-verify if the JWT expired
  authPromise.finally(() => {
    setTimeout(() => { authPromise = null }, 10_000)
  })

  return authPromise
}

/* ─────────────────────────────────────────────────────────────────────────────
   ANNOUNCEMENTS
───────────────────────────────────────────────────────────────────────────── */
export function useRealtimeAnnouncements(classId: string, userId: string) {
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([])
  const [hasSettled, setHasSettled] = useState(false)

  useEffect(() => {
    if (!classId || !userId) return
    let isMounted = true
    // Create client once per effect, not per render
    const supabase = createClient()
    const mountId = ++channelCounter
    setHasSettled(false)
    setAnnouncements([])

    const loadInitial = async () => {
      try {
        const authed = await ensureAuth(supabase)
        if (!authed || !isMounted) return
        const { data } = await supabase
          .from('announcements')
          .select('*, users(full_name,email)')
          .eq('class_id', classId)
          .order('pinned', { ascending: false })
          .order('created_at', { ascending: false })
        if (isMounted) setAnnouncements((data as AnnouncementRow[]) ?? [])
      } finally {
        if (isMounted) setHasSettled(true)
      }
    }

    loadInitial()

    const handlePayload = async (payload: any) => {
      if (!isMounted) return
      const targetId = payload.new?.id || payload.old?.id
      if (!targetId) return

      if (payload.eventType === 'DELETE') {
        setAnnouncements((prev) => prev.filter((a) => a.id !== targetId))
        return
      }

      const { data: newRow } = await supabase
        .from('announcements')
        .select('*, users(full_name,email)')
        .eq('id', targetId)
        .single()

      if (newRow && isMounted) {
        const row = newRow as AnnouncementRow
        setAnnouncements((prev) => {
          const exists = prev.find((a) => a.id === row.id)
          if (exists) return prev.map((a) => (a.id === row.id ? row : a))
          return [row, ...prev]
        })
      }
    }

    const channel = supabase
      .channel(`ann_${classId}_${mountId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'announcements',
        filter: `class_id=eq.${classId}`,
      }, handlePayload)
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') console.warn(`Announcements subscription status: ${status}`)
      })

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [classId, userId])

  return { announcements, hasSettled }
}

/* ─────────────────────────────────────────────────────────────────────────────
   ASSIGNMENTS
───────────────────────────────────────────────────────────────────────────── */
export function useRealtimeAssignments(classId: string, userId: string) {
  const [assignments, setAssignments] = useState<AssignmentRow[]>([])
  const [hasSettled, setHasSettled] = useState(false)

  useEffect(() => {
    if (!classId || !userId) return
    let isMounted = true
    const supabase = createClient()
    const mountId = ++channelCounter
    setHasSettled(false)
    setAssignments([])

    const loadInitial = async () => {
      try {
        const authed = await ensureAuth(supabase)
        if (!authed || !isMounted) return
        const { data } = await supabase
          .from('assignments')
          .select('*, users(full_name,email)')
          .eq('class_id', classId)
          .order('created_at', { ascending: false })
        if (isMounted) setAssignments((data as AssignmentRow[]) ?? [])
      } finally {
        if (isMounted) setHasSettled(true)
      }
    }

    loadInitial()

    const handlePayload = async (payload: any) => {
      if (!isMounted) return
      const targetId = payload.new?.id || payload.old?.id
      if (!targetId) return

      if (payload.eventType === 'DELETE') {
        setAssignments((prev) => prev.filter((a) => a.id !== targetId))
        return
      }

      const { data: newRow } = await supabase
        .from('assignments')
        .select('*, users(full_name,email)')
        .eq('id', targetId)
        .single()

      if (newRow && isMounted) {
        const row = newRow as AssignmentRow
        setAssignments((prev) => {
          const exists = prev.find((a) => a.id === row.id)
          if (exists) return prev.map((a) => (a.id === row.id ? row : a))
          return [row, ...prev]
        })
      }
    }

    const channel = supabase
      .channel(`asn_${classId}_${mountId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'assignments',
        filter: `class_id=eq.${classId}`,
      }, handlePayload)
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') console.warn(`Assignments subscription status: ${status}`)
      })

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [classId, userId])

  return { assignments, hasSettled }
}

/* ─────────────────────────────────────────────────────────────────────────────
   MATERIALS
───────────────────────────────────────────────────────────────────────────── */
export function useRealtimeMaterials(classId: string, userId: string) {
  const [materials, setMaterials] = useState<MaterialRow[]>([])
  const [hasSettled, setHasSettled] = useState(false)

  useEffect(() => {
    if (!classId || !userId) return
    let isMounted = true
    const supabase = createClient()
    const mountId = ++channelCounter
    setHasSettled(false)
    setMaterials([])

    const loadInitial = async () => {
      try {
        const authed = await ensureAuth(supabase)
        if (!authed || !isMounted) return
        const { data } = await supabase
          .from('materials')
          .select('*, users:created_by(full_name)')
          .eq('class_id', classId)
          .order('created_at', { ascending: false })
        if (isMounted) setMaterials((data as MaterialRow[]) ?? [])
      } finally {
        if (isMounted) setHasSettled(true)
      }
    }

    loadInitial()

    const handlePayload = async (payload: any) => {
      if (!isMounted) return
      const targetId = payload.new?.id || payload.old?.id
      if (!targetId) return

      if (payload.eventType === 'DELETE') {
        setMaterials((prev) => prev.filter((m) => m.id !== targetId))
        return
      }

      const { data: newRow } = await supabase
        .from('materials')
        .select('*, users:created_by(full_name)')
        .eq('id', targetId)
        .single()

      if (newRow && isMounted) {
        const row = newRow as MaterialRow
        setMaterials((prev) => {
          const exists = prev.find((m) => m.id === row.id)
          if (exists) return prev.map((m) => (m.id === row.id ? row : m))
          return [row, ...prev]
        })
      }
    }

    const channel = supabase
      .channel(`mat_${classId}_${mountId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'materials',
        filter: `class_id=eq.${classId}`,
      }, handlePayload)
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') console.warn(`Materials subscription status: ${status}`)
      })

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [classId, userId])

  return { materials, hasSettled }
}

/* ─────────────────────────────────────────────────────────────────────────────
   POLLS
───────────────────────────────────────────────────────────────────────────── */
export function useRealtimePolls(classId: string, userId: string) {
  const [polls, setPolls] = useState<PollRow[]>([])
  const [hasSettled, setHasSettled] = useState(false)

  useEffect(() => {
    if (!classId || !userId) return
    let isMounted = true
    const supabase = createClient()
    const mountId = ++channelCounter
    setHasSettled(false)
    setPolls([])

    const loadInitial = async () => {
      try {
        const authed = await ensureAuth(supabase)
        if (!authed || !isMounted) return
        const { data } = await supabase
          .from('polls')
          .select('*, users(full_name,email), poll_responses(*)')
          .eq('class_id', classId)
          .order('created_at', { ascending: false })
        if (isMounted) setPolls((data as PollRow[]) ?? [])
      } finally {
        if (isMounted) setHasSettled(true)
      }
    }

    loadInitial()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePayload = async (payload: any) => {
      if (!isMounted) return
      const targetId = payload.table === 'polls' 
        ? (payload.new?.id || payload.old?.id)
        : (payload.new?.poll_id || payload.old?.poll_id)
        
      if (!targetId) return

      if (payload.table === 'polls' && payload.eventType === 'DELETE') {
        setPolls((prev) => prev.filter((p) => p.id !== targetId))
        return
      }

      const { data: newRow } = await supabase
        .from('polls')
        .select('*, users(full_name,email), poll_responses(*)')
        .eq('id', targetId)
        .single()
        
      if (newRow && isMounted) {
        const row = newRow as PollRow
        setPolls((prev) => {
          const exists = prev.find((p) => p.id === row.id)
          if (exists) return prev.map((p) => p.id === row.id ? row : p)
          return [row, ...prev]
        })
      }
    }

    const channel = supabase
      .channel(`polls_${classId}_${mountId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'polls', filter: `class_id=eq.${classId}`,
      }, handlePayload)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'poll_responses',
      }, handlePayload)
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [classId, userId])

  return { polls, hasSettled }
}

/* ─────────────────────────────────────────────────────────────────────────────
   ATTENDANCES
───────────────────────────────────────────────────────────────────────────── */
export function useRealtimeAttendances(classId: string, userId: string) {
  const [attendances, setAttendances] = useState<AttendanceRow[]>([])
  const [hasSettled, setHasSettled] = useState(false)

  useEffect(() => {
    if (!classId || !userId) return
    let isMounted = true
    const supabase = createClient()
    const mountId = ++channelCounter
    setHasSettled(false)
    setAttendances([])

    const loadInitial = async () => {
      try {
        const authed = await ensureAuth(supabase)
        if (!authed || !isMounted) return
        const { data } = await supabase
          .from('attendances')
          .select('*, users(full_name,email), attendance_records(*)')
          .eq('class_id', classId)
          .order('created_at', { ascending: false })
        if (isMounted) setAttendances((data as AttendanceRow[]) ?? [])
      } finally {
        if (isMounted) setHasSettled(true)
      }
    }

    loadInitial()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePayload = async (payload: any) => {
      if (!isMounted) return
      const targetId = payload.table === 'attendances' 
        ? (payload.new?.id || payload.old?.id)
        : (payload.new?.attendance_id || payload.old?.attendance_id)
        
      if (!targetId) return

      if (payload.table === 'attendances' && payload.eventType === 'DELETE') {
        setAttendances((prev) => prev.filter((a) => a.id !== targetId))
        return
      }

      const { data: newRow } = await supabase
        .from('attendances')
        .select('*, users(full_name,email), attendance_records(*)')
        .eq('id', targetId)
        .single()
        
      if (newRow && isMounted) {
        const row = newRow as AttendanceRow
        setAttendances((prev) => {
          const exists = prev.find((a) => a.id === row.id)
          if (exists) return prev.map((a) => a.id === row.id ? row : a)
          return [row, ...prev]
        })
      }
    }

    const channel = supabase
      .channel(`attend_${classId}_${mountId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'attendances', filter: `class_id=eq.${classId}`,
      }, handlePayload)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'attendance_records',
      }, handlePayload)
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [classId, userId])

  return { attendances, hasSettled }
}

/* ─────────────────────────────────────────────────────────────────────────────
   STICKY NOTES
───────────────────────────────────────────────────────────────────────────── */
export function useRealtimeStickyNotes(classId: string, userId?: string) {
  const [notes, setNotes] = useState<ClassNoteRow[]>([])

  useEffect(() => {
    if (!classId || !userId) return
    let isMounted = true
    const supabase = createClient()
    const mountId = ++channelCounter

    const loadInitial = async () => {
      const authed = await ensureAuth(supabase)
      if (!authed || !isMounted) return
      const { data } = await supabase
        .from('class_notes')
        .select('*')
        .eq('class_id', classId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (data && isMounted) setNotes(data)
    }

    loadInitial()

    const channel = supabase
      .channel(`notes_${classId}_${userId}_${mountId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'class_notes',
        filter: `class_id=eq.${classId}`,
      }, (payload) => {
        if (!isMounted) return
        const noteUser = (payload.new as ClassNoteRow)?.user_id
          ?? (payload.old as ClassNoteRow)?.user_id
        if (noteUser !== userId) return

        if (payload.eventType === 'INSERT') {
          setNotes((prev) => [payload.new as ClassNoteRow, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setNotes((prev) => prev.map((n) => (n.id === payload.new.id ? payload.new as ClassNoteRow : n)))
        } else if (payload.eventType === 'DELETE') {
          setNotes((prev) => prev.filter((n) => n.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [classId, userId])

  return notes
}