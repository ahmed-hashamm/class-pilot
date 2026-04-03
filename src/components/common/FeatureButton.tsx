'use client'

import React from 'react'
import { LucideIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  icon?: LucideIcon
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  loading?: boolean
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
  className,
  disabled,
  ...props 
}: FeatureButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 cursor-pointer border-none"
  
  const variants = {
    primary: "bg-navy text-white hover:bg-navy/90 rounded-xl px-6 py-3",
    secondary: "bg-yellow text-navy hover:bg-yellow/90 rounded-xl px-6 py-3",
    outline: "bg-transparent text-navy border border-navy/20 hover:bg-navy/5 rounded-xl px-6 py-3",
    danger: "bg-red-600 text-white hover:bg-red-700 rounded-xl px-6 py-3",
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
      <span className="text-[14px] uppercase tracking-wider">{label}</span>
    </button>
  )
}
