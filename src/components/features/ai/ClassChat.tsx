/**
 * @file ClassChat.tsx
 * @description Main component for the Class Chat feature. Integrates ChatInput and ChatMessageList.
 */
'use client'

import { useEffect, useState, useRef } from 'react'
import { Loader2, Sparkles, Trash2, X } from 'lucide-react'
import { getClassName } from '@/actions/ClassActions'
import { fetchChatHistory, clearChatHistory } from '@/actions/ChatActions'
import { Button } from '@/components/ui/button'
import { ChatMessageList } from './ChatMessageList'
import { ChatInput } from './ChatInput'

interface ClassChatProps {
  classId: string;
  onClose?: () => void;
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}


/**
 * The main orchestrator for the AI Classroom Assistant.
 * 
 * Features:
 * - Fetches and manages class-specific chat history via Server Actions
 * - Implements a sliding window history (6 messages) for token efficiency
 * - Integrates real-time "AI Assistant" streaming via the /api/chat/class endpoint
 * - Handles interactive history clearing and automated auto-scroll on reply
 */
export default function ClassChat({ classId, onClose }: ClassChatProps) {
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
      if (name.data) setClassName(name.data)
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

      <div className="flex items-center justify-between border-b px-4 py-2.5 bg-white shrink-0">
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

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            disabled={messages.length === 0 || clearing}
            title="Clear chat history"
            className="flex items-center justify-center size-9 rounded-xl text-muted-foreground/30 
              hover:text-red-500 hover:bg-red-50 transition-all duration-200 
              disabled:opacity-0 disabled:pointer-events-none active:scale-95"
          >
            {clearing
              ? <Loader2 className="size-4 animate-spin" />
              : <Trash2 className="size-4" />
            }
          </Button>

          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex items-center justify-center size-9 rounded-xl text-muted-foreground/60
                hover:text-foreground hover:bg-secondary/80 transition-all active:scale-95"
            >
              <X className="size-4.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ChatMessageList
        messages={messages}
        initializing={initializing}
        loading={loading}
        clearing={clearing}
        classNameString={className}
        messagesEndRef={messagesEndRef}
      />

      {/* Input area */}
      <ChatInput
        classNameString={className}
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        loading={loading}
        clearing={clearing}
      />
    </div>
  )
}
