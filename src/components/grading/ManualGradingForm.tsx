'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Award, MessageSquare, CheckCheck } from 'lucide-react'
import { GradingSubmissionProps } from './GradeSubmission'

const inputClass = `w-full bg-white border border-border rounded-xl px-4 py-3
  text-[14px] text-foreground placeholder:text-muted-foreground
  focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition`

interface ManualGradingFormProps {
  submission: GradingSubmissionProps;
  rubric: any;
  assignment: any;
  onCancel: () => void;
  onSuccess: () => void;
}

interface RubricCriterion {
  id: string;
  name: string;
  points: number;
}

export default function ManualGradingForm({ submission, rubric, assignment, onCancel, onSuccess }: ManualGradingFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [scores, setScores] = useState<Record<string, number>>({})
  const [overallGrade, setOverallGrade] = useState<string>(submission.final_grade?.toString() ?? submission.ai_grade?.toString() ?? '')
  const [feedback, setFeedback] = useState<string>(submission.teacher_feedback || '')
  const [loading, setLoading] = useState(false)

  const criteria: RubricCriterion[] = (rubric?.criteria as RubricCriterion[]) || []

  const calculateTotal = () => {
    if (criteria.length > 0 && Object.keys(scores).length > 0) {
      return Object.values(scores).reduce((sum: number, val: number) => sum + val, 0)
    }
    return parseFloat(overallGrade.toString()) || 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const finalGradeValue = calculateTotal()
      const { error, data } = await (supabase as any)
        .from('submissions')
        .update({
          manual_grade: finalGradeValue,
          final_grade: finalGradeValue,
          status: 'graded',
          teacher_feedback: feedback,
        })
        .eq('id', submission.id)
        .select()

      if (error) throw error
      if (!data || data.length === 0) console.warn('No rows updated.')

      router.refresh()
      onSuccess()
    } catch (err: unknown) {
      console.error('Supabase Update Error:', err)
      alert(`Save failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Rubric criteria */}
      {criteria.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">
            Rubric criteria
          </p>
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            {criteria.map((c, i) => (
              <div key={c.id}
                className={`flex items-center gap-4 px-4 py-3
                  ${i < criteria.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-foreground truncate">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">Max {c.points} pts</p>
                </div>
                <input
                  type="number" step="0.1" max={c.points} placeholder="0"
                  className="w-20 bg-secondary border border-border rounded-lg px-3 py-2
                    text-[14px] font-bold text-center text-foreground
                    focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition"
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0
                    const newScores = { ...scores, [c.id]: val }
                    setScores(newScores)
                    const total = (Object.values(newScores) as number[]).reduce((s, v) => s + v, 0)
                    setOverallGrade(total.toString())
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final grade */}
      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-1.5 text-[11px] font-bold
          tracking-[.18em] uppercase text-navy">
          <Award size={11} /> Final grade
        </label>
        <div className="relative">
          <input
            type="number" step="0.1"
            value={overallGrade}
            onChange={(e) => setOverallGrade(e.target.value)}
            className={`${inputClass} pr-20 font-black text-[20px]`}
            placeholder="0"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px]
            font-bold text-muted-foreground pointer-events-none">
            / {submission.assignments?.points ?? assignment?.points ?? '—'}
          </span>
        </div>
      </div>

      {/* Feedback */}
      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-1.5 text-[11px] font-bold
          tracking-[.18em] uppercase text-navy">
          <MessageSquare size={11} /> Feedback
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Add comments for the student…"
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center gap-2
            bg-navy text-white font-bold text-[14px] py-3 rounded-xl
            hover:bg-navy/90 transition disabled:opacity-60 cursor-pointer border-none">
          {loading
            ? <><Loader2 size={15} className="animate-spin" />Saving…</>
            : <><CheckCheck size={15} />Confirm grade</>
          }
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 font-semibold text-[14px] text-muted-foreground
            border border-border rounded-xl hover:text-foreground hover:border-navy/30
            transition cursor-pointer bg-white">
          Cancel
        </button>
      </div>
    </form>
  )
}
