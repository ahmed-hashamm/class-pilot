// // 'use client'

// // import { useEffect, useState } from 'react'
// // import { createClient } from '@/lib/supabase/client'
// // import type { RealtimeChannel } from '@supabase/supabase-js'

// // const supabase = createClient()

// // /* ---------------- NOTIFICATIONS ---------------- */
// // export interface Notification {
// //   id: string
// //   user_id: string
// //   type: string
// //   message: string
// //   created_at: string
// // }

// // export function useRealtimeNotifications(userId?: string) {
// //   const [notifications, setNotifications] = useState<Notification[]>([])

// //   useEffect(() => {
// //     if (!userId) return

// //     let isMounted = true

// //     // Load initial notifications
// //     supabase
// //       .from('notifications')
// //       .select('*')
// //       .eq('user_id', userId)
// //       .order('created_at', { ascending: false })
// //       .limit(20)
// //       .then(({ data }) => {
// //         if (data && isMounted) setNotifications(data as Notification[])
// //       })

// //     // Subscribe to INSERT
// //     const channel: RealtimeChannel = supabase
// //       .channel(`notifications:${userId}`)
// //       .on(
// //         'postgres_changes',
// //         {
// //           event: 'INSERT',
// //           schema: 'public',
// //           table: 'notifications',
// //           filter: `user_id=eq.${userId}`,
// //         },
// //         (payload) => {
// //           setNotifications((prev) => [payload.new as Notification, ...prev])
// //         }
// //       )
// //       .subscribe()

// //     return () => {
// //       isMounted = false
// //       supabase.removeChannel(channel)
// //     }
// //   }, [userId])

// //   return notifications
// // }

// // /* ---------------- ANNOUNCEMENTS ---------------- */
// // export interface Announcement {
// //   id: string
// //   class_id: string
// //   title: string
// //   content: string
// //   pinned?: boolean
// //   created_at: string
// //   users?: { full_name?: string; email?: string }
// // }

// // export function useRealtimeAnnouncements(classId: string) {
// //   const [announcements, setAnnouncements] = useState<Announcement[]>([])

// //   useEffect(() => {
// //     if (!classId) return

// //     let isMounted = true

// //     // Load initial announcements
// //     supabase
// //       .from('announcements')
// //       .select('*, users(full_name,email)')
// //       .eq('class_id', classId)
// //       .order('pinned', { ascending: false })
// //       .order('created_at', { ascending: false })
// //       .then(({ data }) => {
// //         if (data && isMounted) setAnnouncements(data as Announcement[])
// //       })

// //     const channel: RealtimeChannel = supabase.channel(`announcements:${classId}`)

// //     channel
// //       // INSERT
// //       .on(
// //         'postgres_changes',
// //         { event: 'INSERT', schema: 'public', table: 'announcements', filter: `class_id=eq.${classId}` },
// //         (payload) => {
// //           setAnnouncements((prev) => [payload.new as Announcement, ...prev])
// //         }
// //       )
// //       // UPDATE
// //       .on(
// //         'postgres_changes',
// //         { event: 'UPDATE', schema: 'public', table: 'announcements', filter: `class_id=eq.${classId}` },
// //         (payload) => {
// //           setAnnouncements((prev) =>
// //             prev.map((a) => (a.id === (payload.new as Announcement).id ? (payload.new as Announcement) : a))
// //           )
// //         }
// //       )
// //       // DELETE
// //       .on(
// //         'postgres_changes',
// //         { event: 'DELETE', schema: 'public', table: 'announcements', filter: `class_id=eq.${classId}` },
// //         (payload) => {
// //           setAnnouncements((prev) => prev.filter((a) => a.id !== (payload.old as Announcement).id))
// //         }
// //       )
// //       .subscribe()

// //     return () => {
// //       isMounted = false
// //       supabase.removeChannel(channel)
// //     }
// //   }, [classId])

// //   return announcements
// // }

// // /* ---------------- ASSIGNMENTS ---------------- */
// // export interface Assignment {
// //   id: string
// //   class_id: string
// //   title: string
// //   content?: string
// //   dueDate?: string
// //   created_at: string
// //   users?: { full_name?: string; email?: string }
// // }

// // export function useRealtimeAssignments(classId: string) {
// //   const [assignments, setAssignments] = useState<Assignment[]>([])

// //   useEffect(() => {
// //     if (!classId) return
// //     let isMounted = true
  
