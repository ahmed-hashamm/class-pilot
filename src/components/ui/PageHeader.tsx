'use client'

import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { FADE_IN } from '@/lib/animations'

interface PageHeaderProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  secondaryAction?: ReactNode
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction
}: PageHeaderProps) {
  return (
    <motion.div 
      variants={FADE_IN}
      initial="initial"
      animate="animate"
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-navy flex items-center justify-center shadow-sm">
          <Icon size={17} className="text-yellow" />
        </div>
        <div>
          <h2 className="font-black text-[18px] tracking-tight text-foreground leading-tight">{title}</h2>
          {description && (
            <p className="text-[13px] text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {secondaryAction}
        {action}
      </div>
    </motion.div>
  )
}
