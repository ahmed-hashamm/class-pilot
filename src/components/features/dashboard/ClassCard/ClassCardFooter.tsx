'use client'

import { useRouter } from 'next/navigation'
import { Plus, Pin, Trash2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ClassCardFooterProps {
  classId: string
  isTeacher: boolean
  isPinned: boolean
  isPinning: boolean
  onTogglePin: (e: React.MouseEvent) => void
  onDelete: () => void
  onLeave: () => void
}

export function ClassCardFooter({
  classId,
  isTeacher,
  isPinned,
  isPinning,
  onTogglePin,
  onDelete,
  onLeave,
}: ClassCardFooterProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between pt-4 border-t border-border/60">
      {/* Left actions: Pin and Create Assignment */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={onTogglePin}
          disabled={isPinning}
          title={isPinned ? 'Unpin Class' : 'Pin Class'}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 h-auto text-[12px] font-bold tracking-tight rounded-lg transition-all duration-200",
            isPinned
              ? "text-navy bg-navy/8 hover:bg-navy/12"
              : "text-muted-foreground hover:text-navy hover:bg-navy/8",
            isPinning && "opacity-50 cursor-wait"
          )}
        >
          {isPinned ? <Pin size={13} fill="currentColor" /> : <Pin size={13} />}
          <span>{isPinned ? 'Unpin' : 'Pin'}</span>
        </Button>

        {isTeacher && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/classes/${classId}/assignments/create`)}
            title="Create Assignment"
            className="p-2 h-auto text-muted-foreground hover:text-navy hover:bg-navy/8 rounded-lg"
          >
            <Plus size={16} />
          </Button>
        )}
      </div>

      {/* Right actions: Delete/Leave */}
      <div className="flex items-center">
        {isTeacher ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            title="Delete Class"
            className="p-2 h-auto text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg"
          >
            <Trash2 size={16} />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLeave}
            title="Leave Class"
            className="p-2 h-auto text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg"
          >
            <LogOut size={16} />
          </Button>
        )}
      </div>
    </div>
  )
}
