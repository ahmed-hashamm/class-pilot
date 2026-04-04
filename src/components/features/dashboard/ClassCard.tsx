

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Plus, MoreVertical, Users, Eye, LogOut, Pin, PinOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format, isAfter, startOfDay } from 'date-fns'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ConfirmModal } from '@/components/ui'

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
  const [imgError, setImgError] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [isPinned, setIsPinned] = useState(initialIsPinned)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
  const [isPinning, setIsPinning] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const isTeacher = role.toLowerCase() === 'teacher'
  const teacher = classData?.owner_profile
  const teacherName = teacher?.full_name || 'Teacher'

  // Filter for upcoming assignments only (due date is null or in the future)
  const upcomingAssignments = (assignments || []).filter((a: any) => {
    if (!a.due_date) return true;
    // Include if due today or in the future
    return isAfter(new Date(a.due_date), startOfDay(new Date())) || 
           format(new Date(a.due_date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  }).slice(0, 3); // Limit to top 3

  /* ── Pin toggle ── */
  const togglePin = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isPinning) return
    setIsPinning(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('class_members')
        .update({ is_pinned: !isPinned } as never)
        .eq('class_id', classId)
        .eq('user_id', user.id)
      if (error) throw error
      setIsPinned(!isPinned)
      router.refresh()
    } catch (err) {
      console.error('Pinning error:', err)
    } finally {
      setIsPinning(false)
    }
  }

  /* ── Leave class ── */
  const handleLeaveClass = async () => {
    setShowLeaveConfirm(false)
    setIsLeaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('class_members')
        .delete()
        .eq('class_id', classId)
        .eq('user_id', user.id)
      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error('Error leaving class:', error)
      alert('Failed to leave class.')
    } finally {
      setIsLeaving(false)
    }
  }

  return (
    <>
      <ConfirmModal
        isOpen={showLeaveConfirm}
        onClose={() => setShowLeaveConfirm(false)}
        onConfirm={handleLeaveClass}
        title="Leave this class?"
        message="You will lose access to all materials and assignments in this classroom."
        confirmLabel="Leave Class"
        variant="danger"
        isLoading={isLeaving}
      />
      <div className={`group relative flex flex-col bg-white border border-border rounded-2xl
      overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
      ${isLeaving ? 'opacity-50 pointer-events-none' : ''}`}>

        {/* ── Top colour stripe — navy for teacher, navy-light for student ── */}
        <div className={`h-1.5 w-full shrink-0 ${isTeacher ? 'bg-navy' : 'bg-navy-light'}`} />

        <div className="flex flex-col flex-1 p-5">

          {/* ── Header ── */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0 pr-1">
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
              bg-secondary flex items-center justify-center relative shadow-sm">
              {teacher?.avatar_url && !imgError ? (
                <Image
                  src={teacher.avatar_url}
                  alt={teacherName}
                  fill
                  className="object-cover"
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

          {/* ── Assignments list (Upcoming only) ── */}
          <div className="flex flex-col gap-1.5 flex-1 mb-5">
            {upcomingAssignments.length > 0 ? (
              upcomingAssignments.map((a: any) => (
                <div key={a.id}
                  className="flex items-center justify-between gap-2 px-3 py-2
                    bg-secondary/50 rounded-lg border border-border/40 hover:border-border/80 transition-colors">
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
              <p className="text-[12px] text-muted-foreground italic py-1 pl-1">
                No upcoming deadlines
              </p>
            )}
          </div>

          {/* ── Footer actions ── */}
          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            <div className="flex gap-1 items-center">
              <Link href={`/classes/${classId}`}
                title="Open Classroom"
                className="p-2 rounded-lg text-muted-foreground hover:text-navy
                  hover:bg-navy/8 transition-colors">
                <Eye size={16} />
              </Link>
              {isTeacher && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/classes/${classId}/assignments/create`)}
                  title="Create Assignment"
                  className="p-2 h-auto text-muted-foreground hover:text-navy hover:bg-navy/8 rounded-lg"
                >
                  <Plus size={16} />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePin}
                disabled={isPinning}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 h-auto text-[12px] font-bold tracking-tight rounded-lg transition-all duration-200",
                  isPinned 
                    ? "text-navy bg-navy/8 hover:bg-navy/12" 
                    : "text-muted-foreground hover:text-navy hover:bg-navy/8",
                  isPinning && "opacity-50 cursor-wait"
                )}
              >
                {isPinned ? <Pin size={13} fill="currentColor" /> : <Pin size={13} />}
                <span>{isPinned ? 'Unpin' : 'Pin'} class</span>
              </Button>

              {!isTeacher && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLeaveConfirm(true)}
                  title="Leave Class"
                  className="p-2 h-auto text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <LogOut size={16} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