// //     const loadAssignments = async () => {
// //       try {
// //         const { data } = await supabase
// //           .from('assignments')
// //           .select('*, users(full_name,email)')
// //           .eq('class_id', classId)
// //           .order('created_at', { ascending: false })
  
// //         if (data && isMounted) setAssignments(data as Assignment[])
// //       } catch (err) {
// //         console.error(err)
// //       }
// //     }
  
// //     loadAssignments()
  
// //     const channel: RealtimeChannel = supabase.channel(`assignments:${classId}`)
// //     channel
// //       .on(
// //         'postgres_changes',
// //         { event: 'INSERT', schema: 'public', table: 'assignments', filter: `class_id=eq.${classId}` },
// //         (payload) => setAssignments((prev) => [payload.new as Assignment, ...prev])
// //       )
// //       .on(
// //         'postgres_changes',
// //         { event: 'UPDATE', schema: 'public', table: 'assignments', filter: `class_id=eq.${classId}` },
// //         (payload) =>
// //           setAssignments((prev) =>
// //             prev.map((a) => (a.id === (payload.new as Assignment).id ? (payload.new as Assignment) : a))
// //           )
// //       )
// //       .on(
// //         'postgres_changes',
// //         { event: 'DELETE', schema: 'public', table: 'assignments', filter: `class_id=eq.${classId}` },
// //         (payload) => setAssignments((prev) => prev.filter((a) => a.id !== (payload.old as Assignment).id))
// //       )
// //       .subscribe()
  
// //     return () => supabase.removeChannel(channel)
// //   }, [classId])
  
    
// //   return assignments
// // }

// // /* ---------------- STICKY NOTES ---------------- */
// // export interface Note {
// //   id: string
// //   class_id: string
// //   user_id: string
// //   content: string
// //   created_at: string
// // }

// // export function useRealtimeStickyNotes(classId: string, userId?: string) {
// //   const [notes, setNotes] = useState<Note[]>([])

// //   useEffect(() => {
// //     if (!classId || !userId) return

// //     let isMounted = true

// //     // Load initial notes
// //     supabase
// //       .from('class_notes')
// //       .select('*')
// //       .eq('class_id', classId)
// //       .eq('user_id', userId)
// //       .order('created_at', { ascending: false })
// //       .then(({ data }) => {
// //         if (data && isMounted) setNotes(data as Note[])
// //       })

// //     const channel: RealtimeChannel = supabase.channel(`class_notes:${classId}:${userId}`)

// //     channel
// //       .on(
// //         'postgres_changes',
// //         {
// //           event: '*',
// //           schema: 'public',
// //           table: 'class_notes',
// //           filter: `class_id=eq.${classId}&user_id=eq.${userId}`,
// //         },
// //         (payload) => {
// //           if (!isMounted) return
// //           if (payload.eventType === 'INSERT') {
// //             setNotes((prev) => [payload.new as Note, ...prev])
// //           } else if (payload.eventType === 'UPDATE') {
// //             setNotes((prev) =>
// //               prev.map((n) => (n.id === (payload.new as Note).id ? (payload.new as Note) : n))
// //             )
// //           } else if (payload.eventType === 'DELETE') {
// //             setNotes((prev) => prev.filter((n) => n.id !== (payload.old as Note).id))
// //           }
// //         }
// //       )
// //       .subscribe()

// //     return () => {
// //       isMounted = false
// //       supabase.removeChannel(channel)
// //     }
// //   }, [classId, userId])

// //   return notes
// // }

// 'use client'

// import { useEffect, useState } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import type { RealtimeChannel } from '@supabase/supabase-js'

// // We keep this here, but inside hooks we ensure we check for session
// const supabase = createClient()

// /* ---------------- NOTIFICATIONS ---------------- */
// export interface Notification {
//   id: string
//   user_id: string
//   type: string
//   message: string
//   created_at: string
// }

// export function useRealtimeNotifications(userId: string, classId: string) {
//   const [notifications, setNotifications] = useState<Notification[]>([])

//   useEffect(() => {
//     if (!userId) return

//     let isMounted = true

//     // Load initial notifications
//     supabase
//       .from('notifications')
//       .select('*')
//       .eq('user_id', userId)
//       .order('created_at', { ascending: false })
//       .limit(20)
//       .then(({ data }) => {
//         if (data && isMounted) setNotifications(data as Notification[])
//       })

