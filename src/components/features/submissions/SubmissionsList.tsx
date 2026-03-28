// 'use client'

// import { format } from 'date-fns'
// import Link from 'next/link'
// import { Calendar } from 'lucide-react'
// import { createClient } from '@/lib/supabase/client'

// import { Card } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// interface SubmissionsListProps {
//   submissions: any[]
//   assignment: any
//   classId: string
// }

// export default function SubmissionsList({
//   submissions,
//   assignment,
//   classId,
// }: SubmissionsListProps) {
//   const supabase = createClient()

//   const getInitials = (name?: string) =>
//     name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

//   const getAvatarSrc = (path?: string) => {
//     if (!path) return undefined
//     if (path.startsWith('http')) return path

//     const { data } = supabase.storage.from('avatars').getPublicUrl(path)
//     return data.publicUrl
//   }

//   if (!submissions?.length) {
//     return (
//       <div className="rounded-2xl border border-dashed border-gray-100 py-10 text-center">
//         <p className="text-sm font-medium text-gray-400">No submissions yet</p>
//       </div>
//     )
//   }


//   return (
//     <div className="space-y-2">
//       {submissions.map((submission: any) => {
//         const student = submission.users
//         const studentName = student?.full_name || student?.email || 'Unknown Student'
//         const avatarSrc = getAvatarSrc(student?.avatar_url)

//         return (
//           <Card
//             key={submission.id}
//             className="rounded-xl border border-gray-100 bg-white transition-all hover:border-orange-200 hover:shadow-sm"
//           >
//             <div className="flex items-center justify-between gap-3 p-4">
//               <div className="flex min-w-0 items-center gap-3">
//                 <Avatar className="h-10 w-10 shrink-0 ring-1 ring-gray-100">
//                   <AvatarImage 
//                     src={avatarSrc} 
//                     alt={studentName} 
//                     className="object-cover"
//                   />
//                   <AvatarFallback className="bg-orange-100 text-orange-700 text-xs font-bold">
//                     {getInitials(studentName)}
//                   </AvatarFallback>
//                 </Avatar>

//                 <div className="min-w-0">
//                   <p className="truncate text-sm font-bold text-gray-900">
//                     {studentName}
//                   </p>
//                   <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-400">
//                     <Calendar size={11} />
//                     {submission.submitted_at
//                       ? format(new Date(submission.submitted_at), 'MMM d, h:mm a')
//                       : 'Not submitted'}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex shrink-0 items-center gap-4">
//                 <Badge className={`text-[9px] font-black uppercase tracking-wide ${
//                     submission.status === 'graded' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
//                 }`}>
//                   {submission.status}
//                 </Badge>

//                 {submission.final_grade !== null && (
//                   <div className="hidden sm:block text-right">
//                     <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Score</p>
//                     <p className="text-sm font-black text-gray-900">
//                       {submission.final_grade}<span className="text-gray-400">/{assignment.points}</span>
//                     </p>
//                   </div>
//                 )}

//                 <Link href={`/classes/${classId}/assignments/${assignment.id}/submissions/${submission.id}`}>
//                   <Button
//                     size="sm"
//                     className="rounded-lg border-2 border-orange-600 bg-white font-bold text-orange-600 transition-all hover:bg-orange-600 hover:text-white active:scale-95"
//                   >
//                     {submission.status === 'graded' ? 'View' : 'Grade'}
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </Card>
//         )
//       })}
//     </div>
//   )
// }

'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight, CheckCircle2, Clock, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface SubmissionsListProps {
  submissions: any[]
  assignment: any
  classId: string
}

export default function SubmissionsList({ submissions, assignment, classId }: SubmissionsListProps) {
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
        const student     = submission.users
        const studentName = student?.full_name || student?.email || 'Unknown Student'
        const isGraded    = submission.status === 'graded'
        const isGroup     = !!assignment.is_group_project
        const groupData   = submission.group_projects
        const groupName   = groupData?.title
        const members     = groupData?.project_members || []

        return (
          <div key={submission.id}
            className={`flex flex-col gap-4 px-6 py-5
              hover:bg-secondary/20 transition-all group
              ${i < submissions.length - 1 ? 'border-b border-border' : ''}`}>

            {/* Top Row: Title, Badges, and Grading Info */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                {!isGroup && (
                  <StudentAvatar
                    name={studentName}
                    src={getAvatarSrc(student?.avatar_url)}
                    initial={getInitial(studentName)}
                  />
                )}
                {isGroup && (
                  <div className="shrink-0 size-10 rounded-xl bg-navy flex items-center justify-center text-yellow border border-navy/20">
                    <Users size={20} />
                  </div>
                )}

                <div className="min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[16px] text-foreground truncate group-hover:text-navy transition-colors">
                      {isGroup ? (groupName || "Unnamed Team") : studentName}
                    </p>
                    {isGroup && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-navy/5 text-navy text-[10px] font-black uppercase tracking-wider border border-navy/10">
                        Team
                      </span>
                    )}
                  </div>
                  <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Calendar size={11} />
                    Submitted: {submission.submitted_at ? format(new Date(submission.submitted_at), 'MMM d, h:mm a') : 'Not submitted'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                {/* Score */}
                {submission.final_grade !== null && (
                  <div className="hidden sm:flex flex-col items-end">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Score</p>
                    <p className="font-black text-[17px] text-foreground leading-none">
                      {submission.final_grade}
                      <span className="text-[12px] text-muted-foreground font-bold ml-0.5">/{assignment.points}</span>
                    </p>
                  </div>
                )}

                {/* Status Badge */}
                <div className={`px-3 py-1.5 rounded-xl border font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5
                  ${isGraded ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow/10 text-navy border-yellow/20'}`}>
                  {isGraded ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {isGraded ? 'Graded' : 'Pending'}
                </div>

                {/* Main Action */}
                <Link href={`/classes/${classId}/assignments/${assignment.id}/submissions/${submission.id}`}>
                  <button className={`size-10 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer group/btn shadow-sm
                    ${isGraded
                      ? 'bg-white text-navy border-border hover:border-navy/40 hover:bg-secondary/50'
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
