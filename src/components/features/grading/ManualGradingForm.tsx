'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Award, MessageSquare, CheckCheck } from 'lucide-react'
import { GradingSubmissionProps } from './GradeSubmission'

const inputClass = `w-full bg-white border border-border rounded-xl px-4 py-3
  text-[14px] text-foreground placeholder:text-muted-foreground font-medium
  focus:outline-none focus:ring-4 focus:ring-navy/5 focus:border-navy transition-all shadow-sm`

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
  const [overallGrade, setOverallGrade] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-8">

      {/* Rubric criteria */}
      {criteria.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-bold tracking-[.2em] uppercase text-navy/40 pl-1">
            Rubric Criteria
          </p>
          <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar pr-0.5">
              {criteria.map((c, i) => (
                <div key={c.id}
                  className={`flex items-center gap-4 px-5 py-4
                     hover:bg-navy/[0.02] transition-colors
                    ${i < criteria.length - 1 ? 'border-b border-border/60' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-black text-foreground">{c.name}</p>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Max {c.points} pts</p>
                  </div>
                  <div className="relative">
                    <input
                      type="number" step="0.1" max={c.points} placeholder="0"
                      className="w-20 bg-secondary/50 border border-border rounded-xl px-3 py-2.5
                        text-[14px] font-black text-center text-navy
                        focus:outline-none focus:ring-4 focus:ring-navy/5 focus:border-navy transition-all"
                      onChange={(e) => {
                        const rawVal = parseFloat(e.target.value) || 0
                        const val = Math.min(Math.max(0, rawVal), c.points)
                        
                        // Force update the input value in case they typed more than max
                        if (rawVal > c.points) e.target.value = c.points.toString()
                        if (rawVal < 0) e.target.value = "0"

                        const newScores = { ...scores, [c.id]: val }
                        setScores(newScores)
                        const total = (Object.values(newScores) as number[]).reduce((s, v) => s + v, 0)
                        setOverallGrade(total.toString())
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Final grade */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-[10px] font-bold
          tracking-[.2em] uppercase text-navy/40 pl-1">
          <Award size={12} /> Calculated Grade
        </label>
        <div className="relative group">
          <input
            type="number" step="0.1"
            value={overallGrade}
            onChange={(e) => setOverallGrade(e.target.value)}
            className={`${inputClass} pr-20 font-black text-[24px] text-navy`}
            placeholder="0"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-baseline gap-1 pointer-events-none">
            <span className="text-[14px] font-black text-navy/30">/</span>
            <span className="text-[14px] font-black text-navy/30">
              {submission.assignments?.points ?? assignment?.points ?? '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-[10px] font-bold
          tracking-[.2em] uppercase text-navy/40 pl-1">
          <MessageSquare size={12} /> Instructor Feedback
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Add comments for the student…"
          rows={5}
          className={`${inputClass} resize-none leading-relaxed`}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || !overallGrade || !feedback.trim()}
          className="w-full inline-flex items-center justify-center gap-2
            bg-navy text-white font-black text-[14px] py-3.5 rounded-xl
            hover:bg-navy/90 transition shadow-md hover:-translate-y-0.5
            disabled:opacity-60 disabled:translate-y-0 disabled:cursor-not-allowed cursor-pointer border-none">
          {loading
            ? <><Loader2 size={16} className="animate-spin" /> Saving Grade…</>
            : <><CheckCheck size={16} /> Confirm Evaluation</>
          }
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full py-3 font-bold text-[13px] text-muted-foreground uppercase tracking-widest
            border border-border/60 rounded-xl hover:text-navy hover:border-navy/20
            hover:bg-navy/5 transition cursor-pointer bg-white">
          Discard Changes
        </button>
      </div>
    </form>
  )
}