//     // Subscribe to INSERT
//     const channel: RealtimeChannel = supabase
//       .channel(`notifications:${userId}`)
//       .on(
//         'postgres_changes',
//         {
//           event: 'INSERT',
//           schema: 'public',
//           table: 'notifications',
//           filter: `user_id=eq.${userId}`,
//         },
//         (payload) => {
//           setNotifications((prev) => [payload.new as Notification, ...prev])
//         }
//       )
//       .subscribe()

//     return () => {
//       isMounted = false
//       supabase.removeChannel(channel)
//     }
//   }, [userId,classId])

//   return notifications
// }


// /* ---------------- ANNOUNCEMENTS ---------------- */
// export interface Announcement {
//   id: string
//   class_id: string
//   title: string
//   content: string
//   pinned?: boolean
//   created_at: string
//   users?: { full_name?: string; email?: string }
// }
// // export function useRealtimeAnnouncements(classId: string, userId: string) {
// //   const [announcements, setAnnouncements] = useState<Announcement[]>([])

// //   useEffect(() => {
// //     // 1. Guard: Ensure classId exists before running
// //     if (!classId) return

// //     let isMounted = true

// //     async function loadInitialData() {
// //       const { data, error } = await supabase
// //         .from('announcements')
// //         .select('*, users(full_name,email)')
// //         .eq('class_id', classId)
// //         .order('pinned', { ascending: false })
// //         .order('created_at', { ascending: false })

// //       if (!error && data && isMounted) {
// //         setAnnouncements(data as Announcement[])
// //       }
// //     }

// //     loadInitialData()

// //     const channel: RealtimeChannel = supabase.channel(`announcements:${classId}`)

// //     channel
// //       .on(
// //         'postgres_changes',
// //         { event: 'INSERT', schema: 'public', table: 'announcements', filter: `class_id=eq.${classId}` },
// //         (payload) => {
// //           setAnnouncements((prev) => [payload.new as Announcement, ...prev])
// //         }
// //       )
// //       .on(
// //         'postgres_changes',
// //         { event: 'UPDATE', schema: 'public', table: 'announcements', filter: `class_id=eq.${classId}` },
// //         (payload) => {
// //           setAnnouncements((prev) =>
// //             prev.map((a) => (a.id === (payload.new as Announcement).id ? (payload.new as Announcement) : a))
// //           )
// //         }
// //       )
// //       .on(
// //         'postgres_changes',
// //         { event: 'DELETE', schema: 'public', table: 'announcements', filter: `class_id=eq.${classId}` },
// //         (payload) => {
// //           setAnnouncements((prev) => prev.filter((a) => a.id !== (payload.old as Announcement).id))
// //         }
// //       )
// //       .subscribe()

// //     return () => {
// //       isMounted = false
// //       supabase.removeChannel(channel)
// //     }
// //     // Added classId to dependency to ensure it re-triggers on navigation
// //   }, [classId, userId])

// //   return announcements
// // }
// export function useRealtimeAnnouncements(classId: string, userId: string) {
//   const [announcements, setAnnouncements] = useState<Announcement[]>([])

//   useEffect(() => {
//     if (!classId) return
//     let isMounted = true

//     // RESET: Clear old class data immediately
//     setAnnouncements([])

//     async function loadInitialData() {
//       const { data, error } = await supabase
//         .from('announcements')
//         .select('*, users(full_name,email)')
//         .eq('class_id', classId)
//         .order('pinned', { ascending: false })
//         .order('created_at', { ascending: false })

//       if (!error && data && isMounted) setAnnouncements(data as Announcement[])
//     }

//     loadInitialData()

//     const channel = supabase.channel(`announcements:${classId}`)
//       .on('postgres_changes', { 
//         event: 'INSERT', schema: 'public', table: 'announcements', filter: `class_id=eq.${classId}` 
//       }, async (payload) => {
//         // SIDE-FETCH: Get full record including user info
//         const { data: newRow } = await supabase
//           .from('announcements')
//           .select('*, users(full_name,email)')
//           .eq('id', payload.new.id)
//           .single()
        
