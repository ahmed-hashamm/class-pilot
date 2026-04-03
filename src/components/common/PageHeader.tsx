'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: React.ReactNode
  children?: React.ReactNode
}

/**
 * PageHeader is the standardized header for all dashboard pages.
 */
export function PageHeader({ title, description, icon: Icon, action, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          {Icon && <Icon className="text-navy" size={24} />}
          <h1 className="text-[28px] font-black tracking-tight text-navy leading-none">
            {title}
          </h1>
        </div>
        {description && (
          <p className="text-[14px] text-muted-foreground font-medium uppercase tracking-widest">
            {description}
          </p>
        )}
      </div>
      {(children || action) && (
        <div className="flex items-center gap-3">
          {children}
          {action}
        </div>
      )}
    </div>
  )
}
