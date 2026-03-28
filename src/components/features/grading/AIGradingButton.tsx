'use client'

import { useState } from 'react'
import { Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { GradingSubmissionProps } from './GradeSubmission'
import { ConfirmModal } from '@/components/ui'

interface AIGradingButtonProps {
  submission: GradingSubmissionProps
  onGradingStart: () => void
  onGradingComplete: () => void
}

export default function AIGradingButton({
  submission, onGradingStart, onGradingComplete,
}: AIGradingButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const alreadyGraded = submission.ai_grade !== null

  const handleAIGrading = async () => {
    setShowConfirm(false)

    setLoading(true); setError(null)
    onGradingStart()

    try {
      const res = await fetch(
        `/api/assignments/${submission.assignment_id}/grade/${submission.id}`,
        { method: 'POST' }
      )
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to grade submission')
      }
      onGradingComplete()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to grade submission')
      onGradingComplete()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Info card */}
      <div className="bg-navy/5 border border-navy/10 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-navy flex items-center justify-center shadow-inner">
            <Sparkles size={14} className="text-yellow" />
          </div>
          <p className="text-[12px] font-black uppercase tracking-wider text-navy">
            AI Rubric Scan
          </p>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed font-medium">
          The AI will analyze the submission against your rubric criteria
          and produce a suggested grade with detailed feedback.
        </p>
      </div>

      {/* CTA */}
      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleAIGrading}
        title="Start AI grading?"
        message="This will analyze the submission against the rubric criteria and produce a suggested grade. This may take a few seconds."
        confirmLabel="Start Grading"
        variant="info"
        isLoading={loading}
      />

      <button
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2
          bg-navy text-white font-black text-[14px] py-3.5 rounded-xl
          hover:bg-navy/90 transition shadow-md hover:-translate-y-0.5
          disabled:opacity-60 disabled:translate-y-0 cursor-pointer border-none">
        {loading ? (
          <><Loader2 size={16} className="animate-spin" /> Analyzing Submission…</>
        ) : alreadyGraded ? (
          <><RefreshCw size={16} /> Re-run AI Grading</>
        ) : (
          <><Sparkles size={16} /> Start AI Evaluation</>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-100
          text-red-600 text-[13px] font-bold px-4 py-3 rounded-xl animate-in shake duration-300">
          <AlertCircle size={15} /> {error}
        </div>
      )}
    </div>
  )
}
