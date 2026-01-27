'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface SubmissionsListProps {
  submissions: any[]
  assignment: any
  classId: string
}

export default function SubmissionsList({
  submissions,
  assignment,
  classId,
}: SubmissionsListProps) {
  const supabase = createClient()

  const getInitials = (name?: string) =>
    name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  const getAvatarSrc = (path?: string) => {
    if (!path) return undefined
    if (path.startsWith('http')) return path

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    return data.publicUrl
  }

  if (!submissions?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-100 py-10 text-center">
        <p className="text-sm font-medium text-gray-400">No submissions yet</p>
      </div>
    )
  }


  return (
    <div className="space-y-2">
      {submissions.map((submission: any) => {
        const student = submission.users
        const studentName = student?.full_name || student?.email || 'Unknown Student'
        const avatarSrc = getAvatarSrc(student?.avatar_url)

        return (
          <Card
            key={submission.id}
            className="rounded-xl border border-gray-100 bg-white transition-all hover:border-orange-200 hover:shadow-sm"
          >
            <div className="flex items-center justify-between gap-3 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="h-10 w-10 shrink-0 ring-1 ring-gray-100">
                  <AvatarImage 
                    src={avatarSrc} 
                    alt={studentName} 
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-orange-100 text-orange-700 text-xs font-bold">
                    {getInitials(studentName)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-gray-900">
                    {studentName}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    <Calendar size={11} />
                    {submission.submitted_at
                      ? format(new Date(submission.submitted_at), 'MMM d, h:mm a')
                      : 'Not submitted'}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <Badge className={`text-[9px] font-black uppercase tracking-wide ${
                    submission.status === 'graded' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  {submission.status}
                </Badge>

                {submission.final_grade !== null && (
                  <div className="hidden sm:block text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Score</p>
                    <p className="text-sm font-black text-gray-900">
                      {submission.final_grade}<span className="text-gray-400">/{assignment.points}</span>
                    </p>
                  </div>
                )}

                <Link href={`/classes/${classId}/assignments/${assignment.id}/submissions/${submission.id}`}>
                  <Button
                    size="sm"
                    className="rounded-lg border-2 border-orange-600 bg-white font-bold text-orange-600 transition-all hover:bg-orange-600 hover:text-white active:scale-95"
                  >
                    {submission.status === 'graded' ? 'View' : 'Grade'}
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
