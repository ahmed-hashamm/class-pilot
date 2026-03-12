import { LucideIcon } from 'lucide-react'
import { Button } from './button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  actionIcon?: LucideIcon
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 border-2 border-dashed border-border rounded-2xl bg-white text-center">
      <div className="size-14 rounded-2xl bg-navy/8 border border-navy/15 flex items-center justify-center">
        <Icon size={24} className="text-navy/40" />
      </div>
      <p className="font-bold text-[16px] tracking-tight">{title}</p>
      <p className="text-[13px] text-muted-foreground max-w-xs leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mt-2 inline-flex items-center gap-2 bg-navy text-white font-semibold text-[13px] px-5 py-2.5 rounded-xl hover:bg-navy/90 transition cursor-pointer border-none"
        >
          {ActionIcon && <ActionIcon size={14} />}
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
