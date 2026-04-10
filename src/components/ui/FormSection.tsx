'use client'

import { ReactNode } from 'react'
import { Label } from './label'

interface FormSectionProps {
  label: string
  description?: string
  children: ReactNode
  className?: string
  error?: string
  labelAction?: ReactNode
}

export function FormSection({
  label,
  description,
  children,
  className = '',
  error,
  labelAction
}: FormSectionProps) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between pr-0.5">
          <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground pl-0.5">
            {label}
          </Label>
          {labelAction}
        </div>
        {description && (
          <p className="text-[12px] text-muted-foreground/60 pl-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="relative">
        {children}
        {error && (
          <p className="mt-1.5 text-[11px] font-bold text-red-500 pl-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
