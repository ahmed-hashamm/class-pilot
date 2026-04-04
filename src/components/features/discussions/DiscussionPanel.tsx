'use client'

import { useRef, useEffect } from 'react'
import { Users2, Loader2, Sparkles } from 'lucide-react'
import { useDiscussion } from '@/lib/hooks/useDiscussion'
import { DiscussionTopic } from '@/lib/validations/discussion'
import DiscussionMessage from './DiscussionMessage'
import DiscussionInput from './DiscussionInput'
import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

const TOPIC_LABELS: Record<DiscussionTopic, string> = {
  assignments: 'Work Discussion',
  materials: 'Materials Discussion',
  groups: 'Group Discussion',
}

interface DiscussionPanelProps {
  classId: string
  topic: DiscussionTopic
  userId: string
  isTeacher: boolean
  hideHeader?: boolean
}

export default function DiscussionPanel({ classId, topic, userId, isTeacher, hideHeader }: DiscussionPanelProps) {
  const { messages, loading, sending, error, send, remove } = useDiscussion(classId, topic, userId)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Fetch current user details for the input avatar
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('full_name, avatar_url')
        .eq('id', userId)
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!userId
  })

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  return (
    <div className="flex flex-col w-full">
      {/* Minimal Header - Dynamic Label */}
      {!hideHeader && (
        <div className="flex items-center gap-2 mb-6 px-1">
          <Users2 size={18} className="text-foreground/40" />
          <h3 className="text-sm font-semibold text-foreground/70 tracking-tight capitalize">
            {TOPIC_LABELS[topic]}
          </h3>
          {messages.length > 0 && (
            <span className="ml-auto text-[11px] font-medium text-foreground/20">
              {messages.length} {messages.length === 1 ? 'comment' : 'comments'}
            </span>
          )}
        </div>
      )}

      {/* Messages Area - Grow-to-fit + Scroll */}
      <div
        ref={scrollRef}
        className="overflow-y-auto px-1 space-y-6 scrollbar-thin scrollbar-thumb-navy/5 hover:scrollbar-thumb-navy/10 transition-all duration-300"
        style={{
          maxHeight: 'min(600px, 60vh)',
          marginBottom: messages.length > 0 ? '1.5rem' : '0'
        }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 className="size-5 text-navy/20 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
            <p className="text-[12px] text-red-400 font-medium">Failed to load comments</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 opacity-30">
            <Sparkles size={20} className="text-navy/20" />
            <p className="text-[11px] font-medium">No comments yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {messages.map((msg) => (
              <DiscussionMessage
                key={msg.id}
                message={msg}
                isOwn={msg.user_id === userId}
                isTeacher={isTeacher}
                onDelete={remove}
              />
            ))}
          </div>
        )}
      </div>

      {/* Input - Positioned just below messages area */}
      <div className="pt-4 border-t border-navy/[0.04] mt-0">
        <DiscussionInput
          onSend={send}
          sending={sending}
          user={currentUser ?? undefined}
          placeholder="Add class comment..."
        />
      </div>
    </div>
  )
}
