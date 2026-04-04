'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getDiscussionMessages, sendDiscussionMessage, deleteDiscussionMessage } from '@/actions/DiscussionActions'
import { DiscussionTopic } from '@/lib/validations/discussion'

export interface DiscussionMessage {
  id: string
  content: string
  created_at: string
  user_id: string
  users: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

export function useDiscussion(classId: string, topic: DiscussionTopic, userId: string) {
  const [messages, setMessages] = useState<DiscussionMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  // Initial fetch
  useEffect(() => {
    mountedRef.current = true
    setLoading(true)
    setError(null)

    getDiscussionMessages({ classId, topic, limit: 50, offset: 0 })
      .then((result) => {
        if (!mountedRef.current) return
        if (result.error) {
          setError(result.error)
        } else {
          setMessages((result.data as DiscussionMessage[]) || [])
        }
      })
      .finally(() => {
        if (mountedRef.current) setLoading(false)
      })

    return () => { mountedRef.current = false }
  }, [classId, topic])

  // Real-time subscription
  useEffect(() => {
    if (!classId) return
    const supabase = createClient()

    const channel = supabase
      .channel(`discussion_${classId}_${topic}`)
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

          // Fetch the full message with user info
          const { data } = await supabase
            .from('discussion_messages' as any)
            .select('id, content, created_at, user_id, users(full_name, avatar_url)')
            .eq('id', newMsg.id)
            .maybeSingle()

          if (data && mountedRef.current) {
            setMessages((prev) => {
              // Avoid duplicates
              if (prev.some((m) => m.id === (data as any).id)) return prev
              return [...prev, data as unknown as DiscussionMessage]
            })
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
          if (mountedRef.current) {
            setMessages((prev) => prev.filter((m) => m.id !== oldMsg.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [classId, topic])

  const send = useCallback(async (content: string) => {
    if (!content.trim()) return
    setSending(true)
    try {
      const result = await sendDiscussionMessage({ classId, topic, content: content.trim() })
      if (result.error) {
        setError(result.error)
      }
      // Real-time subscription will handle adding the message
    } catch {
      setError('Failed to send message')
    } finally {
      setSending(false)
    }
  }, [classId, topic])

  const remove = useCallback(async (messageId: string) => {
    try {
      const result = await deleteDiscussionMessage({ messageId, classId })
      if (result.error) {
        setError(result.error)
      }
      // Real-time subscription will handle removing the message
    } catch {
      setError('Failed to delete message')
    }
  }, [classId])

  return { messages, loading, sending, error, send, remove }
}
