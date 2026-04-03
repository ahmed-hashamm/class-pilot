'use client'

import React from 'react'
import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface PollOptionsListProps {
  options: string[]
  onChange: (options: string[]) => void
  disabled?: boolean
}

/**
 * PollOptionsList manages the dynamic list of choices for a classroom poll.
 */
export function PollOptionsList({ options, onChange, disabled }: PollOptionsListProps) {
  const handleUpdate = (index: number, value: string) => {
    const next = [...options]
    next[index] = value
    onChange(next)
  }

  const handleAdd = () => {
    onChange([...options, ''])
  }

  const handleRemove = (index: number) => {
    if (options.length > 2) {
      onChange(options.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[11px] font-black tracking-[0.15em] uppercase text-navy/70">
          Poll Choices
        </label>
        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">
          Min 2 Required
        </span>
      </div>

      <div className="grid gap-3">
        {options.map((opt, i) => (
          <div key={i} className="flex gap-2 group animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="relative flex-1">
              <Input
                value={opt}
                onChange={(e) => handleUpdate(i, e.target.value)}
                disabled={disabled}
                placeholder={`Option ${i + 1}`}
                className="rounded-xl border-border bg-gray-50/30 py-6 pl-12 focus:bg-white transition-all shadow-sm group-hover:shadow-md"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 size-6 rounded-lg bg-navy/5 flex items-center justify-center text-[10px] font-black text-navy/40">
                {i + 1}
              </div>
            </div>
            
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => handleRemove(i)}
                disabled={disabled}
                className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer border-none bg-transparent"
              >
                <X size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled || options.length >= 10}
        className="w-full py-4 rounded-xl border-2 border-dashed border-border text-navy/60 hover:border-navy hover:text-navy hover:bg-navy/[0.02] transition-all flex items-center justify-center gap-2 font-black text-[12px] uppercase tracking-widest cursor-pointer bg-transparent mt-2"
      >
        <Plus size={16} />
        Add Fresh Option
      </button>
    </div>
  )
}
