'use client'

import React from 'react'
import { Paperclip, X, UploadCloud } from 'lucide-react'

interface SubmissionFileUploaderProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  disabled?: boolean
}

/**
 * SubmissionFileUploader manages file selection and the list of staged attachments.
 */
export function SubmissionFileUploader({ files, onFilesChange, disabled }: SubmissionFileUploaderProps) {
  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesChange([...files, ...Array.from(e.target.files)])
    }
  }

  const handleRemove = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-lg bg-navy/5 flex items-center justify-center">
          <UploadCloud size={14} className="text-navy" />
        </div>
        <label className="text-[11px] font-black tracking-[0.15em] uppercase text-navy/70">
          File Attachments
        </label>
      </div>

      <label className="relative flex flex-col items-center justify-center gap-3 border-2 border-dashed
        border-border rounded-2xl px-6 py-8 cursor-pointer hover:border-navy hover:bg-navy/5
        transition-all duration-300 group disabled:opacity-50 disabled:pointer-events-none">
        <div className="size-12 rounded-full bg-navy/5 flex items-center justify-center group-hover:scale-110 transition-transform">
          <UploadCloud size={24} className="text-navy/40 group-hover:text-navy transition-colors" />
        </div>
        <div className="text-center">
          <span className="text-[14px] font-bold text-navy block">Click to upload files</span>
          <span className="text-[12px] text-muted-foreground font-semibold uppercase tracking-widest leading-loose">
            PDF, Images, or ZIP
          </span>
        </div>
        <input 
          type="file" 
          multiple 
          disabled={disabled}
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileAdd} 
        />
      </label>

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between bg-white border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3 truncate">
                <div className="size-8 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                  <Paperclip size={14} className="text-navy" />
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-[13px] font-bold text-navy truncate">{file.name}</span>
                  <span className="text-[10px] text-muted-foreground font-black uppercase">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => handleRemove(i)}
                className="size-8 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center shrink-0 border-none bg-transparent cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
