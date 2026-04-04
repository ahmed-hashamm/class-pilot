'use client'

import { useRef, useEffect } from 'react'
import { MessageSquare, Loader2, Sparkles } from 'lucide-react'
import { useDiscussion } from '@/lib/hooks/useDiscussion'
import { DiscussionTopic } from '@/lib/validations/discussion'
import DiscussionMessage from './DiscussionMessage'
import DiscussionInput from './DiscussionInput'

const TOPIC_LABELS: Record<DiscussionTopic, string> = {
  assignments: 'Work Discussion',
  materials: 'Materials Discussion',
  groups: 'Groups Discussion',
}

interface DiscussionPanelProps {
  classId: string
  topic: DiscussionTopic
  userId: string
  isTeacher: boolean
}

export default function DiscussionPanel({ classId, topic, userId, isTeacher }: DiscussionPanelProps) {
  const { messages, loading, sending, error, send, remove } = useDiscussion(classId, topic, userId)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-navy/[0.08] overflow-hidden
      shadow-[0_8px_30px_rgb(20,30,60,0.04),0_4px_8px_rgb(20,30,60,0.02)]"
      style={{ height: 'calc(100vh - 260px)', minHeight: '420px' }}
    >
      {/* Navy Header */}
      <div className="relative px-4 py-3.5 bg-navy overflow-hidden">
        {/* Subtle decorative dots */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }}
        />

        <div className="relative flex items-center gap-3">
          <div className="size-8 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center
            ring-1 ring-white/10">
            <MessageSquare size={15} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[13px] font-bold text-white tracking-tight leading-none">
              {TOPIC_LABELS[topic]}
            </h3>
            <p className="text-[10px] text-white/50 mt-0.5 font-medium">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm">
            <div className="size-1.5 rounded-full bg-emerald-300 animate-pulse" />
            <span className="text-[9px] text-white/70 font-bold uppercase tracking-wider">Live</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0 bg-gradient-to-b from-navy/[0.02] to-white"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="size-10 rounded-2xl bg-navy/5 flex items-center justify-center animate-pulse">
              <Loader2 className="size-5 text-navy/30 animate-spin" />
            </div>
            <p className="text-[11px] text-muted-foreground/40 font-medium">Loading messages...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <div className="size-10 rounded-2xl bg-red-50 flex items-center justify-center">
              <MessageSquare size={18} className="text-red-300" />
            </div>
            <p className="text-[12px] text-red-400 font-medium">{error}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="relative">
              <div className="size-14 rounded-2xl bg-navy/[0.04] flex items-center justify-center">
                <Sparkles size={22} className="text-navy/15" />
              </div>
              <div className="absolute -bottom-1 -right-1 size-5 rounded-lg bg-white border border-navy/[0.06]
                flex items-center justify-center shadow-sm">
                <MessageSquare size={10} className="text-navy/30" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-[12px] text-foreground/50 font-bold tracking-tight">
                No messages yet
              </p>
              <p className="text-[10px] text-muted-foreground/35 mt-0.5">
                Be the first to start the conversation!
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <DiscussionMessage
              key={msg.id}
              message={msg}
              isOwn={msg.user_id === userId}
              isTeacher={isTeacher}
              onDelete={remove}
            />
          ))
        )}
      </div>

      {/* Input */}
      <DiscussionInput
        onSend={send}
        sending={sending}
        placeholder={`Message ${TOPIC_LABELS[topic].toLowerCase()}...`}
      />
    </div>
  )
}
