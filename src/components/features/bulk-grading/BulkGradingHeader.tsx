'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { ConfirmModal } from '@/components/ui/ConfirmModal'

export type BulkGradingStatus = 'idle' | 'processing' | 'completed' | 'error'

export interface SubmissionGradingState {
  submissionId: string
  studentName: string
  status: 'pending' | 'grading' | 'done' | 'failed'
  error?: string
}

interface BulkGradingHeaderProps {
  assignmentId: string
  submissionCount: number
  gradingStates: SubmissionGradingState[]
  onStartBulkGrading: (submissionIds: string[]) => Promise<void>
  onCancel: () => void
}

export default function BulkGradingHeader({
  assignmentId,
  submissionCount,
  gradingStates,
  onStartBulkGrading,
  onCancel,
}: BulkGradingHeaderProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const pendingCount = gradingStates.filter((s) => s.status === 'pending').length
  const gradingCount = gradingStates.filter((s) => s.status === 'grading').length
  const doneCount = gradingStates.filter((s) => s.status === 'done').length
  const failedCount = gradingStates.filter((s) => s.status === 'failed').length

  const isActive = pendingCount > 0 || gradingCount > 0
  const progress = doneCount + failedCount
  const total = gradingStates.length

  const handleStartGrading = async () => {
    setShowConfirm(false)
    setIsProcessing(true)
    setIsExpanded(true)
    try {
      const submissionIds = gradingStates
        .filter((s) => s.status === 'pending')
        .map((s) => s.submissionId)
      await onStartBulkGrading(submissionIds)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isActive && progress === 0) {
    return (
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-white">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-navy-light/10 flex items-center justify-center">
            <Sparkles size={18} className="text-navy-light" />
          </div>
          <div>
            <p className="font-black text-[14px] text-foreground">AI Bulk Grading</p>
            <p className="text-[11px] text-muted-foreground">
              {submissionCount} submission{submissionCount !== 1 ? 's' : ''} to grade
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          disabled={submissionCount === 0 || isProcessing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-light text-white font-bold text-[13px] transition-all hover:bg-navy-light/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border-none cursor-pointer"
        >
          {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          Grade All with AI
        </button>

        <ConfirmModal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleStartGrading}
          title="Start Bulk AI Grading?"
          message={`This will analyze ${submissionCount} submission${submissionCount !== 1 ? 's' : ''} using your rubric. This may take a minute depending on the volume.`}
          confirmLabel="Start Grading"
          cancelLabel="Cancel"
          variant="info"
          isLoading={isProcessing}
        />
      </div>
    )
  }

  return (
    <div className="border-b border-border bg-white">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`size-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-yellow/20' : 'bg-green-100'}`}>
            {isActive ? (
              <Loader2 size={18} className="text-navy animate-spin" />
            ) : (
              <Sparkles size={18} className="text-green-600" />
            )}
          </div>
          <div>
            <p className="font-black text-[14px] text-foreground">
              {isActive ? 'Grading in Progress' : 'Bulk Grading Complete'}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {isActive
                ? `${gradingCount} of ${total} being graded...`
                : `${doneCount} completed, ${failedCount} failed`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isActive ? (
            <button
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl border border-border text-muted-foreground font-bold text-[13px] hover:bg-secondary transition-all"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-4 py-2.5 rounded-xl bg-navy text-white font-bold text-[13px] hover:bg-navy/90 transition-all"
            >
              {isExpanded ? 'Hide Details' : 'View Results'}
            </button>
          )}
        </div>
      </div>

      {isActive && (
        <div className="px-4 sm:px-6 pb-4">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-navy-light transition-all duration-300"
              style={{ width: `${total > 0 ? (doneCount / total) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            <span>{pendingCount} pending</span>
            <span>{gradingCount} grading</span>
            <span>{doneCount} done</span>
            <span>{failedCount} failed</span>
          </div>
        </div>
      )}
    </div>
  )
}
