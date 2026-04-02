
'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight, CheckCircle2, Clock, Users, FileText, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface SubmissionsListProps {
  submissions: any[]
  assignment: any
  classId: string
  gradingIds?: string[]
}

export default function SubmissionsList({
  submissions,
  assignment,
  classId,
  gradingIds = []
}: SubmissionsListProps) {
  const supabase = createClient()

  const getInitial = (name?: string) => name?.charAt(0).toUpperCase() || '?'

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
      {submissions.map((submission: any, i: number) => {
        const student = submission.users
        const studentName = student?.full_name || student?.email || 'Unknown Student'
        const isGraded = submission.status === 'graded' || !!submission.final_grade
        const isDraft = (typeof submission.ai_grade === 'number' && submission.ai_grade !== null) && submission.final_grade === null
        const isGrading = gradingIds.includes(submission.id)
        const isGroup = !!assignment.is_group_project
        const groupData = submission.group_projects
        const groupName = groupData?.title
        const members = groupData?.project_members || []

        return (
          <div key={submission.id}
            className={`flex flex-col gap-4 px-4 sm:px-6 py-5
              hover:bg-secondary/20 transition-all group
              ${i < submissions.length - 1 ? 'border-b border-border' : ''}`}>

            {/* Top Row: Title, Badges, and Grading Info */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                {!isGroup && (
                  <StudentAvatar
                    name={studentName}
                    src={getAvatarSrc(student?.avatar_url)}
                    initial={getInitial(studentName)}
                    size="size-9 sm:size-10"
                  />
                )}
                {isGroup && (
                  <div className="shrink-0 size-9 sm:size-10 rounded-xl bg-navy flex items-center justify-center text-yellow border border-navy/20">
                    <Users size={18} className="sm:size-5" />
                  </div>
                )}

                <div className="min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-[14px] sm:text-[16px] text-foreground truncate group-hover:text-navy transition-colors">
                      {isGroup ? (groupName || "Unnamed Team") : studentName}
                    </p>
                    {isGroup && (
                      <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg bg-navy/5 text-navy text-[9px] font-black uppercase tracking-wider border border-navy/10">
                        Team
                      </span>
                    )}
                    {isDraft && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-yellow/20 text-navy text-[9px] font-black uppercase tracking-wider border border-yellow/30">
                        <FileText size={10} />
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-muted-foreground whitespace-nowrap overflow-hidden mt-0.5">
                    {isGrading ? (
                      <span className="text-blue-600 font-black animate-pulse flex items-center gap-1">
                        <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" />
                        AI Grading...
                      </span>
                    ) : (
                      <>
                        <Calendar size={10} className="sm:size-3" />
                        <span className="hidden sm:inline">Submitted: </span>
                        <span className="truncate">
                          {(() => {
                            const dateStr = submission.submitted_at || (submission.status !== 'pending' ? submission.created_at : null);
                            if (!dateStr) return 'Not submitted';
                            try {
                              return format(new Date(dateStr), "MMM d, h:mm a");
                            } catch (e) {
                              return 'Invalid Date';
                            }
                          })()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                {/* Score Section: Final Grade OR AI Draft Grade */}
                {(submission.final_grade !== null || (isDraft && submission.ai_grade !== null)) && (
                  <div className="hidden sm:flex flex-col items-end">
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${isDraft ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                      {isDraft ? 'AI Draft' : 'Score'}
                    </p>
                    <p className={`font-black text-[17px] leading-none ${isDraft ? 'text-yellow-700' : 'text-foreground'}`}>
                      {submission.final_grade ?? submission.ai_grade}
                      <span className={`text-[12px] font-bold ml-0.5 ${isDraft ? 'text-yellow-600/60' : 'text-muted-foreground'}`}>/{assignment.points}</span>
                    </p>
                  </div>
                )}

                {/* Status Badge */}
                <div className={`px-2 sm:px-3 py-1.5 rounded-xl border font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5
                  ${isGraded ? 'bg-green-50 text-green-700 border-green-100' : isDraft ? 'bg-yellow/20 text-navy border-yellow/30' : 'bg-yellow/10 text-navy border-yellow/20'}`}>
                  {isGraded ? <CheckCircle2 size={12} /> : isDraft ? <FileText size={12} /> : <Clock size={12} />}
                  <span className="hidden sm:inline">{isGraded ? 'Graded' : isDraft ? 'Draft' : 'Pending'}</span>
                </div>

                {/* Main Action */}
                <Link href={`/classes/${classId}/assignments/${assignment.id}/submissions/${submission.id}`}>
                  <button className={`size-10 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer group/btn shadow-sm
                    ${isGraded
                      ? 'bg-white text-navy border-border hover:border-navy/40 hover:bg-secondary/50'
                      : isDraft
                        ? 'bg-navy-light text-white border-navy-light hover:bg-navy-light/90 hover:shadow-md'
                        : 'bg-navy text-white border-navy hover:bg-navy/90 hover:shadow-md active:scale-95'
                    }`}>
                    <ArrowRight size={18} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Bottom Section: Group Members Roster (Only for Groups) */}
            {isGroup && members.length > 0 && (
              <div className="ml-0 sm:ml-[56px] border-l-2 border-border/40 pl-4 py-1 flex flex-col gap-2.5 min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-[.15em] text-navy/30">Group Members</p>
                <div className="flex flex-wrap gap-x-6 gap-y-3 w-full">
                  {members.map((m: any, idx: number) => {
                    const mName = m.users?.full_name || "Member";
                    return (
                      <div key={idx} className="flex items-center gap-2.5 group/m">
                        <StudentAvatar
                          name={mName}
                          src={getAvatarSrc(m.users?.avatar_url)}
                          initial={getInitial(mName)}
                          size="size-7"
                        />
                        <span className="text-[12px] font-bold text-foreground/70 group-hover/m:text-navy transition-colors truncate max-w-[120px]">
                          {mName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

/* ── Student avatar with image fallback ── */
function StudentAvatar({ name, src, initial, size = "size-10" }: { name: string; src?: string; initial: string; size?: string }) {
  const [imgError, setImgError] = useState(false)
  return (
    <div className={`shrink-0 ${size} rounded-xl overflow-hidden border flex items-center justify-center font-black text-[14px] relative bg-secondary text-navy border-border`}>
      {src && !imgError ? (
        <Image src={src} alt={name} className="object-cover" fill
          onError={() => setImgError(true)} />
      ) : initial}
    </div>
  )
}
