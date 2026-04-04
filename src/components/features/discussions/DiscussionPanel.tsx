'use client'

import { useRef, useEffect } from 'react'
import { Users2, Loader2, Sparkles } from 'lucide-react'
import { useDiscussion } from '@/lib/hooks/useDiscussion'
import { DiscussionTopic } from '@/lib/validations/discussion'
import DiscussionMessage from './DiscussionMessage'
import DiscussionInput from './DiscussionInput'
import { useQuery } from '@tanstack/react-query'
import { getUserProfile } from '@/actions/UserActions'

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

  // KNOWN: Fetching current user profile via Server Action to align with architecture rules
  const { data: currentUserResponse } = useQuery({
    queryKey: ['currentUserProfile', userId],
    queryFn: () => getUserProfile({ userId }),
    enabled: !!userId
  })

  const currentUser = currentUserResponse?.data

  // Reset scroll to top when new messages arrive (since newest are now at top)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }, [messages])

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

      {/* Input - Now at the top */}
      <div className="pb-6 border-b border-navy/[0.04] mb-6">
        <DiscussionInput
          onSend={send}
          sending={sending}
          user={currentUser ?? undefined}
          placeholder="Add class comment..."
        />
      </div>

      {/* Messages Area - Grow-to-fit + Scroll */}
      <div
        ref={scrollRef}
        className="overflow-y-auto px-1 pr-3 space-y-6 no-scrollbar transition-all duration-300"
        style={{
          maxHeight: 'min(440px, 45vh)',
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
            {/* Show newest messages first */}
            {[...messages].reverse().map((msg) => (
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
    </div>
  )
}
