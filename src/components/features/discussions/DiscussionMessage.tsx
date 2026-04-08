'use client'

import { format } from 'date-fns'
import { Trash2, GraduationCap } from 'lucide-react'
import { DiscussionMessage as DiscussionMessageType } from '@/lib/hooks/useDiscussion'
import { cn } from '@/lib/utils'

interface DiscussionMessageProps {
  message: DiscussionMessageType
  isOwn: boolean
  isTeacher: boolean
  onDelete: (id: string) => void
}

export default function DiscussionMessage({ message, isOwn, isTeacher, onDelete }: DiscussionMessageProps) {
  const name = message.users?.full_name || 'Unknown'
  const isAuthorTeacher = message.is_author_teacher
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  const canDelete = isOwn || isTeacher
  const avatarUrl = message.users?.avatar_url

  return (
    <div className="group flex gap-3 px-1">
      {/* Avatar */}
      <div className="shrink-0 mt-1">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="size-8 rounded-full object-cover" />
        ) : (
          <div className={cn(
            "size-8 rounded-full flex items-center justify-center text-[10px] font-bold border",
            isAuthorTeacher
              ? "bg-navy text-white border-navy"
              : "bg-navy/5 text-navy/40 border-navy/[0.03]"
          )}>
            {initials}
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {isAuthorTeacher && (
            <GraduationCap size={13} className="text-navy shrink-0" />
          )}
          <span className={cn(
            "text-[12px] font-bold truncate max-w-[150px]",
            isAuthorTeacher ? "text-navy" : "text-foreground/80"
          )}>
            {isOwn ? 'You' : name}
          </span>
          <span className="text-[10px] text-muted-foreground/40 font-medium">
            {format(new Date(message.created_at), 'h:mm a')}
          </span>

          {/* Delete Action - Visible on hover */}
          {canDelete && (
            <button
              onClick={() => onDelete(message.id)}
              className="opacity-0 group-hover:opacity-100 transition-all p-1 hover:text-red-500 text-muted-foreground/30 ml-auto"
              title="Delete comment"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>

        <div className={cn(
          "text-[13px] leading-snug break-words whitespace-pre-wrap p-2 rounded-2xl transition-all",
          isOwn
            ? "bg-navy/[0.03] text-navy font-medium border border-navy/[0.05]"
            : "text-foreground/70"
        )}>
          {message.content}
        </div>
      </div>
    </div>
  )
}
