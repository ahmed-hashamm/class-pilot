// interface ChatMessageProps {
//   role: 'user' | 'assistant'
//   content: string
// }

// export default function ChatMessage({ role, content }: ChatMessageProps) {
//   const isUser = role === 'user'

//   return (
//     <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-1.5`}>
//       <div
//         className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed
//           ${isUser
//             ? 'bg-navy text-white rounded-br-sm'
//             : 'bg-muted/60 text-foreground border border-border/40 rounded-bl-sm'
//           }`}
//       >
//         <div className="whitespace-pre-wrap break-words">{content}</div>
//       </div>
//     </div>
//   )
// }
import { Sparkles } from 'lucide-react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex items-end gap-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>

      {/* Assistant avatar */}
      {!isUser && (
        <div className="size-6 rounded-lg bg-navy flex items-center justify-center shrink-0 mb-0.5">
          <Sparkles className="size-3 text-yellow" />
        </div>
      )}

      <div
        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed
          ${isUser
            ? 'bg-navy text-white rounded-br-sm'
            : 'bg-white text-foreground border border-border/50 rounded-bl-sm shadow-sm'
          }`}
      >
        <div className="whitespace-pre-wrap break-words">{content}</div>
      </div>

    </div>
  )
}