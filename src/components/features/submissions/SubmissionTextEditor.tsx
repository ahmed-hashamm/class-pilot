'use client'

import React from 'react'
import { FileText } from 'lucide-react'

interface SubmissionTextEditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

/**
 * SubmissionTextEditor provides a dedicated area for text-based assignment responses.
 */
export function SubmissionTextEditor({ value, onChange, disabled }: SubmissionTextEditorProps) {
  return (
    <div className="flex flex-col gap-3 group">
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-lg bg-navy/5 flex items-center justify-center">
          <FileText size={14} className="text-navy" />
        </div>
        <label className="text-[11px] font-black tracking-[0.15em] uppercase text-navy/70">
          Response Content
        </label>
      </div>
      
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Type your response here..."
          rows={6}
          className="w-full resize-none bg-white border-2 border-border rounded-xl px-5 py-4
            text-[14px] text-navy font-medium leading-relaxed placeholder:text-muted-foreground/50
            focus:outline-none focus:ring-4 focus:ring-navy/5 focus:border-navy transition-all
            disabled:opacity-50 disabled:bg-secondary/30"
        />
        <div className="absolute bottom-4 right-4 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest hidden group-focus-within:block">
          {value.length} characters
        </div>
      </div>
    </div>
  )
}
