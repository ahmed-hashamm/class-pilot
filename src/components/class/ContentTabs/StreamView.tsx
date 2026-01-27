'use client'

import StickyNotes from '@/components/class/Sidebar/StickyNotes'
import SidebarCard from '@/components/class/Sidebar/Sidebar'
import Feed from '@/components/class/Feed/Feed'
import { Button } from '@/components/ui/button'
import { Copy, Lock } from 'lucide-react'

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
  // Add settings prop to receive the showClassCode boolean
  settings?: {
    showClassCode?: boolean;
  }
}

export default function StreamView({ 
  classId, 
  classCode, 
  isTeacher, 
  userId, 
  assignments = [],
  settings 
}: StreamViewProps) {
  const dueSoon = assignments.filter((a: Assignment) => new Date(a.dueDate) >= new Date())

  // Logic: Only hide if the setting is false AND the user is NOT a teacher
  const isCodeHidden = settings?.showClassCode === false && !isTeacher;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto py-8">
      {/* Sidebar */}
      <div className="lg:col-span-3 space-y-4">
        <SidebarCard title="Classroom Code">
          {isCodeHidden ? (
            /* HIDDEN STATE FOR STUDENTS */
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-400 italic">
                <Lock size={14} />
                <span className="text-sm font-medium">Code Disabled</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                The teacher has hidden the class code. Ask your instructor for the class code.
              </p>
            </div>
          ) : (
            /* VISIBLE STATE (Teachers see this always, Students see if enabled) */
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-[#4c6ef5] tracking-tight">
                {classCode}
              </span>
              <Button
                variant="ghost"
                onClick={() => navigator.clipboard.writeText(classCode)}
                className="text-blue-500 hover:bg-blue-50 h-9 w-9 p-0"
              >
                <Copy size={18} />
              </Button>
              {/* Optional: Add a small badge if the teacher has it hidden from others */}
              {isTeacher && settings?.showClassCode === false && (
                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase">
                  Hidden
                </span>
              )}
            </div>
          )}
        </SidebarCard>

        <SidebarCard title="Due Soon">
          {dueSoon.length === 0 ? (
            <p className="text-xs text-gray-400 italic">🎉 No due work</p>
          ) : (
            <ul className="space-y-1 text-xs text-gray-600 font-medium">
              {dueSoon.map((a: Assignment) => (
                <li key={a.id} className="flex justify-between">
                  <span>{a.title}</span>
                  <span className="text-gray-400">{new Date(a.dueDate).toLocaleDateString()}</span>
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