'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getStreamFeed } from '@/lib/data/stream'

export function useStreamRealtime(classId: string, initialData: any[]) {
  const [feedItems, setFeedItems] = useState<any[]>(initialData)

  useEffect(() => {
    setFeedItems(initialData)
  }, [initialData])

  useEffect(() => {
    if (!classId) return
    let isMounted = true
    const supabase = createClient()

    const handlePayload = async (payload: any) => {
      if (!isMounted) return
      
      const { table, eventType, new: newRec, old: oldRec } = payload

      // Determine the primary ID of the feed item affected
      let targetId: string | null = null
      let itemType: string | null = null

      if (table === 'announcements') { targetId = newRec?.id || oldRec?.id; itemType = 'announcement' }
      else if (table === 'assignments') { targetId = newRec?.id || oldRec?.id; itemType = 'assignment' }
      else if (table === 'materials') { targetId = newRec?.id || oldRec?.id; itemType = 'material' }
      else if (table === 'polls') { targetId = newRec?.id || oldRec?.id; itemType = 'poll' }
      else if (table === 'poll_responses') { targetId = newRec?.poll_id || oldRec?.poll_id; itemType = 'poll' }
      else if (table === 'attendances') { targetId = newRec?.id || oldRec?.id; itemType = 'attendance' }
      else if (table === 'attendance_records') { targetId = newRec?.attendance_id || oldRec?.attendance_id; itemType = 'attendance' }

      if (!targetId || !itemType) return

      // Handle DELETE
      if (
        (table === 'announcements' || table === 'assignments' || table === 'materials' || 
         table === 'polls' || table === 'attendances') && 
        eventType === 'DELETE'
      ) {
        setFeedItems((prev) => prev.filter((item) => !(item.type === itemType && item.id === targetId)))
        return
      }

      // Handle INSERT/UPDATE by refetching the specific row to get joined relationships (users, etc.)
      try {
        let fetchQuery: any = supabase.from(itemType === 'poll' ? 'polls' : itemType === 'attendance' ? 'attendances' : table)

        if (itemType === 'announcement' || itemType === 'assignment') {
          fetchQuery = fetchQuery.select('*, users(full_name,email)')
        } else if (itemType === 'material') {
          fetchQuery = fetchQuery.select('*, users:created_by(full_name)')
        } else if (itemType === 'poll') {
          fetchQuery = fetchQuery.select('*, users(full_name,email), poll_responses(*)')
        } else if (itemType === 'attendance') {
          fetchQuery = fetchQuery.select('*, users(full_name,email), attendance_records(*)')
        }

        const { data: newRow } = await fetchQuery.eq('id', targetId).single()

        if (newRow && isMounted) {
          const formattedRow = { ...newRow, type: itemType }
          setFeedItems((prev) => {
            const exists = prev.find((item) => item.type === itemType && item.id === targetId)
            
            let updated = []
            if (exists) {
              updated = prev.map((item) => (item.type === itemType && item.id === targetId ? formattedRow : item))
            } else {
              updated = [formattedRow, ...prev]
            }

            // Re-sort
            return updated.sort((a, b) => {
              const aPinned = a.type === 'announcement' && (a as any).pinned ? 1 : 0
              const bPinned = b.type === 'announcement' && (b as any).pinned ? 1 : 0
              if (aPinned !== bPinned) return bPinned - aPinned
              return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
            })
          })
        }
      } catch (err) {
        console.error('Error refetching realtime row:', err)
      }
    }

    const channel = supabase
      .channel(`stream_feed_${classId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements', filter: `class_id=eq.${classId}` }, handlePayload)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments', filter: `class_id=eq.${classId}` }, handlePayload)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'materials', filter: `class_id=eq.${classId}` }, handlePayload)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'polls', filter: `class_id=eq.${classId}` }, handlePayload)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_responses' }, handlePayload)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendances', filter: `class_id=eq.${classId}` }, handlePayload)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_records' }, handlePayload)
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [classId])

  return feedItems
}
