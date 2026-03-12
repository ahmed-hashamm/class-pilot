
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

let channelCounter = 0

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

  // Reset after 30 s so a future mount can re-verify if the JWT expired
  authPromise.finally(() => {
    setTimeout(() => { authPromise = null }, 30_000)
  })

  return authPromise
}

/* ─────────────────────────────────────────────────────────────────────────────
   ANNOUNCEMENTS
───────────────────────────────────────────────────────────────────────────── */
export function useRealtimeAnnouncements(classId: string, userId: string) {
  const [announcements, setAnnouncements] = useState<any[]>([])
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
        if (isMounted) setAnnouncements(data ?? [])
      } finally {
        if (isMounted) setHasSettled(true)
      }
    }

    loadInitial()

    const channel = supabase
      .channel(`ann_${classId}_${mountId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'announcements',
        filter: `class_id=eq.${classId}`,
      }, async (payload) => {
        const { data: newRow } = await supabase
          .from('announcements')
          .select('*, users(full_name,email)')
          .eq('id', payload.new.id)
          .single()
        if (newRow && isMounted) setAnnouncements((prev) => [newRow, ...prev])
      })
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'announcements',
        filter: `class_id=eq.${classId}`,
      }, (payload) => {
        if (!isMounted) return
        setAnnouncements((prev) =>
          prev.map((a: any) => (a.id === payload.new.id ? { ...a, ...payload.new } : a))
        )
      })
      .on('postgres_changes', {
        event: 'DELETE', schema: 'public', table: 'announcements',
        filter: `class_id=eq.${classId}`,
      }, (payload) => {
        if (!isMounted) return
        setAnnouncements((prev) => prev.filter((a: any) => a.id !== payload.old.id))
      })
      .subscribe()

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
  const [assignments, setAssignments] = useState<any[]>([])
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
        if (isMounted) setAssignments(data ?? [])
      } finally {
        if (isMounted) setHasSettled(true)
      }
    }

    loadInitial()

    const channel = supabase
      .channel(`asn_${classId}_${mountId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'assignments',
        filter: `class_id=eq.${classId}`,
      }, async (payload) => {
        const { data: newRow } = await supabase
          .from('assignments')
          .select('*, users(full_name,email)')
          .eq('id', payload.new.id)
          .single()
        if (newRow && isMounted) setAssignments((prev) => [newRow, ...prev])
      })
      .on('postgres_changes', {
        event: 'DELETE', schema: 'public', table: 'assignments',
        filter: `class_id=eq.${classId}`,
      }, (payload) => {
        if (!isMounted) return
        setAssignments((prev) => prev.filter((a: any) => a.id !== payload.old.id))
      })
      .subscribe()

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
  const [materials, setMaterials] = useState<any[]>([])
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
        if (isMounted) setMaterials(data ?? [])
      } finally {
        if (isMounted) setHasSettled(true)
      }
    }

    loadInitial()

    const channel = supabase
      .channel(`mat_${classId}_${mountId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'materials',
        filter: `class_id=eq.${classId}`,
      }, async (payload) => {
        if (!isMounted) return
        if (payload.eventType === 'INSERT') {
          const { data: newMaterial } = await supabase
            .from('materials')
            .select('*, users:created_by(full_name)')
            .eq('id', payload.new.id)
            .single()
          if (newMaterial && isMounted) setMaterials((prev) => [newMaterial, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setMaterials((prev) =>
            prev.map((m: any) => (m.id === payload.new.id ? { ...m, ...payload.new } : m))
          )
        } else if (payload.eventType === 'DELETE') {
          setMaterials((prev) => prev.filter((m: any) => m.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [classId, userId])

  return { materials, hasSettled }
}

/* ─────────────────────────────────────────────────────────────────────────────
   STICKY NOTES
───────────────────────────────────────────────────────────────────────────── */
export function useRealtimeStickyNotes(classId: string, userId?: string) {
  const [notes, setNotes] = useState<any[]>([])

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
        const noteUser = payload.new
          ? (payload.new as any).user_id
          : (payload.old as any).user_id
        if (noteUser !== userId) return

        if (payload.eventType === 'INSERT') {
          setNotes((prev) => [payload.new, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setNotes((prev) => prev.map((n) => (n.id === payload.new.id ? payload.new : n)))
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