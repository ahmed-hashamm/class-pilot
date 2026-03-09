// 'use client'

// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { Card, CardContent } from '@/components/ui/card'
// import { Plus, MoreVertical, Users, Settings, Eye, LogOut, Pin, PinOff } from 'lucide-react'
// import { format } from 'date-fns'
// import { useState, useRef, useEffect } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { Button } from '../ui/button'

// interface ClassCardProps {
//   classId: string
//   classData: {
//     name: string
//     owner_profile: {
//       full_name: string
//       avatar_url: string | null
//     }
//   }
//   role: string
//   studentCount: number
//   assignments: any[]
//   isPinned: boolean
// }

// export default function ClassCard({ classId, classData, role, studentCount, assignments, isPinned: initialIsPinned }: ClassCardProps) {
//   const [menuOpen, setMenuOpen] = useState(false)
//   const [imgError, setImgError] = useState(false)
//   const [isLeaving, setIsLeaving] = useState(false)
//   const [isPinned, setIsPinned] = useState(initialIsPinned);
//   const [isPinning, setIsPinning] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null)
//   const router = useRouter()
//   const supabase = createClient()

//   const isTeacher = role.toLowerCase() === 'teacher'
//   const teacher = classData?.owner_profile
//   const teacherName = teacher?.full_name || "Teacher"
//   // useEffect(() => {
//   //   setIsPinned(initialIsPinned);
//   // }, [initialIsPinned]);

//   const togglePin = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsPinning(true);
    
//     try {
//       const { error } = await supabase
//         .from('class_members')
//         .update({ is_pinned: !isPinned } as never)
//         .eq('class_id', classId);

//       if (error) throw error;
//       setIsPinned(!isPinned);
//       setMenuOpen(false); // Close menu after pinning
//       router.refresh(); 
//     } catch (err) {
//       console.error("Pinning error:", err);
//     } finally {
//       setIsPinning(false);
//     }
//   };
  

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
//     }
//     if (menuOpen) document.addEventListener('mousedown', handler)
//     return () => document.removeEventListener('mousedown', handler)
//   }, [menuOpen])

//   const handleLeaveClass = async () => {
//     if (!confirm('Are you sure you want to leave this class?')) return
    
//     setIsLeaving(true)
//     try {
//       const { error } = await supabase
//         .from('class_members')
//         .delete()
//         .eq('class_id', classId)
        
//       if (error) throw error
//       router.refresh()
//     } catch (error) {
//       console.error('Error leaving class:', error)
//       alert('Failed to leave class.')
//     } finally {
//       setIsLeaving(false)
//       setMenuOpen(false)
//     }
//   }

//   return (
//     <Card className={`relative group/card hover:shadow-md transition-all border-zinc-200 overflow-hidden bg-white ${isLeaving ? 'opacity-50 pointer-events-none' : ''}`}>
//       {/* Visual Indicator for Pinned Class (Optional) */}
//       {isPinned && (
//         <span className="absolute top-2 right-2  text-xs font-bold">
//            📌 
//         </span>
//       )}

//       <CardContent className="p-0">
//         <div className={`h-1.5 w-full ${isTeacher ? 'bg-indigo-900' : 'bg-emerald-500'}`} />
        
//         <div className="p-5">
//           <div className="flex justify-between items-start mb-4">
//             <div className="space-y-1 flex-1">
//               <Link href={`/classes/${classId}`}>
//                 <h3 className="font-bold text-lg text-zinc-900 hover:text-indigo-600 transition-colors line-clamp-1">
//                   {classData?.name}
//                 </h3>
//                 <p className="text-[10px] font-semibold text-zinc-500 truncate max-w-[120px]">
//                   {teacherName}
//                 </p>
//               </Link>
//               <div className="flex items-center gap-2 text-xs text-zinc-500">
//                 <span className="flex items-center gap-1"><Users size={12}/> {studentCount}</span>
//                 <span>•</span>
//                 <span className={`capitalize font-medium ${isTeacher ? 'text-indigo-600' : 'text-emerald-600'}`}>{role}</span>
//               </div>
//             </div>

