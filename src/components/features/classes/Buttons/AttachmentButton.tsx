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

  // Robust filename extraction
  const getBaseName = (p: string) => {
    try {
      // If it's a URL, get the last part of the path
      const urlObj = new URL(p);
      return urlObj.pathname.split('/').pop() || p.split('/').pop() || '';
    } catch {
      // Fallback for paths
      return p.split('/').pop() || '';
    }
  };

  const fullFileName = getBaseName(path);

  // Only trim prefixes (the '-' logic) if it looks like a Supabase UUID prefix
  // and we don't have an explicit label.
  const displayName = label || (
    fullFileName.includes('-') && /^[0-9a-f]{8}-/.test(fullFileName)
      ? fullFileName.split('-').slice(1).join('-')
      : fullFileName
  );

  const innerContent = (
    <>
      <div className="flex-1 min-w-0 flex items-center gap-3 overflow-hidden">
        <div className="rounded-lg bg-navy/8 border border-navy/15 p-2 text-navy flex items-center justify-center transition-colors duration-500 group-hover:bg-navy group-hover:text-white  shrink-0">
          <FileIcon size={16} />
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <span className="block truncate text-[13px] font-bold tracking-tight text-foreground transition-colors group-hover:text-navy pr-2">
            {displayName}
          </span>
        </div>
      </div>
      <div className="pr-2 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 shrink-0">
        <ExternalLink size={14} className="text-navy" />
      </div>
    </>
  )

  const commonClasses = "group flex w-full max-w-full items-center gap-4 justify-between rounded-xl border border-border bg-white p-1.5 shadow-sm transition-all duration-200 hover:shadow hover:-translate-y-0.5 min-w-0"

  if (asDiv) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (url !== '#') window.open(url, '_blank');
        }}
        className={`${commonClasses} cursor-pointer`}
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
      className={commonClasses}
    >
      {innerContent}
    </a>
  )
}
