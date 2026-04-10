import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-[15px] transition-all',
          'placeholder:text-muted-foreground/50',
          'focus:outline-none focus:ring-4 focus:ring-navy/5 focus:border-navy',
          error && 'border-red-500 focus:ring-red-500/10 focus:border-red-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }

