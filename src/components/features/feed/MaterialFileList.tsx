'use client'

import React from 'react'
import { FileText, X, FilePlus } from 'lucide-react'

interface MaterialFileListProps {
  files: File[]
  onRemove: (index: number) => void
}

/**
 * MaterialFileList displays the list of files staged for upload in the Feed.
 */
export function MaterialFileList({ files, onRemove }: MaterialFileListProps) {
  if (files.length === 0) return null

  return (
    <div className="space-y-3 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 mb-2">
        <div className="size-8 rounded-lg bg-navy/5 flex items-center justify-center">
          <FilePlus size={14} className="text-navy" />
        </div>
        <label className="text-[11px] font-black tracking-[0.15em] uppercase text-navy/70">
          Staged Materials ({files.length})
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {files.map((file, i) => (
          <div 
            key={i} 
            className="flex items-center justify-between bg-white border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4 truncate">
              <div className="size-10 rounded-xl bg-navy/5 flex items-center justify-center shrink-0 group-hover:bg-navy/10 transition-colors">
                <FileText size={18} className="text-navy" />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-[14px] font-bold text-navy truncate">
                  {file.name}
                </span>
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => onRemove(i)}
              className="size-8 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center shrink-0 border-none bg-transparent cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
