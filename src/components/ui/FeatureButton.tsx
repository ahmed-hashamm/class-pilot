'use client'

import React from 'react'
import { LucideIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  icon?: LucideIcon
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'yellow'
  loading?: boolean
  loadingLabel?: string
}

/**
 * FeatureButton is the primary interactive element for feature actions.
 * It supports various styles and a loading state.
 */
export function FeatureButton({
  label,
  icon: Icon,
  variant = 'primary',
  loading = false,
  loadingLabel,
  className,
  disabled,
  ...props
}: FeatureButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 cursor-pointer border-none"

  const variants = {
    primary: "bg-navy text-white hover:bg-navy/90 rounded-xl px-6 py-3",
    secondary: "bg-navy-light text-white hover:bg-navy-light/90 rounded-xl px-5 py-2",
    outline: "bg-transparent text-muted-foreground hover:bg-secondary/50 hover:text-navy rounded-xl px-5 py-2",
    danger: "bg-red-600 text-white hover:bg-red-700 rounded-xl px-5 py-2",
    yellow: "bg-yellow text-navy hover:bg-yellow/90 rounded-xl px-6 py-3 shadow-md",
  }

  return (
    <button
      disabled={loading || disabled}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : Icon ? (
        <Icon size={18} />
      ) : null}
      <span className="text-[14px] uppercase tracking-wider">{loading && loadingLabel ? loadingLabel : label}</span>
    </button>
  )
}
