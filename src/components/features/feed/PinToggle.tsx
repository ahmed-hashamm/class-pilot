'use client'

import { Pin } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PinToggleProps {
  pinned: boolean
  onToggle: (pinned: boolean) => void
  label?: string
  disabled?: boolean
}

export function PinToggle({ pinned, onToggle, label, disabled }: PinToggleProps) {
  const displayLabel = label || (pinned ? "Pinned" : "Pin to top")
  
  return (
    <button
      type="button"
      onClick={() => !disabled && onToggle(!pinned)}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border",
        pinned 
          ? "bg-yellow/10 text-navy border-yellow/30 shadow-sm" 
          : "bg-slate-50 text-slate-500 border-border hover:bg-slate-100 hover:text-navy hover:border-navy/20",
        disabled && "opacity-50 cursor-not-allowed grayscale-[0.5]"
      )}
    >
      <Pin 
        size={13} 
        className={cn(
          "transition-transform duration-200",
          pinned ? "fill-navy text-navy scale-110" : "text-slate-400 group-hover:scale-110"
        )} 
      />
      <span>{displayLabel}</span>
    </button>
  )
}
