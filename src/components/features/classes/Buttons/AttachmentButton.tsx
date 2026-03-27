'use client'

import { FileIcon, ExternalLink, Paperclip } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AttachmentButtonProps {
  path: string
  type: 'assignment' | 'announcement' | 'material'
  label?: string
  asDiv?: boolean
}

export default function AttachmentButton({ path, type, label, asDiv = false }: AttachmentButtonProps) {
  const bucketMap = {
    assignment: 'assignments',
    announcement: 'announcements-files',
    material: 'materials',
  }
  const bucketName = bucketMap[type] || ''
  
  let url = '#'
  if (path.startsWith('http')) {
    url = path
  } else {
    const supabase = createClient()
    const { data } = supabase.storage.from(bucketName).getPublicUrl(path)
    url = data?.publicUrl || '#'
  }

  // Clean filename
  const fullFileName = path.split('/').pop() || ''
  const displayName =
    label || (fullFileName.includes('-') ? fullFileName.split('-').slice(1).join('-') : fullFileName)

  const innerContent = (
    <>
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="rounded-lg bg-navy/8 border border-navy/15 p-2 text-navy flex items-center justify-center transition-colors group-hover:bg-navy group-hover:text-white">
          <FileIcon size={16} />
        </div>
        <span className="truncate text-[13px] font-bold tracking-tight text-foreground transition-colors group-hover:text-navy pr-2">
          {displayName}
        </span>
      </div>
      <div className="pr-2 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
        <ExternalLink size={14} className="text-navy" />
      </div>
    </>
  )

  if (asDiv) {
    return (
      <div 
        onClick={(e) => {
          e.stopPropagation();
          if (url !== '#') window.open(url, '_blank');
        }}
        className="group flex w-fit items-center gap-4 justify-between rounded-xl border border-border bg-white p-1.5 shadow-sm transition-all duration-200 hover:shadow hover:-translate-y-0.5 cursor-pointer"
      >
        {innerContent}
      </div>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-fit items-center gap-4 justify-between rounded-xl border border-border bg-white p-1.5 shadow-sm transition-all duration-200 hover:shadow hover:-translate-y-0.5"
    >
      {innerContent}
    </a>
  )
}
