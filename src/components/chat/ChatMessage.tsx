interface ChatMessageProps {
    role: 'user' | 'assistant'
    content: string
  }
  
  export default function ChatMessage({ role, content }: ChatMessageProps) {
    const isUser = role === 'user'
  
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm
            ${isUser
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-900'
            }`}
        >
          {content}
        </div>
      </div>
    )
  }
  
