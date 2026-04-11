'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  actions?: React.ReactNode // Support multiple custom buttons
  variant?: 'standard' | 'dashboard'
  className?: string
}

/**
 * A professional placeholder for views with no data.
 * 
 * Features:
 * - Two distinct layout modes: 'standard' (inline) and 'dashboard' (hero)
 * - Flexible action support (single CTA button or custom multi-button clusters)
 * - Accessible icon support with consistent navy-themed aesthetics
 * - Built-in hover animations for the 'dashboard' variant to increase engagement
 */
export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  actions,
  variant = 'standard',
  className
}: EmptyStateProps) {
  const isDashboard = variant === 'dashboard'

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center transition-all duration-300",
      isDashboard 
        ? "py-24 border-2 border-dashed border-zinc-200 rounded-[32px] bg-white shadow-sm ring-8 ring-zinc-50/50 group" 
        : "p-12 bg-white border border-border rounded-2xl",
      className
    )}>
      <div className={cn(
        "rounded-2xl transition-all duration-500",
        isDashboard 
          ? "size-20 rounded-[28px] bg-navy/5 border border-navy/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl group-hover:bg-navy group-hover:text-white" 
          : "size-16 bg-secondary/50 flex items-center justify-center mb-6",
      )}>
        <Icon 
          size={isDashboard ? 32 : 28} 
          className={cn(
            "text-navy transition-colors duration-500", 
            isDashboard && "group-hover:text-white"
          )} 
        />
      </div>
      
      <h3 className={cn(
        "font-black tracking-tight mb-2",
        isDashboard ? "text-[28px] text-navy mb-3" : "text-[18px] uppercase"
      )}>
        {title}
      </h3>
      
      <p className={cn(
        "text-[14px] leading-relaxed font-medium mx-auto",
        isDashboard ? "text-muted-foreground max-w-sm mb-10" : "text-muted-foreground mb-8 max-w-[280px]"
      )}>
        {description}
      </p>

      {actions ? (
        <div className="flex flex-wrap gap-4 justify-center">
          {actions}
        </div>
      ) : actionLabel && (
        <button
          onClick={onAction}
          className={cn(
            "font-black transition-all cursor-pointer border-none shadow-none focus:outline-none",
            isDashboard 
              ? "px-8 py-4 bg-navy text-white text-[15px] rounded-2xl shadow-lg hover:shadow-navy/20 active:scale-95" 
              : "px-6 py-3 bg-navy text-white text-[14px] rounded-xl hover:bg-navy/90 active:scale-95"
          )}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
