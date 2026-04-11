/**
 * @file ChatMessageList.tsx
 * @description Renders the list of chat messages, empty states, and loading indicators for ClassChat.
 */
'use client'

import React from 'react'
import ChatMessage from './ChatMessage'
import { Sparkles, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatMessageListProps {
  messages: Message[]
  initializing: boolean
  loading: boolean
  clearing: boolean
  classNameString: string
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}

/**
 * Manages the scrolling container and conditional UI states for the chat.
 * 
 * Features:
 * - Custom 'cp-bounce' animation for initializing and typing indicators
 * - Empty state with context-aware prompts (mentions current class name)
 * - Integrated auto-scroll management via messagesEndRef association
 * - Visual feedback for background operations like history clearing
 */
export function ChatMessageList({
  messages,
  initializing,
  loading,
  clearing,
  classNameString,
  messagesEndRef
}: ChatMessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
      {initializing ? (
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <div className="flex gap-1.5 items-center">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="size-1.5 rounded-full bg-navy/20 inline-block"
                style={{ animation: `cp-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
          <p className="text-[11.5px] font-medium text-muted-foreground/40">
            Loading history...
          </p>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center -translate-y-4 gap-5">
          <div className="size-14 rounded-2xl bg-navy/5 border border-navy/[0.08] flex items-center justify-center">
            <Sparkles size={22} className="text-navy/20" />
          </div>
          <div className="text-center space-y-1">
            <p className="font-bold text-[15px] text-navy">How can I help?</p>
            <p className="text-[12px] text-muted-foreground/60 max-w-[230px] leading-relaxed">
              Ask about deadlines, materials, polls, or anything in {classNameString}.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5 pb-2">
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}
        </div>
      )}

      {/* Typing indicator */}
      {loading && (
        <div className="flex items-center gap-2 mt-3 pl-0.5">
          <div className="size-6 rounded-lg bg-navy flex items-center justify-center shrink-0">
            <Sparkles className="size-3 text-yellow" />
          </div>
          <div className="flex gap-1 px-3 py-2.5 rounded-2xl rounded-tl-sm bg-muted/60 border border-border/40">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="size-1.5 rounded-full bg-navy/30 inline-block"
                style={{ animation: `cp-bounce 1s ease-in-out ${i * 0.15}s infinite` }}
              />
            ))}
          </div>
        </div>
      )}

      {clearing && (
        <div className="flex items-center gap-2 mt-3 text-[11.5px] font-semibold text-red-400/50 pl-1">
          <Loader2 className="size-3 animate-spin" />
          <span>Clearing...</span>
        </div>
      )}

      <div ref={messagesEndRef} />
      
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes cp-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
          30% { transform: translateY(-3px); opacity: 0.7; }
        }
      ` }} />
    </div>
  )
}
