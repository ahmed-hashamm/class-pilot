import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'yellow'
  size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors gap-2',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          {
            'bg-navy text-white hover:bg-navy/90 focus-visible:ring-navy': variant === 'primary',
            'bg-secondary text-foreground hover:bg-navy hover:text-white border border-border focus-visible:ring-navy': variant === 'secondary',
            'bg-transparent text-muted-foreground hover:bg-secondary/50 hover:text-navy focus-visible:ring-navy': variant === 'outline',
            'hover:bg-secondary/50 text-muted-foreground hover:text-foreground focus-visible:ring-navy/20': variant === 'ghost',
            'bg-red-50 text-red-600 border border-red-200 hover:bg-red-500 hover:text-white focus-visible:ring-red-500': variant === 'danger',
            'bg-yellow text-navy hover:bg-yellow-hover hover:-translate-y-0.5 focus-visible:ring-yellow': variant === 'yellow',
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-[13px] font-bold': size === 'md',
            'h-12 px-6 text-base font-bold': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }

