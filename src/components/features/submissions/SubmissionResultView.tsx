'use client'

import { 
  CheckCircle2, Award, 
  MessageSquare, FileText, Users
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { FeatureButton } from '@/components/ui'

interface SubmissionResultViewProps {
  submissionData: any
  assignment: any
  onEdit: () => void
  onClose: () => void
}

/**
 * Handles the UI for when a submission has already been received or graded.
 * Displays grades, feedback, and success prompts.
 */
export function SubmissionResultView({ 
  submissionData, 
  assignment, 
  onEdit, 
  onClose 
}: SubmissionResultViewProps) {
  const isGraded = submissionData.status === 'graded' || submissionData.final_grade !== null

  return (
    <div className="w-full">
      {/* Header Banner */}
      <div className={cn(
        "flex items-center justify-between px-8 py-5 text-white shadow-md transition-colors",
        isGraded ? "bg-navy" : "bg-green-600"
      )}>
        <div className="flex items-center gap-3">
          <CheckCircle2 size={20} className={cn(isGraded ? "text-yellow" : "text-white")} />
          <span className="font-black text-[14px] uppercase tracking-[0.1em]">
            {isGraded ? 'Assessment Finalized' : 'Submission Received'}
          </span>
        </div>
        {assignment.is_group_project && (
          <span className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest backdrop-blur-sm border border-white/10">
            <Users size={12} /> Group Work
          </span>
        )}
      </div>

      <div className="p-10 flex flex-col items-center gap-8 text-center bg-white">
        {isGraded ? (
          <>
            {/* Grade Display */}
            <div className="bg-navy rounded-3xl px-12 py-8 flex flex-col items-center gap-2 shadow-xl ring-8 ring-secondary/20">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Grade Earned</p>
              <div className="flex items-baseline gap-1">
                <span className="font-black text-[64px] text-yellow leading-none tracking-tighter">
                  {submissionData.final_grade}
                </span>
                <span className="text-[24px] text-white/30 font-bold">/{assignment.points}</span>
              </div>
            </div>

            {/* Instructor Feedback */}
            {submissionData.feedback && (
              <div className="w-full bg-secondary/50 border border-border rounded-2xl p-6 text-left relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-navy/20 group-hover:bg-navy transition-colors" />
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare size={14} className="text-navy" />
                  <p className="text-[11px] font-black uppercase tracking-[0.15em] text-navy">Instructor Feedback</p>
                </div>
                <p className="text-[14px] text-navy/80 font-medium leading-relaxed italic">
                  "{submissionData.feedback}"
                </p>
              </div>
            )}
          </>
        ) : (
          /* Submission Confirmation View */
          <div className="space-y-6">
            <div className="size-20 rounded-3xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto shadow-inner">
              <FileText size={32} className="text-green-600" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="font-black text-[22px] tracking-tight text-navy">Well done!</h3>
              <p className="text-[14px] text-muted-foreground mt-3 font-medium leading-relaxed uppercase tracking-wide">
                Your work is safely submitted. Your teacher will evaluate it according to the class guidelines.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          {!isGraded && (
            <FeatureButton 
              label="Edit Submission"
              variant="primary"
              onClick={onEdit}
              className="flex-1"
            />
          )}
          <FeatureButton 
            label="Close"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  )
}
