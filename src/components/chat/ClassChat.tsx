'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ChatMessage from './ChatMessage'
import { Loader2, Send, Sparkles } from 'lucide-react'
import { getClassName } from '@/components/class/ClassActions'

interface ClassChatProps {
  classId: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

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

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat/class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage.content,
          classId,
        }),
      })

      const data = await res.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer || 'No response',
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
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
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {className}
            </h2>
            <p className="text-sm text-gray-500">
              Class Pilot Assistant
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-400">Press Enter to send</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-400 italic">
                Ask anything about {className} materials…
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}
        </div>

        {loading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Thinking…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
          className="flex gap-3"
        >
          <Input
            placeholder={`Ask a question about ${className}…`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="rounded-xl border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-500"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl px-6"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="ml-2">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
