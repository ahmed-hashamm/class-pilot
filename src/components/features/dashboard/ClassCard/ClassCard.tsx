'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toggleClassPinAction, leaveClassAction, deleteClass } from '@/actions/ClassActions'
import { ConfirmModal } from '@/components/ui'
import { ClassCardHeader } from './ClassCardHeader'
import { ClassCardAssignments } from './ClassCardAssignments'
import { ClassCardFooter } from './ClassCardFooter'

/**
 * The main container for a class in the dashboard grid.
 * 
 * Responsibilities:
 * - Displays high-level class metadata (name, teacher, student count).
 * - Previews upcoming assignments.
 * - Manages class-level actions (pinning, leaving, deleting) via server actions.
 * - Handles deletion and leaving confirmation workflows.
 */
interface ClassCardProps {
  /** unique identifier for the class */
  classId: string
  /** object containing basic class info and owner profile */
  classData: {
    name: string
    owner_profile: {
      full_name: string
      avatar_url: string | null
    }
  }
  /** the current user's role in this class (e.g., 'Teacher', 'Student') */
  role: string
  /** number of students currently enrolled */
  studentCount: number
  /** list of assignment objects for previewing deadlines */
  assignments: any[]
  /** whether the class is currently pinned to the user's dashboard */
  isPinned: boolean
}

export default function ClassCard({
  classId,
  classData,
  role,
  studentCount,
  assignments,
  isPinned: initialIsPinned,
}: ClassCardProps) {
  const [isLeaving, setIsLeaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPinned, setIsPinned] = useState(initialIsPinned)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isPinning, setIsPinning] = useState(false)

  const isTeacher = role.toLowerCase() === 'teacher'

  /* ── Pin toggle ── */
  const togglePin = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isPinning) return
    setIsPinning(true)
    try {
      const result = await toggleClassPinAction({ classId, pinned: !isPinned })
      if (result.error) throw new Error(result.error)
      setIsPinned(!isPinned)
    } catch (err: any) {
      alert(err.message || 'Failed to toggle pin')
    } finally {
      setIsPinning(false)
    }
  }

  /* ── Leave class ── */
  const handleLeaveClass = async () => {
    setShowLeaveConfirm(false)
    setIsLeaving(true)
    try {
      const result = await leaveClassAction(classId)
      if (result.error) throw new Error(result.error)
    } catch (err: any) {
      alert(err.message || 'Failed to leave class.')
    } finally {
      setIsLeaving(false)
    }
  }

  /* ── Delete class ── */
  const handleDeleteClass = async () => {
    setShowDeleteConfirm(false)
    setIsDeleting(true)
    try {
      const result = await deleteClass(classId)
      if (result.error) throw new Error(result.error)
    } catch (err: any) {
      alert(err.message || 'Failed to delete class.')
    } finally {
      setIsDeleting(false)
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

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteClass}
        title="Delete this class?"
        message="All announcements, materials, assignments, and student submissions will be permanently deleted. This action cannot be undone."
        confirmLabel="Delete Permanently"
        variant="danger"
        isLoading={isDeleting}
      />

      <motion.div 
        whileTap={{ scale: 0.985 }}
        transition={{ duration: 0.1 }}
        className={`group relative flex flex-col h-full bg-navy/5 md:hover:bg-white border border-border rounded-xl
        overflow-hidden md:transition-all md:duration-300 transition-colors duration-200 md:hover:shadow-md md:hover:-translate-y-0.5 border-b-4 ${isTeacher ? 'border-b-navy/90' : 'border-b-navy-light/90'} [transform:translateZ(0)]
        ${(isLeaving || isDeleting) ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {/* Top glow on hover - Desktop only */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-navy/50 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex flex-col flex-1 p-5">
          <ClassCardHeader
            classId={classId}
            name={classData?.name}
            role={role}
            studentCount={studentCount}
            teacher={classData?.owner_profile}
          />

          <ClassCardAssignments
            assignments={assignments}
          />

          <ClassCardFooter
            classId={classId}
            isTeacher={isTeacher}
            isPinned={isPinned}
            isPinning={isPinning}
            onTogglePin={togglePin}
            onDelete={() => setShowDeleteConfirm(true)}
            onLeave={() => setShowLeaveConfirm(true)}
          />
        </div>
      </motion.div>
    </>
  )
}
