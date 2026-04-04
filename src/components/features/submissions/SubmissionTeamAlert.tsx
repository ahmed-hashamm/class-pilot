'use client'

import { Users } from 'lucide-react'

interface SubmissionTeamAlertProps {
  isGroupProject: boolean
}

/**
 * Renders a specialized alert for group projects showing the "Team Submission Mode" warning.
 * Used in AssignmentDetail and SubmissionForm contexts.
 */
export function SubmissionTeamAlert({ isGroupProject }: SubmissionTeamAlertProps) {
  if (!isGroupProject) return null

  return (
    <div className="flex gap-4 p-5 bg-navy/[0.03] border-l-4 border-navy rounded-r-2xl">
      <Users size={20} className="text-navy shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="text-[12px] font-black uppercase tracking-wider text-navy">Team Submission Mode</p>
        <p className="text-[13px] text-navy/70 font-medium leading-normal">
          Submitting on behalf of your group. All team members will receive this submission's grade.
        </p>
      </div>
    </div>
  )
}
