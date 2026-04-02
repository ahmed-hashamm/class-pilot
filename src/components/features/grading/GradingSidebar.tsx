"use client"

import { Sparkles, PenLine, CheckCircle2, Loader2 } from "lucide-react"
import { GradeCardMini } from "./GradeCardMini"
import { MethodButton } from "./MethodButton"
import AIGradingButton from "./AIGradingButton"
import ManualGradingForm from "./ManualGradingForm"

interface GradingSidebarProps {
  submission: any
  assignment: any
  hasAI: boolean
  hasManual: boolean
  isDraft: boolean
  isUpdating: boolean
  isPublishing: boolean
  gradingMode: "ai" | "manual" | null
  setGradingMode: (mode: "ai" | "manual" | null) => void
  handleSetFinalGrade: (type: "ai" | "manual") => void
  handlePublishAIGrade: () => void
  onGradingComplete: () => void
}

export function GradingSidebar({
  submission,
  assignment,
  hasAI,
  hasManual,
  isDraft,
  isUpdating,
  isPublishing,
  gradingMode,
  setGradingMode,
  handleSetFinalGrade,
  handlePublishAIGrade,
  onGradingComplete
}: GradingSidebarProps) {
  return (
    <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6 pb-20">
      <div className="flex flex-col gap-6">
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-navy/40 pl-1">Grading & Feedback</p>

        {/* Unified Grading List */}
        {(hasAI || hasManual) && (
          <div className="flex flex-col gap-2.5">
            {hasAI && (
              <GradeCardMini
                label="AI"
                score={submission.ai_grade!}
                feedback={submission.ai_feedback}
                total={assignment?.points}
                isActive={submission.final_grade === submission.ai_grade}
                onApply={() => handleSetFinalGrade("ai")}
                disabled={isUpdating}
              />
            )}
            {hasManual && (
              <GradeCardMini
                label="Manual"
                score={submission.manual_grade!}
                feedback={submission.teacher_feedback}
                total={assignment?.points}
                isActive={submission.final_grade === submission.manual_grade}
                onApply={() => handleSetFinalGrade("manual")}
                disabled={isUpdating}
              />
            )}
          </div>
        )}

        {/* Draft publish button */}
        {isDraft && (
          <button
            onClick={handlePublishAIGrade}
            disabled={isPublishing || isUpdating}
            className="w-full inline-flex items-center justify-center gap-2 font-black
              text-[14px] py-3 rounded-xl transition-all cursor-pointer border-none
              bg-yellow text-navy hover:bg-yellow/90 shadow-md hover:-translate-y-0.5
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle2 size={16} />
            )}
            Approve AI Grade
          </button>
        )}

        {/* Grading panel */}
        <div className="flex flex-col gap-3">
          {!gradingMode ? (
            <>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-navy/40 pl-1 mt-2">Select Method</p>
              <MethodButton
                icon={<Sparkles size={18} />}
                title="AI Evaluation"
                subtitle="Scan with rubric"
                variant="navy-light"
                onClick={() => setGradingMode("ai")}
              />
              <MethodButton
                icon={<PenLine size={18} />}
                title="Manual Grade"
                subtitle="Teacher feedback"
                variant="yellow"
                onClick={() => setGradingMode("manual")}
              />
            </>
          ) : (
            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/60">
                <span className="text-[11px] font-black uppercase tracking-widest text-navy">
                  {gradingMode === "ai" ? "AI Evaluation" : "Manual Grading"}
                </span>
                <button 
                  onClick={() => setGradingMode(null)} 
                  className="text-[12px] font-bold text-muted-foreground hover:text-navy transition cursor-pointer bg-transparent border-none"
                >
                  Cancel
                </button>
              </div>
              {gradingMode === "ai" ? (
                <AIGradingButton
                  submission={submission}
                  onGradingStart={() => {}}
                  onGradingComplete={onGradingComplete}
                />
              ) : (
                <ManualGradingForm
                  submission={submission}
                  rubric={assignment?.rubrics}
                  assignment={assignment}
                  onCancel={() => setGradingMode(null)}
                  onSuccess={onGradingComplete}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
