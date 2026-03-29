'use client'

import { useEffect, useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import ChatMessage from './ChatMessage'
import { Loader2, Send, Sparkles } from 'lucide-react'
import { getClassName } from '@/actions/ClassActions'

interface ClassChatProps {
  classId: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_QUESTIONS = [
  'What are the latest announcements?',
  'What are the latest updates?',
  'What is the next deadline?',
]

export default function ClassChat({ classId }: ClassChatProps) {
  const [className, setClassName] = useState('Class')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const fetchClassName = async () => {
      const name = await getClassName(classId)
      setClassName(name)
    }
    fetchClassName()
  }, [classId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || loading) return

    const userMessage: Message = { role: 'user', content: msg }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat/class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: msg,
          classId,
          history: updatedMessages,
        }),
      })

      const data = await res.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer || 'No response',
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-5 py-3.5">
        <div className="size-9 rounded-xl bg-navy flex items-center justify-center text-yellow shadow-sm">
          <Sparkles className="size-4" />
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-foreground tracking-tight">
            {className}
          </h2>
          <p className="text-[11px] text-muted-foreground font-medium">
            Class Pilot AI Assistant
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-5">
            <div className="size-14 rounded-2xl bg-navy/8 border border-navy/15
              flex items-center justify-center">
              <Sparkles size={24} className="text-navy/40" />
            </div>
            <div className="text-center">
              <p className="font-bold text-[15px] tracking-tight mb-1">
                Ask anything about {className}
              </p>
              <p className="text-[12px] text-muted-foreground max-w-xs leading-relaxed">
                I can help you understand class materials, summarize topics, and
                answer questions based on uploaded content.
              </p>
            </div>

            {/* Suggested questions */}
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[12px] font-medium text-navy bg-navy/8
                    border border-navy/15 rounded-lg px-3 py-1.5
                    hover:bg-navy/15 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}
        </div>

        {loading && (
          <div className="mt-4 flex items-center gap-2 text-[13px] text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            <span>Thinking…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
          className="flex gap-2"
        >
          <Input
            placeholder={`Ask about ${className}…`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="rounded-xl border-border bg-secondary focus:ring-2 focus:ring-navy/20 text-[13px]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="shrink-0 size-9 rounded-xl bg-navy text-white
              flex items-center justify-center
              hover:bg-navy/90 transition-colors cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed border-none"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
