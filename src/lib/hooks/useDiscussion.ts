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
  const [status, setStatus] = useState<'SUBSCRIBED' | 'TIMED_OUT' | 'CLOSED' | 'ERROR' | 'JOINING'>('JOINING')
  
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
      .catch(() => {
        if (mountedRef.current) setError('Failed to load messages')
      })
      .finally(() => {
        if (mountedRef.current) setLoading(false)
      })

    return () => { 
      mountedRef.current = false 
    }
  }, [classId, topic])

  // Real-time subscription
  useEffect(() => {
    if (!classId || !topic) return
    
    const supabase = createClient()
    
    // KNOWN: Using a simplified channel name to avoid subscription errors in some environments
    const channelName = `class_discussion_${classId}_${topic}`
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

          // KNOWN: Fetch full message detail via Server Action to keep business logic on server
          const result = await getDiscussionMessageById({ messageId: newMsg.id })

          if (result.data && mountedRef.current) {
            setMessages((prev) => {
              // Deduplicate: check if message was already added via optimistic update
              if (prev.some((m) => m.id === (result.data as any).id)) return prev
              return [...prev, result.data as unknown as DiscussionMessage]
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
      .subscribe((status) => {
        if (mountedRef.current) {
          setStatus(status as any)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [classId, topic])

  const send = useCallback(async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed || !userId) return
    
    setSending(true)
    setError(null)
    
    try {
      const result = await sendDiscussionMessage({ 
        classId, 
        topic, 
        content: trimmed 
      })
      
      if (result.error) {
        setError(result.error)
        return
      }

      // Optimistic update using payload from Server Action
      if (result.data && mountedRef.current) {
        const newMessage = result.data as unknown as DiscussionMessage
        setMessages((prev) => {
          if (prev.some(m => m.id === newMessage.id)) return prev
          return [...prev, newMessage]
        })
      }
    } catch (err) {
      setError('Failed to send message')
    } finally {
      if (mountedRef.current) {
        setSending(false)
      }
    }
  }, [classId, topic, userId])

  const remove = useCallback(async (messageId: string) => {
    try {
      // Optimistically remove
      setMessages((prev) => prev.filter(m => m.id !== messageId))
      
      const result = await deleteDiscussionMessage({ messageId, classId })
      if (result.error) {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to delete message')
    }
  }, [classId])

  return { 
    messages, 
    loading, 
    sending, 
    error, 
    status,
    send, 
    remove 
  }
}
