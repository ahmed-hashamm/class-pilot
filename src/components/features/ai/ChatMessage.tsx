import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Sparkles } from 'lucide-react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex items-end gap-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="size-6 rounded-lg bg-navy flex items-center justify-center shrink-0 mb-0.5">
          <Sparkles className="size-3 text-yellow" />
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed
          ${isUser
            ? 'bg-navy text-white rounded-br-sm'
            : 'bg-white text-foreground border border-border/50 rounded-bl-sm shadow-sm'
          }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap break-words">{content}</div>
        ) : (
          <div className="prose-custom max-w-none break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
            <style dangerouslySetInnerHTML={{ __html: `
              .prose-custom p { margin-bottom: 0.5rem; }
              .prose-custom p:last-child { margin-bottom: 0; }
              .prose-custom ul { list-style-type: disc; padding-left: 1.25rem; margin-bottom: 0.5rem; }
              .prose-custom ol { list-style-type: decimal; padding-left: 1.25rem; margin-bottom: 0.5rem; }
              .prose-custom li { margin-bottom: 0.25rem; }
              .prose-custom strong { font-weight: 600; color: #000080; }
              .prose-custom h1, .prose-custom h2, .prose-custom h3 { font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem; color: #000080; }
            `}} />
          </div>
        )}
      </div>
    </div>
  )
}