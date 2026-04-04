'use client'

import { useState, useRef } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DiscussionInputProps {
  onSend: (content: string) => Promise<void>
  sending: boolean
  placeholder: string
  user?: { full_name: string | null; avatar_url: string | null }
}

export default function DiscussionInput({ onSend, sending, placeholder, user }: DiscussionInputProps) {
  const [content, setContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = async () => {
    if (!content.trim() || sending) return
    await onSend(content.trim())
    setContent('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Handle auto-expanding height
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('') || '?'

  return (
    <div className="flex items-start gap-3 w-full group">
      {/* User Avatar */}
      <div className="flex-shrink-0 mt-1">
        {user?.avatar_url ? (
          <img 
            src={user.avatar_url} 
            alt={user.full_name || 'User'} 
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <div className="size-8 rounded-full bg-navy/10 flex items-center justify-center text-navy/60 text-[11px] font-bold border border-navy/5">
            {initials}
          </div>
        )}
      </div>

      {/* Pill Input Container */}
      <div className={cn(
        "flex-1 flex items-end gap-2 bg-white border border-navy/[0.08] hover:border-navy/[0.15] transition-all rounded-[24px] px-4 py-2",
        content && "border-navy/20 shadow-sm"
      )}>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-[13px] py-1 placeholder:text-muted-foreground/30 min-h-[22px] max-h-[120px]"
        />
        
        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!content.trim() || sending}
          className="p-1 rounded-full text-navy/20 hover:text-navy transition-colors disabled:opacity-30 flex-shrink-0"
        >
          {sending ? (
            <Loader2 className="size-4 animate-spin text-navy/40" />
          ) : (
            <Send className="size-5" />
          )}
        </button>
      </div>
    </div>
  )
}
