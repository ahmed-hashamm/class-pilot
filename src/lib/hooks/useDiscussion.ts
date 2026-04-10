'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  getDiscussionMessages, 
  sendDiscussionMessage, 
  deleteDiscussionMessage,
  getDiscussionMessageById 
} from '@/actions/DiscussionActions'
import { DiscussionTopic } from '@/lib/validations/discussion'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export interface DiscussionMessage {
  id: string
  content: string
  created_at: string
  user_id: string
  is_author_teacher: boolean
  users: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

/**
 * custom hook to manage class discussions with real-time sync.
 * 
 * Features:
 * - Persistent caching via React Query (survives tab switches)
 * - Real-time INSERT/DELETE sync via Supabase Postgres Changes
 * - Unique channel naming (via randomId) to prevent subscription collisions during re-renders
 * - Optimistic UI updates for snappy messaging experience
 * 
 * @param classId The ID of the class room
 * @param topic The specific discussion topic (e.g., 'general', 'homework')
 * @param userId The ID of the current logged-in user
 */
export function useDiscussion(classId: string, topic: DiscussionTopic, userId: string) {
  const queryClient = useQueryClient()
  const mountedRef = useRef(true)
  const [sending, setSending] = useState(false)
  const [errorVisible, setErrorVisible] = useState<string | null>(null)
  const [status, setStatus] = useState<'SUBSCRIBED' | 'TIMED_OUT' | 'CLOSED' | 'ERROR' | 'JOINING'>('JOINING')

  // Using React Query for persistent caching across tab unmounts
  const { 
    data: messages = [], 
    isLoading: loading,
    error: queryError
  } = useQuery({
    queryKey: ['discussion', classId, topic],
    queryFn: async () => {
      const result = await getDiscussionMessages({ classId, topic, limit: 50, offset: 0 })
      if (result.error) throw new Error(result.error)
      return result.data as DiscussionMessage[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
    gcTime: 1000 * 60 * 30, // Keep in memory for 30 mins
  })

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  // Real-time subscription - syncs with React Query cache
  useEffect(() => {
    if (!classId || !topic) return
    
    const supabase = createClient()
    const randomId = Math.random().toString(36).substring(7)
    const channelName = `class_discussion_${classId}_${topic}_${randomId}`
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'discussion_messages',
          filter: `class_id=eq.${classId}`,
        },
        async (payload) => {
          const newMsg = payload.new as any
          if (newMsg.topic !== topic) return

          // Fetch full message detail to get user avatar/name
          const result = await getDiscussionMessageById({ messageId: newMsg.id })

          if (result.data && mountedRef.current) {
            const fullMsg = result.data as unknown as DiscussionMessage
            // Update React Query cache directly
            queryClient.setQueryData<DiscussionMessage[]>(
              ['discussion', classId, topic],
              (prev = []) => {
                if (prev.some((m) => m.id === fullMsg.id)) return prev
                return [...prev, fullMsg]
              }
            )
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'discussion_messages',
          filter: `class_id=eq.${classId}`,
        },
        (payload) => {
          const oldMsg = payload.old as any
          queryClient.setQueryData<DiscussionMessage[]>(
            ['discussion', classId, topic],
            (prev = []) => prev.filter((m) => m.id !== oldMsg.id)
          )
        }
      )
      .subscribe((status) => {
        if (mountedRef.current) setStatus(status as any)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [classId, topic, queryClient])

  const send = useCallback(async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed || !userId) return
    
    setSending(true)
    setErrorVisible(null)
    
    try {
      const result = await sendDiscussionMessage({ 
        classId, 
        topic, 
        content: trimmed 
      })
      
      if (result.error) {
        setErrorVisible(result.error)
        return
      }

      // Optimistically update React Query cache
      if (result.data && mountedRef.current) {
        const newMessage = result.data as unknown as DiscussionMessage
        queryClient.setQueryData<DiscussionMessage[]>(
          ['discussion', classId, topic],
          (prev = []) => {
            if (prev.some(m => m.id === newMessage.id)) return prev
            return [...prev, newMessage]
          }
        )
      }
    } catch (err) {
      setErrorVisible('Failed to send message')
    } finally {
      if (mountedRef.current) setSending(false)
    }
  }, [classId, topic, userId, queryClient])

  const remove = useCallback(async (messageId: string) => {
    try {
      // Optimistically remove from cache
      queryClient.setQueryData<DiscussionMessage[]>(
        ['discussion', classId, topic],
        (prev = []) => prev.filter(m => m.id !== messageId)
      )
      
      const result = await deleteDiscussionMessage({ messageId, classId })
      if (result.error) {
        setErrorVisible(result.error)
        // If error, we might want to invalidate and re-fetch to restore the message
        queryClient.invalidateQueries({ queryKey: ['discussion', classId, topic] })
      }
    } catch (err) {
      setErrorVisible('Failed to delete message')
      queryClient.invalidateQueries({ queryKey: ['discussion', classId, topic] })
    }
  }, [classId, topic, queryClient])

  return { 
    messages, 
    loading, 
    sending, 
    error: errorVisible || (queryError as any)?.message || null, 
    status,
    send, 
    remove 
  }
}
