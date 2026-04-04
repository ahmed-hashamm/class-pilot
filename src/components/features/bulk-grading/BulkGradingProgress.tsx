'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SubmissionGradingState } from './BulkGradingHeader'

interface BulkGradingProgressProps {
  gradingStates: SubmissionGradingState[]
  isExpanded: boolean
}

export default function BulkGradingProgress({
  gradingStates,
  isExpanded: initialExpanded,
}: BulkGradingProgressProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded)

  useEffect(() => {
    setIsExpanded(initialExpanded)
  }, [initialExpanded])

  const pendingCount = gradingStates.filter((s) => s.status === 'pending').length
  const gradingCount = gradingStates.filter((s) => s.status === 'grading').length
  const doneCount = gradingStates.filter((s) => s.status === 'done').length
  const failedCount = gradingStates.filter((s) => s.status === 'failed').length

  const isComplete = pendingCount === 0 && gradingCount === 0

  if (!isExpanded && !isComplete) return null

  const getStatusIcon = (status: SubmissionGradingState['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={14} className="text-muted-foreground" />
      case 'grading':
        return <Loader2 size={14} className="text-navy animate-spin" />
      case 'done':
        return <CheckCircle2 size={14} className="text-green-600" />
      case 'failed':
        return <XCircle size={14} className="text-red-500" />
    }
  }

  const getStatusText = (status: SubmissionGradingState['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'grading':
        return 'Grading...'
      case 'done':
        return 'Completed'
      case 'failed':
        return 'Failed'
    }
  }

  return (
    <div className="border-b border-border bg-secondary/20">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 text-[11px] font-bold">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock size={12} />
              {pendingCount} pending
            </span>
            <span className="flex items-center gap-1.5 text-navy">
              <Loader2 size={12} className="animate-spin" />
              {gradingCount} grading
            </span>
            <span className="flex items-center gap-1.5 text-green-600">
              <CheckCircle2 size={12} />
              {doneCount} done
            </span>
            {failedCount > 0 && (
              <span className="flex items-center gap-1.5 text-red-500">
                <XCircle size={12} />
                {failedCount} failed
              </span>
            )}
          </div>
          {isComplete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[11px] font-bold text-muted-foreground hover:text-navy transition-colors h-auto p-0"
            >
              {isExpanded ? 'Hide' : 'Show'} details
            </Button>
          )}
        </div>

        {isExpanded && (
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
            {gradingStates.map((state) => (
              <div
                key={state.submissionId}
                className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-border/50"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {getStatusIcon(state.status)}
                  <span className="text-[12px] font-medium text-foreground truncate">
                    {state.studentName}
                  </span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  state.status === 'done' ? 'text-green-600' :
                  state.status === 'failed' ? 'text-red-500' :
                  state.status === 'grading' ? 'text-navy' :
                  'text-muted-foreground'
                }`}>
                  {getStatusText(state.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