//         if (newRow && isMounted) setAnnouncements((prev) => [newRow as Announcement, ...prev])
//       })
//       .on('postgres_changes', { 
//         event: 'UPDATE', schema: 'public', table: 'announcements', filter: `class_id=eq.${classId}` 
//       }, (payload) => {
//         setAnnouncements((prev) => prev.map((a) => (a.id === payload.new.id ? { ...a, ...payload.new } : a)))
//       })
//       .on('postgres_changes', { 
//         event: 'DELETE', schema: 'public', table: 'announcements', filter: `class_id=eq.${classId}` 
//       }, (payload) => {
//         setAnnouncements((prev) => prev.filter((a) => a.id !== payload.old.id))
//       })
//       .subscribe()

//     return () => {
//       isMounted = false
//       supabase.removeChannel(channel)
//     }
//   }, [classId, userId])

//   return announcements
// }

// /* ---------------- ASSIGNMENTS ---------------- */
// export interface Assignment {
//   id: string
//   class_id: string
//   title: string
//   content?: string
//   dueDate?: string
//   created_at: string
//   users?: { full_name?: string; email?: string }
// }
// export function useRealtimeAssignments(classId: string, userId: string) {
//   const [assignments, setAssignments] = useState<Assignment[]>([])

//   useEffect(() => {
//     if (!classId) return
//     let isMounted = true
//     setAssignments([]) // Reset state
  
//     const loadAssignments = async () => {
//       const { data } = await supabase
//         .from('assignments')
//         .select('*, users(full_name,email)')
//         .eq('class_id', classId)
//         .order('created_at', { ascending: false })
  
//       if (data && isMounted) setAssignments(data as Assignment[])
//     }
  
//     loadAssignments()
  
//     const channel = supabase.channel(`assignments:${classId}`)
//       .on('postgres_changes', { 
//         event: 'INSERT', schema: 'public', table: 'assignments', filter: `class_id=eq.${classId}` 
//       }, async (payload) => {
//         const { data: newRow } = await supabase
//           .from('assignments')
//           .select('*, users(full_name,email)')
//           .eq('id', payload.new.id)
//           .single()
//         if (newRow && isMounted) setAssignments((prev) => [newRow as Assignment, ...prev])
//       })
//       .on('postgres_changes', { 
//         event: 'UPDATE', schema: 'public', table: 'assignments', filter: `class_id=eq.${classId}` 
//       }, (payload) => {
//         setAssignments((prev) => prev.map((a) => (a.id === payload.new.id ? { ...a, ...payload.new } : a)))
//       })
//       .on('postgres_changes', { 
//         event: 'DELETE', schema: 'public', table: 'assignments', filter: `class_id=eq.${classId}` 
//       }, (payload) => setAssignments((prev) => prev.filter((a) => a.id !== payload.old.id)))
//       .subscribe()
  
//     return () => {
//       isMounted = false
//       supabase.removeChannel(channel)
//     }
//   }, [classId, userId])
  
//   return assignments
// }
// // export function useRealtimeAssignments(classId: string, userId: string) {
  
// //   const [assignments, setAssignments] = useState<Assignment[]>([])

// //   useEffect(() => {
// //     if (!classId) return
// //     let isMounted = true
  
// //     const loadAssignments = async () => {
// //       try {
// //         const { data, error } = await supabase
// //           .from('assignments')
// //           .select('*, users(full_name,email)')
// //           .eq('class_id', classId)
// //           .order('created_at', { ascending: false })
  
// //         if (!error && data && isMounted) {
// //           setAssignments(data as Assignment[])
// //         }
// //       } catch (err) {
// //         console.error(err)
// //       }
// //     }
  
// //     loadAssignments()
  
// //     const channel: RealtimeChannel = supabase.channel(`assignments:${classId}`)
// //     channel
// //       .on(
// //         'postgres_changes',
// //         { event: 'INSERT', schema: 'public', table: 'assignments', filter: `class_id=eq.${classId}` },
// //         (payload) => setAssignments((prev) => [payload.new as Assignment, ...prev])
// //       )
// //       .on(
// //         'postgres_changes',
// //         { event: 'UPDATE', schema: 'public', table: 'assignments', filter: `class_id=eq.${classId}` },
// //         (payload) =>
// //           setAssignments((prev) =>
// //             prev.map((a) => (a.id === (payload.new as Assignment).id ? (payload.new as Assignment) : a))
// //           )
// //       )
// //       .on(
// //         'postgres_changes',
// //         { event: 'DELETE', schema: 'public', table: 'assignments', filter: `class_id=eq.${classId}` },
// //         (payload) => setAssignments((prev) => prev.filter((a) => a.id !== (payload.old as Announcement).id))
// //       )
// //       .subscribe()
  
