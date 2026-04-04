'use client'

import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { DiscussionMessage as DiscussionMessageType } from '@/lib/hooks/useDiscussion'

interface DiscussionMessageProps {
  message: DiscussionMessageType
  isOwn: boolean
  isTeacher: boolean
  onDelete: (id: string) => void
}

export default function DiscussionMessage({ message, isOwn, isTeacher, onDelete }: DiscussionMessageProps) {
  const name = message.users?.full_name || 'Unknown'
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  const canDelete = isOwn || isTeacher

  return (
    <div className={`group flex gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`shrink-0 size-8 rounded-xl flex items-center justify-center text-[10px] font-black
        shadow-sm transition-transform group-hover:scale-105
        ${isOwn
          ? 'bg-navy text-white ring-2 ring-navy/10'
          : 'bg-secondary text-navy/60 ring-2 ring-navy/[0.04]'
        }`}>
        {initials}
      </div>

      {/* Bubble */}
      <div className={`relative max-w-[78%] flex flex-col gap-0.5
        ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-center gap-1.5 mb-0.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className={`text-[10px] font-bold tracking-tight
            ${isOwn ? 'text-navy' : 'text-foreground/60'}`}>
            {isOwn ? 'You' : name}
          </span>
          <span className="text-[9px] text-muted-foreground/30 font-medium">
            {format(new Date(message.created_at), 'h:mm a')}
          </span>
        </div>

        <div className={`px-3.5 py-2.5 text-[13px] leading-relaxed transition-all
          ${isOwn
            ? 'bg-navy text-white rounded-2xl rounded-tr-md shadow-md shadow-navy/10'
            : 'bg-white border border-navy/[0.06] text-foreground rounded-2xl rounded-tl-md shadow-sm'
          }`}>
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {/* Delete Button */}
        {canDelete && (
          <button
            onClick={() => onDelete(message.id)}
            className="absolute -top-1.5 -right-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200
              p-1.5 rounded-lg bg-white border border-red-100 shadow-sm
              hover:bg-red-50 text-red-400 hover:text-red-600 hover:scale-110"
            title="Delete message"
          >
            <Trash2 size={10} />
          </button>
        )}
      </div>
    </div>
  )
}
