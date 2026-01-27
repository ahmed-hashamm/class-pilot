'use client'

import { FileIcon, ExternalLink, Paperclip } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AttachmentButtonProps {
  path: string
  type: 'assignment' | 'announcement' | 'material'
  label?: string
}

export default function AttachmentButton({ path, type, label }: AttachmentButtonProps) {
  const bucketMap = {
    assignment: 'assignments',
    announcement: 'announcements-files',
    material: 'materials',
  }
  const bucketName = bucketMap[type] || ''
  const supabase = createClient()
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path)
  const url = data?.publicUrl || '#'

  // Clean filename
  const fullFileName = path.split('/').pop() || ''
  const displayName =
    label || (fullFileName.includes('-') ? fullFileName.split('-').slice(1).join('-') : fullFileName)

  return (
    <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center w-min gap-4 justify-between rounded-xl border border-gray-100 bg-gray-50 p-1 transition-all hover:border-orange-200 hover:bg-orange-50/40"
  >
    <div className="flex items-center gap-3 overflow-hidden">
      <div className="rounded-lg border border-gray-100 bg-white p-2 text-gray-400 group-hover:text-orange-600">
        <FileIcon size={18} />
      </div>
      <span className="truncate text-sm font-bold text-gray-700">
        {displayName}
      </span>
    </div>
    <ExternalLink size={14} className="text-gray-300 group-hover:text-orange-400" />
  </a>
  )
}
