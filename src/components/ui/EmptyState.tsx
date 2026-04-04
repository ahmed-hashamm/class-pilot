'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

/**
 * EmptyState is used when a list or view has no data.
 * It follows the Class Pilot design system with navy accents and rounded corners.
 */
export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-border rounded-2xl">
      <div className="size-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-6">
        <Icon size={32} className="text-navy" />
      </div>
      <h3 className="text-[18px] font-black tracking-tight mb-2 uppercase">{title}</h3>
      <p className="text-[14px] text-muted-foreground mb-8 max-w-[280px] leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-navy text-white font-bold text-[14px] rounded-xl hover:bg-navy/90 transition cursor-pointer border-none"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
