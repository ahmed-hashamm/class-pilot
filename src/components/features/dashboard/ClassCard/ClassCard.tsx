'use client'

import { useState } from 'react'
import { toggleClassPinAction, leaveClassAction, deleteClass } from '@/actions/ClassActions'
import { ConfirmModal } from '@/components/ui'
import { ClassCardHeader } from './ClassCardHeader'
import { ClassCardAssignments } from './ClassCardAssignments'
import { ClassCardFooter } from './ClassCardFooter'

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

      <div className={`group relative flex flex-col bg-white border border-border rounded-2xl
      overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
      ${(isLeaving || isDeleting) ? 'opacity-50 pointer-events-none' : ''}`}>

        {/* ── Top colour stripe — navy for teacher, navy-light for student ── */}
        <div className={`h-1.5 w-full shrink-0 ${isTeacher ? 'bg-navy' : 'bg-navy-light'}`} />

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
      </div>
    </>
  )
}
