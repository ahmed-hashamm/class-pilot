"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, ClipboardList, Sparkles,
  PenLine, CheckCircle2, Loader2,
  Layout, FileText,
} from "lucide-react"
import { format } from "date-fns"
import { createClient } from "@/lib/supabase/client"
import AttachmentButton from "@/components/features/classes/buttons/AttachmentButton"
import AIGradingButton from "./AIGradingButton"
import ManualGradingForm from "./ManualGradingForm"
import { publishAIGrade } from "@/actions/ClassFeaturesActions"

export interface GradingSubmissionProps {
  id: string
  assignment_id: string
  content: string | null
  files: { name: string; url: string }[] | null
  final_grade: number | null
  ai_grade: number | null
  manual_grade: number | null
  ai_feedback: string | null
  teacher_feedback: string | null
  status: string
  submitted_at: string | null
  users: { full_name: string; avatar_url: string | null } | null
  assignments: { title: string; points: number; rubrics?: Record<string, unknown> } | null
}

export default function GradeSubmission({
  submission, classId,
}: {
  submission: GradingSubmissionProps
  classId: string
}) {
  const [gradingMode, setGradingMode] = useState<"ai" | "manual" | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isAiProcessing, setIsAiProcessing] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [viewMode, setViewMode] = useState<"single" | "side-by-side">("side-by-side")
  const router = useRouter()
  const supabase = createClient()

  const assignment = submission.assignments
  const student = submission.users
  const files = submission.files || []

  const hasAI = submission.ai_grade !== null
  const hasManual = submission.manual_grade !== null
  const isDraft = hasAI && submission.final_grade === null

  const handleSetFinalGrade = async (type: "ai" | "manual") => {
    setIsUpdating(true)
    const score = type === "ai" ? submission.ai_grade : submission.manual_grade
    try {
      const { error } = await (supabase as any)
        .from("submissions")
        .update({ final_grade: score, updated_at: new Date().toISOString() })
        .eq("id", submission.id)
      if (error) throw error
      router.refresh()
    } catch (err) {
      console.error("Update failed:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePublishAIGrade = async () => {
    setIsPublishing(true)
    try {
      const result = await publishAIGrade(submission.id)
      if (result.success) {
        router.refresh()
      } else {
        console.error("Failed to publish AI grade:", result.error)
      }
    } catch (err) {
      console.error("Error publishing AI grade:", err)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 flex flex-col gap-6 h-full lg:max-h-screen lg:overflow-hidden">

      {/* Top bar */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 border-b sm:border-none pb-4 sm:pb-0">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold
            text-navy/60 hover:text-navy transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Back to Class
        </button>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {isDraft && (
            <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-black
              uppercase tracking-wider rounded-full px-4 py-1.5 border
              bg-yellow text-navy border-yellow/30 animate-pulse">
              <FileText size={13} />
              <span className="truncate">Draft</span>
            </span>
          )}
          {submission.final_grade !== null && (
            <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-black
              uppercase tracking-wider rounded-full px-4 py-1.5 border
              bg-navy text-white border-navy">
              <CheckCircle2 size={13} />
              <span className="truncate">Grade: {submission.final_grade} / {assignment?.points}</span>
            </span>
          )}
          <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-black
            uppercase tracking-wider rounded-full px-4 py-1.5 border
            bg-navy/5 text-navy border-navy/10">
            <Layout size={13} /> Grading View
          </span>
        </div>
      </div>

      {/* View Mode Toggle */}
      {hasAI && hasManual && (
        <div className="flex items-center gap-2 px-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">View:</span>
          <button
            onClick={() => setViewMode("side-by-side")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
              viewMode === "side-by-side"
                ? "bg-navy text-white"
                : "bg-secondary text-muted-foreground hover:bg-navy/10"
            }`}
          >
            Side by Side
          </button>
          <button
            onClick={() => setViewMode("single")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
              viewMode === "single"
                ? "bg-navy text-white"
                : "bg-secondary text-muted-foreground hover:bg-navy/10"
            }`}
          >
            Single
          </button>
        </div>
      )}

      {/* Main Content Areas */}
      <div className="w-full flex flex-col lg:flex-row gap-8 items-start flex-1 min-h-0 lg:overflow-hidden">

        {/* Left — Submission Content */}
        <div className="w-full lg:flex-1 flex flex-col gap-6 lg:overflow-y-auto lg:custom-scrollbar lg:pr-2 min-w-0">

          {/* Simple Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="shrink-0 size-12 rounded-2xl bg-navy flex items-center justify-center text-yellow shadow-sm font-black text-lg">
                {student?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-black text-[24px] tracking-tight leading-tight text-foreground break-words">{student?.full_name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-[13px] text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5 min-w-0"><ClipboardList size={13} className="text-navy/60 shrink-0" /><span className="truncate">{assignment?.title}</span></span>
                  <span className="hidden sm:inline text-border">·</span>
                  <span className="truncate">Submitted {submission.submitted_at ? format(new Date(submission.submitted_at), "MMM d, h:mm a") : "Recently"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Response area */}
          <div className="flex flex-col gap-2.5 w-full min-w-0 overflow-hidden">
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-navy/40 pl-1">Response</p>
            <div className="bg-white border border-border rounded-2xl p-4 sm:p-6 shadow-sm w-full min-w-0 overflow-hidden">
              <p className="whitespace-pre-wrap break-words text-[14px] leading-relaxed text-foreground/80 w-full overflow-hidden">
                {submission.content || "No text content."}
              </p>
            </div>
          </div>

          {/* Files */}
          {files.length > 0 && (
            <div className="flex flex-col gap-2.5 w-full min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-navy/40 pl-1">Attachments</p>
              <div className="flex flex-col gap-2 w-full min-w-0">
                {files.map((file, i: number) => (
                  <AttachmentButton key={i} path={file.url} type="assignment" label={file.name} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pt-1">

          <div className="flex flex-col gap-6">
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-navy/40 pl-1">Grading & Feedback</p>

            {/* Side-by-side view for AI and Manual grades */}
            {viewMode === "side-by-side" && hasAI && hasManual && (
              <div className="grid grid-cols-2 gap-3">
                <GradeCardMini
                  label="AI"
                  score={submission.ai_grade!}
                  isActive={submission.final_grade === submission.ai_grade}
                  onApply={() => handleSetFinalGrade("ai")}
                  disabled={isUpdating}
                />
                <GradeCardMini
                  label="Manual"
                  score={submission.manual_grade!}
                  isActive={submission.final_grade === submission.manual_grade}
                  onApply={() => handleSetFinalGrade("manual")}
                  disabled={isUpdating}
                />
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

            {/* Assessment results */}
            {viewMode !== "side-by-side" && (submission.ai_grade !== null || submission.manual_grade !== null) && (
              <div className="flex flex-col gap-3">
                {submission.ai_grade !== null && (
                  <GradeCard
                    label="AI suggested"
                    icon={<Sparkles size={12} />}
                    score={submission.ai_grade}
                    feedback={submission.ai_feedback}
                    total={assignment?.points}
                    isActive={submission.final_grade === submission.ai_grade}
                    variant="navy-light"
                    onApply={() => handleSetFinalGrade("ai")}
                    disabled={isUpdating}
                  />
                )}

                {submission.manual_grade !== null && (
                  <GradeCard
                    label="Manual grade"
                    icon={<PenLine size={12} />}
                    score={submission.manual_grade}
                    feedback={submission.teacher_feedback}
                    total={assignment?.points}
                    isActive={submission.final_grade === submission.manual_grade}
                    variant="yellow"
                    onApply={() => handleSetFinalGrade("manual")}
                    disabled={isUpdating}
                  />
                )}
              </div>
            )}

            {/* Grading panel */}
            <div className="flex flex-col gap-3">
              {!gradingMode ? (
                <>
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
                    <button onClick={() => setGradingMode(null)} className="text-[12px] font-bold text-muted-foreground hover:text-navy transition cursor-pointer bg-transparent border-none">Cancel</button>
                  </div>
                  {gradingMode === "ai" ? (
                    <AIGradingButton
                      submission={submission}
                      onGradingStart={() => setIsAiProcessing(true)}
                      onGradingComplete={() => { setIsAiProcessing(false); setGradingMode(null); router.refresh(); }}
                    />
                  ) : (
                    <ManualGradingForm
                      submission={submission}
                      rubric={assignment?.rubrics}
                      assignment={assignment}
                      onCancel={() => setGradingMode(null)}
                      onSuccess={() => { setGradingMode(null); router.refresh(); }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

interface GradeCardMiniProps {
  label: string
  score: number
  total?: number
  isActive: boolean
  onApply: () => void
  disabled: boolean
}

function GradeCardMini({ label, score, total, isActive, onApply, disabled }: GradeCardMiniProps) {
  return (
    <button
      onClick={onApply}
      disabled={disabled || isActive}
      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all cursor-pointer
        ${isActive
          ? "border-navy bg-navy/5"
          : "border-border hover:border-navy/30"
        } disabled:cursor-not-allowed`}
    >
      <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-navy" : "text-muted-foreground"}`}>
        {label}
      </span>
      <span className="font-black text-[20px] text-foreground leading-none mt-1">
        {score}
      </span>
      <span className="text-[10px] text-muted-foreground">/{total}</span>
    </button>
  )
}

interface GradeCardProps {
  label: string
  icon: React.ReactNode
  score: number
  feedback: string | null
  total?: number
  isActive: boolean
  variant: "navy-light" | "yellow"
  onApply: () => void
  disabled: boolean
}

function GradeCard({ label, icon, score, feedback, total, isActive, variant, onApply, disabled }: GradeCardProps) {
  const isNavyLight = variant === "navy-light"

  return (
    <div className={`bg-white border-2 rounded-2xl p-4 sm:p-6 transition-all shadow-sm
      ${isActive
        ? isNavyLight
          ? "border-navy-light/40 bg-navy-light/5 ring-4 ring-navy-light/5"
          : "border-yellow/50 bg-yellow/5 ring-4 ring-yellow/5"
        : "border-border hover:border-navy/20"
      }`}>

      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center gap-2 text-[12px] font-black
          tracking-widest uppercase rounded-xl px-4 py-1.5
          ${isNavyLight ? "bg-navy-light text-white" : "bg-yellow text-navy"}`}>
          {icon} {label}
        </span>
        <div className="text-right">
          <span className="font-black text-[24px] sm:text-[32px] text-foreground leading-none">
            {score}
          </span>
          <span className="text-[14px] font-bold text-muted-foreground ml-1">/{total}</span>
        </div>
      </div>

      {feedback && (
        <div className="bg-secondary/50 rounded-xl p-4 mb-5 border border-border/50">
          <p className="text-[13px] text-foreground/70 italic leading-relaxed line-clamp-4">
            &ldquo;{feedback}&rdquo;
          </p>
        </div>
      )}

      <button
        onClick={onApply}
        disabled={disabled || isActive}
        className={`w-full inline-flex items-center justify-center font-black
          text-[14px] py-3 rounded-xl transition-all cursor-pointer border-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isNavyLight
            ? "bg-navy-light text-white hover:bg-navy-light/90 shadow-md hover:-translate-y-0.5"
            : "bg-navy text-white hover:bg-navy/90 shadow-md hover:-translate-y-0.5"
          }`}>
        {isActive ? <><CheckCircle2 size={16} className="mr-2" /> Applied</> : "Use this grade"}
      </button>
    </div>
  )
}

interface MethodButtonProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  variant: "navy-light" | "yellow"
  onClick: () => void
}

function MethodButton({ icon, title, subtitle, variant, onClick }: MethodButtonProps) {
  const [hovered, setHovered] = useState(false)
  const isNavyLight = variant === "navy-light"

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2
        text-left transition-all cursor-pointer bg-white
        ${hovered
          ? isNavyLight ? "border-navy-light/30 bg-navy-light/8" : "border-yellow/40 bg-yellow/8"
          : "border-border"
        }`}>

      <div className={`size-11 rounded-xl flex items-center justify-center
        shrink-0 transition-colors
        ${hovered
          ? isNavyLight ? "bg-navy-light text-white" : "bg-navy text-yellow"
          : isNavyLight ? "bg-navy-light/12 text-navy-light" : "bg-yellow/15 text-navy"
        }`}>
        {icon}
      </div>

      <div>
        <p className="font-black text-[13px] uppercase text-foreground">{title}</p>
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mt-0.5">
          {subtitle}
        </p>
      </div>
    </button>
  )
}
