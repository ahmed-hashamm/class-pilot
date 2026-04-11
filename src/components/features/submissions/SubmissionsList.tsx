"use client"

import { createClient } from '@/lib/supabase/client'
import { SubmissionItem } from './SubmissionItem'

interface SubmissionsListProps {
  submissions: any[]
  assignment: any
  classId: string
  gradingIds?: string[]
}

/**
 * Renders a list of all submissions for a given assignment.
 * 
 * Features:
 * - Maps over submission objects to render SubmissionItem components
 * - Helper for resolving Supabase Storage avatar URLs
 * - Conditional rendering for the "No submissions yet" empty state
 */
export default function SubmissionsList({
  submissions,
  assignment,
  classId,
  gradingIds = []
}: SubmissionsListProps) {
  const supabase = createClient()

  const getAvatarSrc = (path?: string) => {
    if (!path) return undefined
    if (path.startsWith('http')) return path
    return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
  }

  if (!submissions?.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12
        border-2 border-dashed border-border rounded-2xl bg-white text-center">
        <p className="text-[14px] font-medium text-muted-foreground">No submissions yet</p>
      </div>
    )
  }

  return (
    <>
      {submissions.map((submission: any, i: number) => (
        <SubmissionItem 
          key={submission.id}
          submission={submission}
          assignment={assignment}
          classId={classId}
          isGrading={gradingIds.includes(submission.id)}
          getAvatarSrc={getAvatarSrc}
          isLast={i === submissions.length - 1}
        />
      ))}
    </>
  )
}
