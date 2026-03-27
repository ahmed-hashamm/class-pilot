'use client'

import { LucideIcon, Loader2 } from 'lucide-react'
import { Button } from './button'

interface FeatureButtonProps {
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  loading?: boolean
  icon?: LucideIcon
  label: string
  loadingLabel?: string
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function FeatureButton({
  onClick,
  type = 'button',
  disabled,
  loading,
  icon: Icon,
  label,
  loadingLabel,
  className = '',
  variant = 'primary',
  size = 'md'
}: FeatureButtonProps) {
  const baseStyles = "rounded-xl font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer border-none flex items-center justify-center gap-2"
  
  const variants = {
    primary: "bg-navy text-white hover:bg-navy/90 hover:-translate-y-0.5",
    secondary: "bg-secondary border border-border text-foreground hover:bg-secondary/80",
    ghost: "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground shadow-none"
  }

  const sizes = {
    sm: "px-4 py-2 text-[12px]",
    md: "px-5 py-2.5 text-[13px]",
    lg: "px-6 py-3.5 text-[14px] font-bold"
  }

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <>
          <Loader2 size={size === 'lg' ? 18 : 15} className="animate-spin" />
          {loadingLabel || (variant === 'primary' ? 'Processing...' : label)}
        </>
      ) : (
        <>
          {Icon && <Icon size={size === 'lg' ? 18 : 16} />}
          {label}
        </>
      )}
    </Button>
  )
}
