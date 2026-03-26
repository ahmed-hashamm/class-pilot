// 'use client'

// import { useEffect, useState } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { format } from 'date-fns'
// import Link from 'next/link'
// import { ClipboardList, Calendar, Award, Plus, Paperclip } from 'lucide-react'
// import Loader from '@/components/layout/Loader'

// interface AssignmentsTabProps {
//   classId: string
//   isTeacher: boolean
//   userId: string
// }

// export default function AssignmentsTab({ classId, isTeacher, userId }: AssignmentsTabProps) {
//   const [assignments, setAssignments] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const supabase = createClient()

//   useEffect(() => {
//     loadAssignments()
//   }, [classId, userId])

//   const loadAssignments = async () => {
//     const { data, error } = await supabase
//       .from('assignments')
//       .select('*')
//       .eq('class_id', classId)
//       .order('created_at', { ascending: false })

//     if (!error && data) {
//       setAssignments(data)
//     }
//     setLoading(false)
//   }

//   const getDisplayName = (path: string) => {
//     const fileName = path.split('/').pop() || "File"
//     const parts = fileName.split('-')
//     return parts.length > 1 ? parts.slice(1).join('-') : fileName
//   }

//   if (loading) {
//     return (
//       <Loader text="Loading assignments" border="border-orange-500"/> 

//     )
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       {/* Header Section */}
//       <div className="flex flex-col items-start gap-3 md:flex-row md:items-center justify-between border-b border-gray-300 pb-6 mb-8">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
//           <p className="text-sm text-gray-500">View and manage coursework</p>
//         </div>
//         {isTeacher && (
//           <Link className='w-full md:w-fit' href={`/classes/${classId}/assignments/create`}>
//             <Button className="bg-orange-600 hover:bg-orange-700 text-white w-full md:w-fit rounded-full px-6 shadow-md shadow-orange-100 transition-all">
//               <Plus className="mr-2 h-4 w-4" /> Create Assignment
//             </Button>
//           </Link>
//         )}
//       </div>

//       {assignments.length === 0 ? (
//         <Card className="border-dashed border-2 bg-gray-50/50">
//           <CardContent className="py-20 text-center">
//             <ClipboardList className="mx-auto h-12 w-12 text-gray-300 mb-4" />
//             <p className="text-gray-500 font-medium">No assignments yet.</p>
//             {isTeacher && <p className="text-sm text-gray-400">Click the button above to get started.</p>}
//           </CardContent>
//         </Card>
//       ) : (
//         /* Darker border color applied via divide-gray-300 and border-gray-300 */
//         <div className="space-y-0 ">
//           {assignments.map((assignment) => (
//             /* Wrapped in Link for full row redirect functionality */
//             <Link 
//               key={assignment.id} 
//               href={`/classes/${classId}/assignments/${assignment.id}`}
//               className="group block relative bg-white transition-all border-b border-slate-300 hover:bg-orange-50/30"
//             >
//               <div className="p-6">
//                 <div className="flex items-start gap-4">
//                   {/* Icon */}
//                   <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
//                     <ClipboardList size={24} />
//                   </div>

//                   {/* Content */}
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-start justify-between gap-4">
//                       <h3 className="text-lg font-bold text-gray-900 truncate group-hover:underline decoration-orange-500 underline-offset-4">
//                         {assignment.title}
//                       </h3>
//                       <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 shrink-0">
//                         <Award size={14} className="text-orange-500" />
//                         {assignment.points} pts
//                       </div>
//                     </div>

//                     <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//                       {assignment.description || "No description provided."}
//                     </p>

//                     {/* Metadata: Date & Files */}
//                     <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                       <div className="flex items-center gap-4">
//                         {assignment.due_date && (
//                           <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
//                             <Calendar size={14} className="text-orange-500" />
//                             Due: {format(new Date(assignment.due_date), 'MMM d, h:mm a')}
//                           </div>
//                         )}
//                       </div>

