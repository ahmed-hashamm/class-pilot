"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, FileText, CheckCircle2, Layout } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SubmissionHeaderProps {
  isDraft: boolean
  finalGrade: number | null
  totalPoints?: number
  isAiGrade?: boolean
}

export function SubmissionHeader({ isDraft, finalGrade, totalPoints }: SubmissionHeaderProps) {
  const router = useRouter()

  return (
    <div className="w-full flex items-center justify-between gap-4 py-2 sm:py-0 border-b sm:border-none">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold shrink-0 text-navy/60 hover:text-navy transition-colors h-auto p-1"
      >
        <ArrowLeft size={16} />
        <span className="hidden xs:inline">Back to Class</span>
        <span className="xs:hidden">Back</span>
      </Button>

      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
        {isDraft && (
          <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-black
            uppercase tracking-wider rounded-full px-4 py-1.5 border
            bg-yellow text-navy border-yellow/30 animate-pulse">
            <FileText size={13} />
            <span className="truncate">Draft</span>
          </span>
        )}
        {finalGrade !== null && (
          <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-black
            uppercase tracking-wider rounded-full px-4 py-1.5 border
            bg-navy text-white border-navy">
            <CheckCircle2 size={13} />
            <span className="truncate">Grade: {finalGrade} / {totalPoints || "—"}</span>
          </span>
        )}
        <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-black
          uppercase tracking-wider rounded-full px-4 py-1.5 border
          bg-navy/5 text-navy border-navy/10">
          <Layout size={13} /> Grading View
        </span>
      </div>
    </div>
  )
}
