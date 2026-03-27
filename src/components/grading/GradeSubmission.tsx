"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ClipboardList, Sparkles,
  PenLine, CheckCircle2, Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AttachmentButton from "../class/Buttons/AttachmentButton";
import AIGradingButton from "./AIGradingButton";
import ManualGradingForm from "./ManualGradingForm";

export interface GradingSubmissionProps {
  id: string;
  assignment_id: string;
  content: string | null;
  files: { name: string; url: string }[] | null;
  final_grade: number | null;
  ai_grade: number | null;
  manual_grade: number | null;
  ai_feedback: string | null;
  teacher_feedback: string | null;
  status: string;
  users: { full_name: string; avatar_url: string | null } | null;
  assignments: { title: string; points: number; rubrics?: Record<string, unknown> } | null;
}

export default function GradeSubmission({
  submission, classId,
}: {
  submission: GradingSubmissionProps;
  classId: string;
}) {
  const [gradingMode,    setGradingMode]    = useState<"ai" | "manual" | null>(null);
  const [isUpdating,     setIsUpdating]     = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const router   = useRouter();
  const supabase = createClient();

  const assignment = submission.assignments;
  const student    = submission.users;
  const files      = submission.files || [];

  const handleSetFinalGrade = async (type: "ai" | "manual") => {
    setIsUpdating(true);
    const score = type === "ai" ? submission.ai_grade : submission.manual_grade;
    try {
      const { error } = await (supabase as any)
        .from("submissions")
        .update({ final_grade: score, updated_at: new Date().toISOString() })
        .eq("id", submission.id);
      if (error) throw error;
      router.refresh();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-[1500px] flex-col gap-6 p-4
      lg:h-[calc(100vh-20px)] lg:p-6">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[13px] font-semibold
            text-muted-foreground hover:text-navy transition-colors
            cursor-pointer bg-transparent border-none">
          <ArrowLeft size={15} /> Back
        </button>

        <div className="flex items-center gap-2.5">
          {submission.final_grade !== null && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold
              bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1">
              <CheckCircle2 size={11} /> Final grade: {submission.final_grade}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold
            tracking-widest uppercase bg-yellow/20 text-navy border border-yellow/40
            rounded-full px-3 py-1">
            <ClipboardList size={11} /> Grading
          </span>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-8 overflow-hidden lg:grid-cols-12">

        {/* Left — submission */}
        <div className="lg:col-span-7 flex flex-col gap-6 overflow-y-auto pr-2">

          {/* Student header */}
          <div className="flex items-center gap-3.5">
            <div className="shrink-0 size-12 rounded-2xl bg-navy flex items-center
              justify-center text-yellow font-black text-[18px]">
              {student?.full_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-black text-[22px] tracking-tight leading-tight">
                {student?.full_name}
              </h1>
              <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase
                tracking-wide text-muted-foreground mt-0.5">
                <ClipboardList size={12} className="text-navy" />
                {assignment?.title}
              </p>
            </div>
          </div>

          {/* Response */}
          <section className="flex flex-col gap-2">
            <p className="text-[10px] font-black uppercase tracking-[.25em]
              text-muted-foreground/60">
              Student response
            </p>
            <div className="bg-white border border-border rounded-2xl p-6">
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/80">
                {submission.content || "This submission has no text content."}
              </p>
            </div>
          </section>

          {/* Files */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((file, i: number) => (
                <AttachmentButton key={i} path={file.url} type="assignment" label={file.name} />
              ))}
            </div>
          )}
        </div>

        {/* Right — grading */}
        <aside className="lg:col-span-5 flex flex-col gap-5 overflow-y-auto">

          {/* Grade comparison */}
          {(submission.ai_grade !== null || submission.manual_grade !== null) && (
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-black uppercase tracking-[.25em]
                text-muted-foreground/60">
                Finalize grading
              </p>

              <div className="flex flex-col gap-3">
                {/* AI grade card */}
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

                {/* Manual grade card */}
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
            </div>
          )}

          {/* Grading method panel */}
          <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-5">
            {!gradingMode ? (
              <>
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-black uppercase tracking-[.25em]
                    text-muted-foreground/60">
                    Grading methods
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    Choose how to evaluate this submission
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <MethodButton
                    icon={<Sparkles size={20} />}
                    title="AI rubric scan"
                    subtitle="Automated feedback"
                    variant="navy-light"
                    onClick={() => setGradingMode("ai")}
                  />
                  <MethodButton
                    icon={<PenLine size={20} />}
                    title="Manual evaluation"
                    subtitle="Teacher input"
                    variant="yellow"
                    onClick={() => setGradingMode("manual")}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <span className="text-[11px] font-bold uppercase tracking-widest
                    text-navy">
                    {gradingMode === "ai" ? "AI evaluation" : "Manual grading"}
                  </span>
                  <button
                    onClick={() => setGradingMode(null)}
                    className="text-[12px] font-semibold text-muted-foreground
                      hover:text-foreground transition cursor-pointer
                      bg-transparent border-none">
                    Cancel
                  </button>
                </div>

                {gradingMode === "ai" ? (
                  <AIGradingButton
                    submission={submission}
                    onGradingStart={() => setIsAiProcessing(true)}
                    onGradingComplete={() => {
                      setIsAiProcessing(false);
                      setGradingMode(null);
                      router.refresh();
                    }}
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
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

interface GradeCardProps {
  label: string;
  icon: React.ReactNode;
  score: number;
  feedback: string | null;
  total?: number;
  isActive: boolean;
  variant: "navy-light" | "yellow";
  onApply: () => void;
  disabled: boolean;
}

function GradeCard({ label, icon, score, feedback, total, isActive, variant, onApply, disabled }: GradeCardProps) {
  const isNavyLight = variant === "navy-light"

  return (
    <div className={`bg-white border rounded-2xl p-5 transition-all
      ${isActive
        ? isNavyLight
          ? "border-navy-light/40 bg-navy-light/8"
          : "border-yellow/50 bg-yellow/8"
        : "border-border"
      }`}>

      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold
          rounded-full px-3 py-1
          ${isNavyLight ? "bg-navy-light text-white" : "bg-yellow text-navy"}`}>
          {icon} {label}
        </span>
        <span className="font-black text-[28px] text-foreground leading-none">
          {score}
          <span className="text-[14px] text-muted-foreground">/{total}</span>
        </span>
      </div>

      {feedback && (
        <p className="text-[13px] text-muted-foreground italic mb-4 leading-relaxed line-clamp-3">
          "{feedback}"
        </p>
      )}

      <button
        onClick={onApply}
        disabled={disabled || isActive}
        className={`w-full inline-flex items-center justify-center font-bold
          text-[13px] py-2.5 rounded-xl transition cursor-pointer border-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isNavyLight
            ? "bg-navy-light text-white hover:bg-navy-light/90"
            : "bg-navy text-white hover:bg-navy/90"
          }`}>
        {isActive ? "Currently active" : "Apply grade"}
      </button>
    </div>
  )
}

interface MethodButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  variant: "navy-light" | "yellow";
  onClick: () => void;
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
