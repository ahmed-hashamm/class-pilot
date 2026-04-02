"use client"

import { CheckCircle2, Clock, FileText } from 'lucide-react'

interface SubmissionStatusBadgeProps {
  isGraded: boolean
  isDraft: boolean
}

export function SubmissionStatusBadge({ isGraded, isDraft }: SubmissionStatusBadgeProps) {
  const statusClass = isGraded 
    ? 'bg-green-50 text-green-700 border-green-100' 
    : isDraft 
      ? 'bg-yellow/20 text-navy border-yellow/30' 
      : 'bg-yellow/10 text-navy border-yellow/20'

  const Icon = isGraded ? CheckCircle2 : isDraft ? FileText : Clock
  const label = isGraded ? 'Graded' : isDraft ? 'Draft' : 'Pending'

  return (
    <div className={`px-2 sm:px-3 py-1.5 rounded-xl border font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 ${statusClass}`}>
      <Icon size={12} />
      <span className="hidden sm:inline">{label}</span>
    </div>
  )
}
