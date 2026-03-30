'use client'

import { useEffect, useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import ChatMessage from './ChatMessage'
import { Loader2, Send, Sparkles, Trash2 } from 'lucide-react'
import { getClassName } from '@/actions/ClassActions'
import { fetchChatHistory, clearChatHistory } from '@/actions/ChatActions'

interface ClassChatProps {
  classId: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_QUESTIONS = [
  'Latest announcements?',
  'Next deadline?',
  'Active polls?',
  'Uploaded materials?'
]

export default function ClassChat({ classId }: ClassChatProps) {
  const [className, setClassName] = useState('Class')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [clearing, setClearing] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const init = async () => {
      setInitializing(true)
      const [name, history] = await Promise.all([
        getClassName(classId),
        fetchChatHistory({ classId })
      ])
      setClassName(name)
      if (history.data) setMessages(history.data as Message[])
      setInitializing(false)
    }
    init()
  }, [classId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleClearChat = async () => {
    if (messages.length === 0 || clearing) return
    setClearing(true)
    try {
      await clearChatHistory({ classId })
      setMessages([])
    } catch (err) {
      console.error('Failed to clear chat:', err)
    } finally {
      setClearing(false)
    }
  }

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
          history: updatedMessages.slice(-6),
        }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: data.answer || 'No response',
      }])
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col bg-background">

      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-navy flex items-center justify-center shadow-sm shrink-0">
            <Sparkles className="size-3.5 text-yellow" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/40 leading-none mb-1">
              AI Assistant
            </p>
            <h2 className="text-[13px] font-bold text-navy leading-none">
              {className}
            </h2>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          disabled={messages.length === 0 || clearing}
          title="Clear chat history"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold
            text-muted-foreground/30 hover:text-red-500 
            transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none
            active:scale-95 mr-7"
        >
          {clearing
            ? <Loader2 className="size-3.5 animate-spin" />
            : <Trash2 className="size-3.5" />
          }
        </button>
      </div>

      {/* Messages */}
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
                Ask about deadlines, materials, polls, or anything in {className}.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 w-full max-w-[260px]">
              {SUGGESTED_QUESTIONS.slice(0, 3).map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  className="text-left px-3.5 py-2.5 rounded-xl text-[12px] font-semibold
                    bg-white border border-navy/[0.08] text-navy/60
                    hover:border-navy/20 hover:text-navy/80
                    transition-all duration-150 active:scale-[0.98] disabled:opacity-40"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

        ) : (
          <div className="space-y-1 pb-2">
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
      </div>

      {/* Input area */}
      <div className="px-4 pb-4 pt-3 bg-white border-t border-border/60">
        {messages.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto pb-2.5 no-scrollbar">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                disabled={loading || clearing}
                className="whitespace-nowrap text-[10px] font-bold text-navy/40 bg-navy/[0.04]
                  border border-navy/[0.08] rounded-lg px-2.5 py-1.5
                  hover:bg-navy/[0.08] hover:text-navy/60 hover:border-navy/15
                  transition-all duration-150 disabled:opacity-40 active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage() }}
          className="flex items-center gap-2"
        >
          <Input
            placeholder={`Ask about ${className}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || clearing}
            className="flex-1 bg-secondary border-transparent text-[13px] h-9 rounded-xl px-3.5
              focus-visible:ring-1 focus-visible:ring-navy/15
              placeholder:text-muted-foreground/35"
          />
          <button
            type="submit"
            disabled={loading || clearing || !input.trim()}
            className="shrink-0 size-9 rounded-xl bg-navy text-white
              flex items-center justify-center
              transition-all cursor-pointer disabled:opacity-30
              border-none active:scale-90 hover:bg-navy/90"
          >
            {loading
              ? <Loader2 className="size-3.5 animate-spin" />
              : <Send className="size-3.5" style={{ transform: 'translateX(1px)' }} />
            }
          </button>
        </form>
      </div>

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
