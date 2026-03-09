// 'use client'

// import StickyNotes from '@/components/class/Sidebar/StickyNotes'
// import SidebarCard from '@/components/class/Sidebar/Sidebar'
// import Feed from '@/components/class/Feed/Feed'
// import { Button } from '@/components/ui/button'
// import { Copy, Lock } from 'lucide-react'

// interface Assignment {
//   id: string
//   title: string
//   dueDate: string
// }

// interface StreamViewProps {
//   classId: string
//   classCode: string
//   isTeacher: boolean
//   userId: string
//   assignments?: Assignment[]
//   // Add settings prop to receive the showClassCode boolean
//   settings?: {
//     showClassCode?: boolean;
//   }
// }

// export default function StreamView({ 
//   classId, 
//   classCode, 
//   isTeacher, 
//   userId, 
//   assignments = [],
//   settings 
// }: StreamViewProps) {
//   const dueSoon = assignments.filter((a: Assignment) => new Date(a.dueDate) >= new Date())

//   // Logic: Only hide if the setting is false AND the user is NOT a teacher
//   const isCodeHidden = settings?.showClassCode === false && !isTeacher;
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto py-8">
//       {/* Sidebar */}
//       <div className="lg:col-span-3 space-y-4">
//         <SidebarCard title="Classroom Code">
//           {isCodeHidden ? (
//             /* HIDDEN STATE FOR STUDENTS */
//             <div className="space-y-2">
//               <div className="flex items-center gap-2 text-zinc-400 italic">
//                 <Lock size={14} />
//                 <span className="text-sm font-medium">Code Disabled</span>
//               </div>
//               <p className="text-[10px] text-zinc-500 leading-relaxed">
//                 The teacher has hidden the class code. Ask your instructor for the class code.
//               </p>
//             </div>
//           ) : (
//             /* VISIBLE STATE (Teachers see this always, Students see if enabled) */
//             <div className="flex items-center gap-2">
//               <span className="text-3xl font-bold text-[#4c6ef5] tracking-tight">
//                 {classCode}
//               </span>
//               <Button
//                 variant="ghost"
//                 onClick={() => navigator.clipboard.writeText(classCode)}
//                 className="text-blue-500 hover:bg-blue-50 h-9 w-9 p-0"
//               >
//                 <Copy size={18} />
//               </Button>
//               {/* Optional: Add a small badge if the teacher has it hidden from others */}
//               {isTeacher && settings?.showClassCode === false && (
//                 <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase">
//                   Hidden
//                 </span>
//               )}
//             </div>
//           )}
//         </SidebarCard>

//         <SidebarCard title="Due Soon">
//           {dueSoon.length === 0 ? (
//             <p className="text-xs text-gray-400 italic">🎉 No due work</p>
//           ) : (
//             <ul className="space-y-1 text-xs text-gray-600 font-medium">
//               {dueSoon.map((a: Assignment) => (
//                 <li key={a.id} className="flex justify-between">
//                   <span>{a.title}</span>
//                   <span className="text-gray-400">{new Date(a.dueDate).toLocaleDateString()}</span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </SidebarCard>

//         <StickyNotes classId={classId} />
//       </div>

//       {/* Feed */}
//       <div className="lg:col-span-9">
//         <Feed classId={classId} isTeacher={isTeacher} userId={userId} />
//       </div>
//     </div>
//   )
// }

'use client'

import StickyNotes from '@/components/class/Sidebar/StickyNotes'
import SidebarCard from '@/components/class/Sidebar/Sidebar'
import Feed from '@/components/class/Feed/Feed'
import { Copy, Lock, Eye, EyeOff, CheckCheck } from 'lucide-react'
import { useState } from 'react'

interface Assignment {
  id: string
  title: string
  dueDate: string
}

interface StreamViewProps {
  classId: string
  classCode: string
  isTeacher: boolean
  userId: string
  assignments?: Assignment[]
  settings?: {
    showClassCode?: boolean
  }
}

export default function StreamView({
  classId,
  classCode,
  isTeacher,
  userId,
  assignments = [],
  settings,
}: StreamViewProps) {
  const [copied, setCopied] = useState(false)

  const dueSoon = assignments.filter(
    (a: Assignment) => new Date(a.dueDate) >= new Date()
  )

  const isCodeHidden = settings?.showClassCode === false && !isTeacher

  const handleCopy = () => {
    navigator.clipboard.writeText(classCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto py-6">

      {/* Sidebar */}
      <div className="lg:col-span-3 flex flex-col gap-4">

        {/* Class code card */}
        <SidebarCard title="Class Code">
          {isCodeHidden ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock size={13} className="shrink-0" />
                <span className="text-[13px] font-semibold">Code hidden</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                The teacher has disabled the class code. Ask your instructor to share it directly.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Code display */}
              <div className="flex items-center justify-between gap-2
                bg-secondary border border-border rounded-xl px-4 py-3">
                <span className="font-black text-[22px] tracking-widest text-navy
                  font-mono leading-none">
                  {classCode}
                </span>
                <button
                  onClick={handleCopy}
                  className={`shrink-0 inline-flex items-center gap-1.5 text-[12px]
                    font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer
                    border-none
                    ${copied
                      ? 'bg-green-100 text-green-700'
                      : 'bg-navy/8 text-navy hover:bg-navy/15'
                    }`}>
                  {copied
                    ? <><CheckCheck size={12} />Copied!</>
                    : <><Copy size={12} />Copy</>
                  }
                </button>
              </div>

              {/* Teacher-only: hidden from students notice */}
              {isTeacher && settings?.showClassCode === false && (
                <div className="flex items-center gap-2 bg-yellow/15 border
                  border-yellow/40 rounded-lg px-3 py-2">
                  <EyeOff size={12} className="text-navy shrink-0" />
                  <p className="text-[11px] font-semibold text-navy">
                    Hidden from students
                  </p>
                </div>
              )}

              {/* Teacher-only: visible to students notice */}
              {isTeacher && settings?.showClassCode !== false && (
                <div className="flex items-center gap-2 bg-secondary border
                  border-border rounded-lg px-3 py-2">
                  <Eye size={12} className="text-muted-foreground shrink-0" />
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Visible to students
                  </p>
                </div>
              )}
            </div>
          )}
        </SidebarCard>

        {/* Due soon card */}
        <SidebarCard title="Due Soon">
          {dueSoon.length === 0 ? (
            <div className="flex items-center gap-2 py-1">
              <span className="text-[18px]">🎉</span>
              <p className="text-[12px] text-muted-foreground font-medium">
                Nothing due — all clear!
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {dueSoon.map((a: Assignment) => (
                <li key={a.id}
                  className="flex items-center justify-between gap-2
                    bg-secondary border border-border/60 rounded-lg px-3 py-2">
                  <span className="text-[12px] font-medium text-foreground truncate">
                    {a.title}
                  </span>
                  <span className="shrink-0 text-[11px] text-muted-foreground font-medium">
                    {new Date(a.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SidebarCard>

        <StickyNotes classId={classId} />
      </div>

      {/* Feed */}
      <div className="lg:col-span-9">
        <Feed classId={classId} isTeacher={isTeacher} userId={userId} />
      </div>

    </div>
  )
}