import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './button'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col gap-6 py-6 w-full">
      <div className="flex flex-col items-center justify-center gap-4 py-16 border-2 border-dashed border-red-200 rounded-2xl bg-red-50 text-center">
        <AlertTriangle size={32} className="text-red-400" />
        <p className="text-[14px] font-medium text-red-700">{message}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="inline-flex items-center gap-2 bg-white text-red-700 hover:bg-red-50 border-red-200 hover:text-red-800 font-semibold text-[13px] px-5 py-2.5 rounded-xl transition cursor-pointer"
          >
            <RefreshCw size={14} />
            Try again
          </Button>
        )}
      </div>
    </div>
  )
}