// //     return () => {
// //       isMounted = false
// //       supabase.removeChannel(channel)
// //     }
// //     // Re-trigger on classId change
// //   }, [classId, userId])
  
// //   return assignments
// // }
// /* ---------------- STICKY NOTES ---------------- */
// export interface Note {
//   id: string
//   class_id: string
//   user_id: string
//   content: string
//   created_at: string
// }

// export function useRealtimeStickyNotes(classId: string, userId?: string) {
//   const [notes, setNotes] = useState<Note[]>([])

//   useEffect(() => {
//     if (!classId || !userId) return

//     let isMounted = true

//     // Load initial notes
//     supabase
//       .from('class_notes')
//       .select('*')
//       .eq('class_id', classId)
//       .eq('user_id', userId)
//       .order('created_at', { ascending: false })
//       .then(({ data }) => {
//         if (data && isMounted) setNotes(data as Note[])
//       })

//     const channel: RealtimeChannel = supabase.channel(`class_notes:${classId}:${userId}`)

//     channel
//       .on(
//         'postgres_changes',
//         {
//           event: '*',
//           schema: 'public',
//           table: 'class_notes',
//           filter: `class_id=eq.${classId}&user_id=eq.${userId}`,
//         },
//         (payload) => {
//           if (!isMounted) return
//           if (payload.eventType === 'INSERT') {
//             setNotes((prev) => [payload.new as Note, ...prev])
//           } else if (payload.eventType === 'UPDATE') {
//             setNotes((prev) =>
//               prev.map((n) => (n.id === (payload.new as Note).id ? (payload.new as Note) : n))
//             )
//           } else if (payload.eventType === 'DELETE') {
//             setNotes((prev) => prev.filter((n) => n.id !== (payload.old as Note).id))
//           }
//         }
//       )
//       .subscribe()

//     return () => {
//       isMounted = false
//       supabase.removeChannel(channel)
//     }
//   }, [classId, userId])

//   return notes
// }


// // export function useRealtimeMaterials(classId: string, userId: string) {
// //   const [materials, setMaterials] = useState<any[]>([])
// //   const supabase = createClient()

// //   useEffect(() => {
// //     // 1. Initial Fetch of Materials
// //     const fetchMaterials = async () => {
// //       const { data, error } = await supabase
// //         .from('materials')
// //         .select(`
// //           *,
// //           users:created_by (full_name)
// //         `)
// //         .eq('class_id', classId)
// //         .order('created_at', { ascending: false })

// //       if (error) {
// //         console.error('Error fetching materials:', error)
// //       } else {
// //         setMaterials(data || [])
// //       }
// //     }

// //     fetchMaterials()

// //     // 2. Realtime Subscription
// //     const channel = supabase
// //       .channel(`realtime:materials:${classId}`)
// //       .on(
// //         'postgres_changes',
// //         {
// //           event: '*',
// //           schema: 'public',
// //           table: 'materials',
// //           filter: `class_id=eq.${classId}`,
// //         },
// //         async (payload) => {
// //           if (payload.eventType === 'INSERT') {
// //             // For inserts, we fetch the full row to get the joined 'users' data
// //             const { data: newMaterial } = await supabase
// //               .from('materials')
// //               .select('*, users:created_by (full_name)')
// //               .eq('id', payload.new.id)
// //               .single()
            
// //             if (newMaterial) {
// //               setMaterials((prev) => [newMaterial, ...prev])
// //             }
// //           } else if (payload.eventType === 'UPDATE') {
// //             setMaterials((prev) =>
// //               prev.map((m) => (m.id === payload.new.id ? { ...m, ...payload.new } : m))
// //             )
// //           } else if (payload.eventType === 'DELETE') {
// //             setMaterials((prev) => prev.filter((m) => m.id === payload.old.id))
// //           }
// //         }
// //       )
// //       .subscribe()

// //     return () => {
// //       supabase.removeChannel(channel)
// //     }
// //   }, [classId, supabase])

// //   return materials
// // }
// export function useRealtimeMaterials(classId: string, userId: string) {
//   const [materials, setMaterials] = useState<any[]>([])

//   useEffect(() => {
//     if (!classId) return
//     let isMounted = true
//     setMaterials([]) // Reset state

//     const fetchMaterials = async () => {
//       const { data } = await supabase
//         .from('materials')
//         .select('*, users:created_by (full_name)')
//         .eq('class_id', classId)
//         .order('created_at', { ascending: false })

//       if (data && isMounted) setMaterials(data || [])
//     }

//     fetchMaterials()

//     const channel = supabase.channel(`materials:${classId}`)
//       .on('postgres_changes', { 
//         event: 'INSERT', schema: 'public', table: 'materials', filter: `class_id=eq.${classId}` 
//       }, async (payload) => {
//         const { data: newMaterial } = await supabase
//           .from('materials')
//           .select('*, users:created_by (full_name)')
//           .eq('id', payload.new.id)
//           .single()
//         if (newMaterial && isMounted) setMaterials((prev) => [newMaterial, ...prev])
//       })
//       .on('postgres_changes', { 
//         event: 'UPDATE', schema: 'public', table: 'materials', filter: `class_id=eq.${classId}` 
//       }, (payload) => {
//         setMaterials((prev) => prev.map((m) => (m.id === payload.new.id ? { ...m, ...payload.new } : m)))
//       })
//       .on('postgres_changes', { 
//         event: 'DELETE', schema: 'public', table: 'materials', filter: `class_id=eq.${classId}` 
//       }, (payload) => {
//         setMaterials((prev) => prev.filter((m) => m.id !== payload.old.id))
//       })
//       .subscribe()

//     return () => {
//       isMounted = false
//       supabase.removeChannel(channel)
//     }
//   }, [classId, userId])

//   return materials
// }
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

const supabase = createClient()

/* ---------------- ANNOUNCEMENTS ---------------- */
export function useRealtimeAnnouncements(classId: string, userId: string) {
  const [announcements, setAnnouncements] = useState<any[]>([])

  useEffect(() => {
    if (!classId) return
    let isMounted = true

    const loadInitial = async () => {
      const { data } = await supabase
        .from('announcements')
        .select('*, users(full_name,email)')
        .eq('class_id', classId)
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false })
      if (data && isMounted) setAnnouncements(data)
    }
    loadInitial()

    const channel = supabase.channel(`announcements_feed_${classId}`)
      .on('postgres_changes', { 
        event: 'INSERT', schema: 'public', table: 'announcements', filter: `class_id=eq.${classId}` 
      }, async (payload) => {
        // SIDE-FETCH: Get full record with user join
        const { data: newRow } = await supabase
          .from('announcements')
          .select('*, users(full_name,email)')
          .eq('id', payload.new.id)
          .single()
        
        if (newRow && isMounted) {
          setAnnouncements((prev) => [newRow, ...prev])
        }
      })
      .on('postgres_changes', { 
        event: 'UPDATE', schema: 'public', table: 'announcements', filter: `class_id=eq.${classId}` 
      }, (payload) => {
        setAnnouncements((prev) => prev.map((a) => (a.id === payload.new.id ? { ...a, ...payload.new } : a)))
      })
      .on('postgres_changes', { 
        event: 'DELETE', schema: 'public', table: 'announcements', filter: `class_id=eq.${classId}` 
      }, (payload) => {
        setAnnouncements((prev) => prev.filter((a) => a.id !== payload.old.id))
      })
      .subscribe()

    return () => { isMounted = false; supabase.removeChannel(channel) }
  }, [classId])

  return announcements
}

/* ---------------- ASSIGNMENTS ---------------- */
export function useRealtimeAssignments(classId: string, userId: string) {
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    if (!classId) return;
    let isMounted = true;

    // Reset state when classId changes
    setAssignments([]);

    const loadInitial = async () => {
      const { data } = await supabase
        .from('assignments')
        .select('*, users(full_name,email)')
        .eq('class_id', classId)
        .order('created_at', { ascending: false });
      if (data && isMounted) setAssignments(data);
    };

    loadInitial();

    const channel = supabase.channel(`assignments_realtime_${classId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'assignments', filter: `class_id=eq.${classId}` },
        async (payload) => {
          // IMPORTANT: We fetch the full row to get the 'users' join 
          // that standard Realtime doesn't provide.
          const { data: newRow } = await supabase
            .from('assignments')
            .select('*, users(full_name,email)')
            .eq('id', payload.new.id)
            .single();

          if (newRow && isMounted) {
            // Use a functional update and a new array reference [...]
            setAssignments((current) => [newRow, ...current]);
          }
        }
      )
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'assignments', filter: `class_id=eq.${classId}` }, 
        (payload) => {
          setAssignments((current) => current.filter(a => a.id !== payload.old.id));
        }
      )
      .subscribe((status) => {
        console.log("Assignment Sync Status:", status);
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [classId, userId]); // Dependencies are correct

  return assignments;
}
/* ---------------- MATERIALS ---------------- */
export function useRealtimeMaterials(classId: string, userId: string) {
  const [materials, setMaterials] = useState<any[]>([])

  useEffect(() => {
    if (!classId) return
    let isMounted = true

    // 1. Clear state immediately on class change to prevent "stale" data
    setMaterials([])

    const fetchMaterials = async () => {
      try {
        const { data, error } = await supabase
          .from('materials')
          .select(`
            *,
            users:created_by (full_name)
          `)
          .eq('class_id', classId)
          .order('created_at', { ascending: false })

        if (!error && data && isMounted) {
          setMaterials(data)
        }
      } catch (err) {
        console.error('Initial fetch error:', err)
      }
    }

    fetchMaterials()

    // 2. Realtime Subscription
    // Use a unique channel name per class to avoid cross-talk
    const channel = supabase
      .channel(`materials_feed_${classId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'materials',
          filter: `class_id=eq.${classId}`,
        },
        async (payload) => {
          if (!isMounted) return

          if (payload.eventType === 'INSERT') {
            // SIDE-FETCH: Standard Realtime doesn't send the 'users' join.
            // We fetch the full row manually so the Feed doesn't need a refresh.
            const { data: newMaterial } = await supabase
              .from('materials')
              .select('*, users:created_by (full_name)')
              .eq('id', payload.new.id)
              .single()
            
            if (newMaterial && isMounted) {
              setMaterials((prev) => [newMaterial, ...prev])
            }
          } 
          
          else if (payload.eventType === 'UPDATE') {
            // Merge the update into existing state to preserve the 'users' join 
            // that might already be there from the initial load.
            setMaterials((prev) =>
              prev.map((m) => (m.id === payload.new.id ? { ...m, ...payload.new } : m))
            )
          } 
          
          else if (payload.eventType === 'DELETE') {
            setMaterials((prev) => prev.filter((m) => m.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
    // Dependencies: classId is the driver. userId included for auth stability.
  }, [classId, userId])

  return materials
}
/* ---------------- STICKY NOTES ---------------- */
export function useRealtimeStickyNotes(classId: string, userId?: string) {
  const [notes, setNotes] = useState<any[]>([])

  useEffect(() => {
    if (!classId || !userId) return
    let isMounted = true

    const loadInitial = async () => {
      const { data } = await supabase
        .from('class_notes')
        .select('*')
        .eq('class_id', classId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (data && isMounted) setNotes(data)
    }
    loadInitial()

    const channel = supabase.channel(`notes_${classId}_${userId}`)
      .on('postgres_changes', { 
        event: '*', schema: 'public', table: 'class_notes', filter: `class_id=eq.${classId}` 
      }, (payload) => {
        if (!isMounted) return

        // Manual filter: Only process if the note belongs to this user
        const noteUser = payload.new ? (payload.new as any).user_id : (payload.old as any).user_id
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

    return () => { isMounted = false; supabase.removeChannel(channel) }
  }, [classId, userId])

  return notes
}

/**
 * Observes all `.cp-reveal` elements and adds `.cp-visible` when they
 * enter the viewport, triggering the fade-up animation defined in globals.css.
 *
 * @param dep - Optional dependency (e.g. a tab/view state) that causes the
 *              hook to re-observe newly rendered elements when it changes.
 *
 * @example
 * // Basic usage
 * useReveal();
 *
 * // Re-observe when a toggle changes (e.g. teacher/student tab)
 * useReveal(activeView);
 */
export function useReveal(dep?: unknown) {
  useEffect(() => {
    // Small delay lets React flush new DOM nodes before we query them
    const id = setTimeout(() => {
      const els = document.querySelectorAll<HTMLElement>(".cp-reveal:not(.cp-visible)");
      const obs = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add("cp-visible");
          }),
        { threshold: 0.08 }
      );
      els.forEach((el) => obs.observe(el));
      return () => obs.disconnect();
    }, 50);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep]);
}