//             <div className="flex flex-col items-center gap-1 ml-3 min-w-[64px]">
//               <div className="h-14 w-14 shrink-0 rounded-full border-2 border-white shadow-sm ring-1 ring-zinc-100 overflow-hidden bg-zinc-50 flex items-center justify-center">
//                 {teacher?.avatar_url && !imgError ? (
//                   <img 
//                     src={teacher.avatar_url} 
//                     alt={teacherName} 
//                     referrerPolicy="no-referrer"
//                     className="h-full w-full object-cover"
//                     onError={() => setImgError(true)}
//                   />
//                 ) : (
//                   <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold text-sm">
//                     {teacherName.charAt(0).toUpperCase()}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="space-y-2 mb-6">
//             {assignments && assignments.length > 0 ? (
//               assignments.map((a: any) => (
//                 <div key={a.id} className="flex justify-between text-xs text-zinc-600">
//                   <span className="truncate max-w-[180px]">{a.title}</span>
//                   {a.due_date && <span className="text-zinc-400 shrink-0">{format(new Date(a.due_date), 'MMM d')}</span>}
//                 </div>
//               ))
//             ) : (
//               <p className="text-[11px] text-zinc-400 italic">No upcoming assignments</p>
//             )}
//           </div>

//           <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
//             <div className="flex gap-1">
//               <Link href={`/classes/${classId}`} className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
//                 <Eye size={18} />
//               </Link>
//               {isTeacher && (
//                 <button 
//                   onClick={() => router.push(`/classes/${classId}/assignments/create`)}
//                   className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
//                 >
//                   <Plus size={18} />
//                 </button>
//               )}
//             </div>

//             <div ref={menuRef} className="relative">
//               <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-lg transition-colors">
//                 <MoreVertical size={18} />
//               </button>
//               {menuOpen && (
//                 <div className="absolute right-0 bottom-full mb-2 w-44 bg-white border rounded-xl shadow-xl z-50 py-1 animate-in fade-in slide-in-from-bottom-1">
                  
//                   {/* Pin/Unpin Action - Available for both roles */}
//                   <button 
//                     onClick={togglePin}
//                     disabled={isPinning}
//                     className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50"
//                   >
//                     {isPinned ? (
//                       <>
//                         <PinOff size={14} className="text-indigo-600" />
//                         Unpin Class
//                       </>
//                     ) : (
//                       <>
//                         <Pin size={14} className="text-zinc-400" />
//                         Pin Class
//                       </>
//                     )}
//                   </button>

//                   <div className="h-px bg-zinc-100 my-1" />

//                   {isTeacher ? (
//                     <>
//                       <Link href={`/classes/${classId}`} className="block px-4 py-2 text-sm hover:bg-zinc-50 text-zinc-700">
//                         Open Classroom
//                       </Link>
//                     </>
//                   ) : (
//                     <button 
//                       onClick={handleLeaveClass}
//                       className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium text-left"
//                     >
//                       <LogOut size={14} />
//                       Leave Class
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, MoreVertical, Users, Eye, LogOut, Pin, PinOff } from 'lucide-react'
import { format } from 'date-fns'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
interface ClassCardProps {
  classId: string
  classData: {
    name: string
    owner_profile: {
      full_name: string
      avatar_url: string | null
    }
  }
  role: string
  studentCount: number
  assignments: any[]
  isPinned: boolean
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function ClassCard({
  classId,
  classData,
  role,
  studentCount,
  assignments,
  isPinned: initialIsPinned,
}: ClassCardProps) {
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [imgError,  setImgError]  = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [isPinned,  setIsPinned]  = useState(initialIsPinned)
  const [isPinning, setIsPinning] = useState(false)
  const menuRef  = useRef<HTMLDivElement>(null)
  const router   = useRouter()
  const supabase = createClient()

  const isTeacher   = role.toLowerCase() === 'teacher'
  const teacher     = classData?.owner_profile
  const teacherName = teacher?.full_name || 'Teacher'

  /* ── Pin toggle ── */
  const togglePin = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsPinning(true)
    try {
      const { error } = await supabase
        .from('class_members')
        .update({ is_pinned: !isPinned } as never)
        .eq('class_id', classId)
      if (error) throw error
      setIsPinned(!isPinned)
      setMenuOpen(false)
      router.refresh()
    } catch (err) {
      console.error('Pinning error:', err)
    } finally {
      setIsPinning(false)
    }
  }

  /* ── Close menu on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  /* ── Leave class ── */
  const handleLeaveClass = async () => {
    if (!confirm('Are you sure you want to leave this class?')) return
    setIsLeaving(true)
    try {
      const { error } = await supabase
        .from('class_members')
        .delete()
        .eq('class_id', classId)
      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error('Error leaving class:', error)
      alert('Failed to leave class.')
    } finally {
      setIsLeaving(false)
      setMenuOpen(false)
    }
  }

