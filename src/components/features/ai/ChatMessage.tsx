interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm
          ${isUser
            ? 'bg-navy text-white rounded-br-md'
            : 'bg-secondary text-foreground border border-border rounded-bl-md'
          }`}
      >
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  )
}
