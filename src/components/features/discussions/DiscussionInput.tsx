'use client'

import { useState, FormEvent, useRef } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface DiscussionInputProps {
  onSend: (content: string) => Promise<void>
  sending: boolean
  placeholder?: string
}

export default function DiscussionInput({ onSend, sending, placeholder = 'Type a message...' }: DiscussionInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || sending) return
    const text = input.trim()
    setInput('')
    await onSend(text)
    inputRef.current?.focus()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2.5 px-3.5 py-3 bg-white border-t border-navy/[0.06]"
    >
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        disabled={sending}
        maxLength={2000}
        className="flex-1 bg-secondary/40 border border-navy/[0.04] text-[13px] h-9 rounded-xl px-3.5
          focus:outline-none focus:ring-2 focus:ring-navy/10 focus:border-navy/10
          placeholder:text-muted-foreground/30 disabled:opacity-50 transition-all"
      />
      <button
        type="submit"
        disabled={sending || !input.trim()}
        className="shrink-0 size-9 rounded-xl bg-navy text-white
          flex items-center justify-center shadow-sm
          hover:bg-navy/90 hover:shadow-md hover:scale-105
          disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100
          transition-all duration-200 active:scale-95"
      >
        {sending
          ? <Loader2 className="size-3.5 animate-spin" />
          : <Send className="size-3.5" style={{ transform: 'translateX(1px)' }} />
        }
      </button>
    </form>
  )
}
