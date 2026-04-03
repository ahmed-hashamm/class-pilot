'use client'

import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

/**
 * ErrorState provides a consistent UI for handling data fetching or logic failures.
 */
export function ErrorState({ message = "Something went wrong.", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50/30 border border-red-100 rounded-2xl">
      <div className="size-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
        <AlertCircle size={32} className="text-red-500" />
      </div>
      <h3 className="text-[16px] font-black tracking-tight mb-2 text-red-900 uppercase">
        Error Occurred
      </h3>
      <p className="text-[14px] text-red-700/80 mb-8 max-w-[320px] leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold text-[14px] rounded-xl hover:bg-red-700 transition cursor-pointer border-none shadow-sm"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  )
}
