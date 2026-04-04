import Link from 'next/link'
import { ChevronLeft, LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: React.ReactNode
  children?: React.ReactNode
  backHref?: string
  backLabel?: string
}

/**
 * PageHeader is the standardized header for all dashboard pages.
 */
export function PageHeader({ title, description, icon: Icon, action, children, backHref, backLabel }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-8 mb-8">
      {backHref && (
        <Link href={backHref}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold
            text-muted-foreground hover:text-navy transition-colors w-fit">
          <ChevronLeft size={15} /> {backLabel || 'Back'}
        </Link>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
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
    </div>
  )
}