  return (
    <div className={`relative flex flex-col bg-white border border-border rounded-2xl
      overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
      ${isLeaving ? 'opacity-50 pointer-events-none' : ''}`}>

      {/* ── Top colour stripe — navy for teacher, navy-light for student ── */}
      <div className={`h-1.5 w-full shrink-0 ${isTeacher ? 'bg-navy' : 'bg-navy-light'}`} />

      {/* ── Pinned badge ── */}
      {isPinned && (
        <span className="absolute top-4 right-4 inline-flex items-center gap-1
          text-[10px] font-bold tracking-widest uppercase
          bg-yellow text-navy border border-yellow/60 rounded-full px-2 py-0.5">
          <Pin size={8} />
          Pinned
        </span>
      )}

      <div className="flex flex-col flex-1 p-5">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <Link href={`/classes/${classId}`}>
              <h3 className="font-bold text-[16px] text-foreground hover:text-navy
                transition-colors line-clamp-1 tracking-tight mb-1">
                {classData?.name}
              </h3>
            </Link>

            {/* Role badge */}
            <span className={`inline-flex items-center text-[10px] font-bold
              tracking-widest uppercase rounded-full px-2.5 py-0.5
              ${isTeacher
                ? 'bg-navy/8 text-navy border border-navy/15'
                : 'bg-navy-light/12 text-navy-light border border-navy-light/25'
              }`}>
              {role}
            </span>

            {/* Student count */}
            <div className="flex items-center gap-1 mt-2 text-[12px] text-muted-foreground">
              <Users size={11} />
              <span>{studentCount} student{studentCount !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Teacher avatar */}
          <div className="shrink-0 size-11 rounded-xl overflow-hidden border border-border
            bg-secondary flex items-center justify-center">
            {teacher?.avatar_url && !imgError ? (
              <img
                src={teacher.avatar_url}
                alt={teacherName}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-[15px] font-black text-navy">
                {teacherName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* ── Teacher name ── */}
        <p className="text-[11px] font-semibold text-muted-foreground mb-3 truncate">
          {isTeacher ? 'Your class' : `By ${teacherName}`}
        </p>

        {/* ── Assignments list ── */}
        <div className="flex flex-col gap-1.5 flex-1 mb-5">
          {assignments && assignments.length > 0 ? (
            assignments.map((a: any) => (
              <div key={a.id}
                className="flex items-center justify-between gap-2 px-3 py-2
                  bg-secondary rounded-lg border border-border/60">
                <span className="truncate text-[12px] font-medium text-foreground">
                  {a.title}
                </span>
                {a.due_date && (
                  <span className="shrink-0 text-[11px] text-muted-foreground font-medium">
                    {format(new Date(a.due_date), 'MMM d')}
                  </span>
                )}
              </div>
            ))
          ) : (
            <p className="text-[12px] text-muted-foreground italic py-1">
              No upcoming assignments
            </p>
          )}
        </div>

        {/* ── Footer actions ── */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex gap-1">
            <Link href={`/classes/${classId}`}
              className="p-2 rounded-lg text-muted-foreground hover:text-navy
                hover:bg-navy/8 transition-colors">
              <Eye size={15} />
            </Link>
            {isTeacher && (
              <button
                onClick={() => router.push(`/classes/${classId}/assignments/create`)}
                className="p-2 rounded-lg text-muted-foreground hover:text-navy
                  hover:bg-navy/8 transition-colors cursor-pointer">
                <Plus size={15} />
              </button>
            )}
          </div>

          {/* ⋯ menu */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-secondary
                transition-colors cursor-pointer">
              <MoreVertical size={15} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-44 bg-white border
                border-border rounded-xl shadow-xl z-50 py-1.5
                animate-in fade-in slide-in-from-bottom-1">

                <button
                  onClick={togglePin}
                  disabled={isPinning}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px]
                    text-foreground hover:bg-secondary transition-colors
                    disabled:opacity-50 cursor-pointer">
                  {isPinned ? (
                    <><PinOff size={13} className="text-navy" />Unpin class</>
                  ) : (
                    <><Pin size={13} className="text-muted-foreground" />Pin class</>
                  )}
                </button>

                <div className="h-px bg-border my-1" />

                {isTeacher ? (
                  <Link href={`/classes/${classId}`}
                    className="flex items-center gap-2.5 px-4 py-2 text-[13px]
                      text-foreground hover:bg-secondary transition-colors">
                    <Eye size={13} className="text-muted-foreground" />
                    Open classroom
                  </Link>
                ) : (
                  <button
                    onClick={handleLeaveClass}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px]
                      text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                    <LogOut size={13} />
                    Leave class
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}