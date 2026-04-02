"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Award, MessageSquare, CheckCheck } from "lucide-react"
import { GradingSubmissionProps } from "./GradeSubmission"
import { RubricScoringList } from "./RubricScoringList"
import { updateManualGradeAction } from "@/actions/ClassFeaturesActions"

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

export default function ManualGradingForm({ submission, rubric, assignment, onCancel, onSuccess }: ManualGradingFormProps) {
  const router = useRouter()
  const [scores, setScores] = useState<Record<string, number>>({})
  const [overallGrade, setOverallGrade] = useState<string>("")
  const [feedback, setFeedback] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const criteria = (rubric?.criteria as any[]) || []

  const calculateTotal = () => {
    if (criteria.length > 0 && Object.keys(scores).length > 0) {
      return Object.values(scores).reduce((sum: number, val: number) => sum + val, 0)
    }
    return parseFloat(overallGrade) || 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const finalGradeValue = calculateTotal()
      const result = await updateManualGradeAction({
        submissionId: submission.id,
        score: finalGradeValue,
        feedback: feedback
      })

      if (result.error) throw new Error(result.error)
      
      router.refresh()
      onSuccess()
    } catch (err: unknown) {
      console.error("Save failed:", err)
      alert(`Save failed: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleScoreChange = (id: string, val: number) => {
    const newScores = { ...scores, [id]: val }
    setScores(newScores)
    const total = Object.values(newScores).reduce((s, v) => s + v, 0)
    setOverallGrade(total.toString())
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-8">
      {/* Rubric criteria */}
      <RubricScoringList 
        criteria={criteria} 
        scores={scores} 
        onScoreChange={handleScoreChange} 
      />

      {/* Final grade */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-[10px] font-bold tracking-[.2em] uppercase text-navy/40 pl-1">
          <Award size={12} /> Calculated Grade
        </label>
        <div className="relative group">
          <input
            type="number" 
            step="0.1"
            value={overallGrade}
            onChange={(e) => setOverallGrade(e.target.value)}
            className={`${inputClass} pr-20 font-black text-[24px] text-navy`}
            placeholder="0"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-baseline gap-1 pointer-events-none">
            <span className="text-[14px] font-black text-navy/30">/</span>
            <span className="text-[14px] font-black text-navy/30">
              {submission.assignments?.points ?? assignment?.points ?? "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-[10px] font-bold tracking-[.2em] uppercase text-navy/40 pl-1">
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
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Saving Grade…</>
          ) : (
            <><CheckCheck size={16} /> Confirm Evaluation</>
          )}
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