//                       {/* Attachments (Small preview) */}
//                       {(assignment.attachment_paths || assignment.attachments) && (
//                         <div className="flex flex-wrap gap-2">
//                           {(assignment.attachment_paths || assignment.attachments).map((path: any, idx: number) => {
//                              const filePath = typeof path === 'string' ? path : path.path;
//                              return (
//                                <div key={idx} className="flex items-center gap-1 text-[11px] bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-500">
//                                  <Paperclip size={10} className="text-orange-500" />
//                                  <span className="max-w-[100px] truncate">{getDisplayName(filePath)}</span>
//                                </div>
//                              );
//                           })}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import Link from 'next/link'
import { ClipboardList, Calendar, Award, Plus, Paperclip, ArrowRight, RefreshCw } from 'lucide-react'
import AttachmentButton from '@/components/class/Buttons/AttachmentButton'

interface AssignmentsTabProps {
  classId: string
  isTeacher: boolean
  userId: string
}

export default function AssignmentsTab({ classId, isTeacher, userId }: AssignmentsTabProps) {
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const loadAssignments = async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('assignments')
      .select('id, class_id, title, description, points, due_date, attachment_paths, attachments, created_at')
      .eq('class_id', classId)
      .order('created_at', { ascending: false })

    if (error) {
      setError('Failed to load assignments.')
      setAssignments([])
    } else if (data) {
      setAssignments(data)
    }
    setLoading(false)
  }

  useEffect(() => { loadAssignments() }, [classId, userId])

  const getDisplayName = (path: string) => {
    const fileName = path.split('/').pop() || 'File'
    const parts = fileName.split('-')
    return parts.length > 1 ? parts.slice(1).join('-') : fileName
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-muted flex items-center justify-center" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-32" />
              <div className="h-3 bg-muted rounded w-40" />
            </div>
          </div>
          <div className="h-9 w-36 bg-muted rounded-xl" />
        </div>

        <div className="bg-white border border-border rounded-2xl overflow-hidden animate-pulse">
          {[1, 2].map((i) => (
            <div
              key={i}
              className={`flex items-start gap-4 p-5 ${i === 1 ? "border-b border-border" : ""}`}
            >
              <div className="shrink-0 size-11 rounded-xl bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="flex gap-3 mt-2">
                  <div className="h-3 bg-muted rounded w-24" />
                  <div className="h-3 bg-muted rounded w-20" />
                </div>
              </div>
              <div className="shrink-0 h-4 w-4 bg-muted rounded-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 py-6">
        <div className="flex flex-col items-center justify-center gap-4 py-16
          border-2 border-dashed border-border rounded-2xl bg-white text-center">
          <ClipboardList size={32} className="text-muted-foreground/40" />
          <p className="text-[14px] font-medium text-muted-foreground">{error}</p>
          <button
            onClick={() => loadAssignments()}
            className="inline-flex items-center gap-2 bg-navy text-white font-semibold
              text-[13px] px-5 py-2.5 rounded-xl hover:bg-navy/90 transition cursor-pointer
              border-none">
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Split into upcoming and past
  const now = new Date()
  const upcoming = assignments.filter((a) => !a.due_date || new Date(a.due_date) >= now)
  const past = assignments.filter((a) => a.due_date && new Date(a.due_date) < now)

  return (
    <div className="flex flex-col gap-6 py-6">

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-navy flex items-center justify-center">
            <ClipboardList size={17} className="text-yellow" />
          </div>
          <div>
            <h2 className="font-black text-[18px] tracking-tight">Assignments</h2>
            <p className="text-[13px] text-muted-foreground">View and manage coursework</p>
          </div>
        </div>

        {isTeacher && (
          <Link href={`/classes/${classId}/assignments/create`}>
            <button className="inline-flex items-center gap-2 bg-navy text-white
              font-semibold text-[13px] px-5 py-2.5 rounded-xl shadow-sm
              hover:bg-navy/90 hover:-translate-y-0.5 transition-all
              cursor-pointer border-none">
              <Plus size={14} />
              Create assignment
            </button>
          </Link>
        )}
      </div>

      {/* Empty state */}
      {assignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3
          py-16 border-2 border-dashed border-border rounded-2xl bg-white text-center">
          <div className="size-14 rounded-2xl bg-navy/8 border border-navy/15
            flex items-center justify-center">
            <ClipboardList size={24} className="text-navy/40" />
          </div>
          <p className="font-bold text-[16px] tracking-tight">No assignments yet</p>
          <p className="text-[13px] text-muted-foreground max-w-xs leading-relaxed">
            {isTeacher
              ? 'Create your first assignment for students to complete.'
              : 'Your teacher has not posted any assignments yet.'}
          </p>
          {isTeacher && (
            <Link href={`/classes/${classId}/assignments/create`}>
              <button className="mt-2 inline-flex items-center gap-2 bg-navy text-white
                font-semibold text-[13px] px-5 py-2.5 rounded-xl
                hover:bg-navy/90 transition cursor-pointer border-none">
                <Plus size={14} />
                Create first assignment
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <AssignmentGroup
              label="Upcoming"
              assignments={upcoming}
              classId={classId}
              getDisplayName={getDisplayName}
            />
          )}

          {/* Past */}
          {past.length > 0 && (
            <AssignmentGroup
              label="Past"
              assignments={past}
              classId={classId}
              getDisplayName={getDisplayName}
              muted
            />
          )}
        </div>
      )}
    </div>
  )
}

/* ── Assignment group ─────────────────────────────────────────────────────── */
function AssignmentGroup({
  label,
  assignments,
  classId,
  getDisplayName,
  muted = false,
}: {
  label: string
  assignments: any[]
  classId: string
  getDisplayName: (path: string) => string
  muted?: boolean
}) {
  return (
    <div>
      <p className={`text-[11px] font-bold tracking-[.18em] uppercase mb-3
        ${muted ? 'text-muted-foreground/60' : 'text-navy'}`}>
        {label} · {assignments.length}
      </p>

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        {assignments.map((assignment, i) => (
          <Link
            key={assignment.id}
            href={`/classes/${classId}/assignments/${assignment.id}?from=work`}
            className={`group flex items-start gap-4 p-5 transition-colors
              hover:bg-secondary/40
              ${i < assignments.length - 1 ? 'border-b border-border' : ''}`}
          >
            {/* Icon */}
            <div className={`shrink-0 size-11 rounded-xl flex items-center
              justify-center border transition-colors
              ${muted
                ? 'bg-secondary text-muted-foreground border-border group-hover:bg-border'
                : 'bg-navy/8 border-navy/15 text-navy group-hover:bg-navy/12'
              }`}>
              <ClipboardList size={18} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className={`font-bold text-[15px] truncate transition-colors
                  group-hover:text-navy
                  ${muted ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {assignment.title}
                </h3>

                {/* Points badge */}
                {assignment.points != null && (
                  <span className="shrink-0 inline-flex items-center gap-1
                    bg-yellow/20 text-navy border border-yellow/40
                    text-[10px] font-bold rounded-full px-2.5 py-0.5">
                    <Award size={10} />
                    {assignment.points} pts
                  </span>
                )}
              </div>

              {assignment.description && (
                <p className="text-[13px] text-muted-foreground line-clamp-1 mb-2">
                  {assignment.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                {/* Due date */}
                {assignment.due_date && (
                  <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium
                    ${muted ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
                    <Calendar size={12} />
                    Due {format(new Date(assignment.due_date), 'MMM d, h:mm a')}
                  </span>
                )}

                {/* Attachments */}
                {(assignment.attachment_paths || assignment.attachments) && (
                  (assignment.attachment_paths || assignment.attachments).map((path: any, idx: number) => {
                    const filePath = typeof path === 'string' ? path : path.path
                    return (
                      <AttachmentButton
                        key={idx}
                        asDiv
                        path={filePath}
                        type="assignment"
                        label={getDisplayName(filePath)}
                      />
                    )
                  })
                )}
              </div>
            </div>

            {/* Arrow */}
            <ArrowRight size={15} className="shrink-0 mt-0.5 text-muted-foreground/40
              group-hover:text-navy group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  )
}
