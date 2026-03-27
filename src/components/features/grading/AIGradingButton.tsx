'use client'

import { useState } from 'react'
import { Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { GradingSubmissionProps } from './GradeSubmission'

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

  const alreadyGraded = submission.ai_grade !== null

  const handleAIGrading = async () => {
    if (!confirm('Start AI grading? This will analyze the submission against the rubric.')) return

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
      <div className="bg-navy/5 border border-navy/12 rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-navy flex items-center justify-center">
            <Sparkles size={13} className="text-yellow" />
          </div>
          <p className="text-[12px] font-bold uppercase tracking-widest text-navy">
            AI evaluation
          </p>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The AI will analyze the submission text and files against your specific rubric criteria
          and produce a suggested grade with feedback.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={handleAIGrading}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2
          bg-navy text-white font-bold text-[14px] py-3 rounded-xl
          hover:bg-navy/90 transition disabled:opacity-60 cursor-pointer border-none">
        {loading ? (
          <><Loader2 size={15} className="animate-spin" />Analyzing…</>
        ) : alreadyGraded ? (
          <><RefreshCw size={15} />Re-run AI grade</>
        ) : (
          <><Sparkles size={15} />Start AI grading</>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200
          text-red-600 text-[13px] font-semibold px-4 py-3 rounded-xl">
          <AlertCircle size={14} /> {error}
        </div>
      )}
    </div>
  )
}
