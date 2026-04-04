'use client'

import { FileText, X } from 'lucide-react'

interface FileChipProps {
  name: string
  onRemove?: () => void
  className?: string
}

export function FileChip({
  name,
  onRemove,
  className = ''
}: FileChipProps) {
  return (
    <div className={`inline-flex items-center gap-2 bg-navy/5 text-navy
      border border-navy/10 rounded-xl px-3 py-1.5 text-[12px] font-bold 
      shadow-sm animate-in fade-in zoom-in-95 duration-200 ${className}`}>
      <div className="shrink-0 size-6 rounded-lg bg-navy/10 flex items-center justify-center">
        <FileText size={12} className="text-navy" />
      </div>
      <span className="truncate max-w-[150px]">{name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 p-0.5 rounded-md hover:bg-navy/10 hover:text-red-500 transition cursor-pointer bg-transparent border-none"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
