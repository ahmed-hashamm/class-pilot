"use client"

import { useState } from "react"
import { Sparkles, PenLine, Layout } from "lucide-react"

interface GradeCardMiniProps {
  label: string
  score: number
  feedback?: string | null
  total?: number
  isActive: boolean
  onApply: () => void
  disabled: boolean
}

export function GradeCardMini({ label, score, feedback, total, isActive, onApply, disabled }: GradeCardMiniProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isAI = label === "AI"

  return (
    <div className={`flex flex-col rounded-2xl border-2 transition-all bg-white shadow-sm overflow-hidden
      ${isActive
        ? "border-navy ring-4 ring-navy/5 bg-navy/[0.02]"
        : "border-border hover:border-navy/30"
      }`}>

      {/* Main Row */}
      <div className="flex items-center justify-between p-3.5 gap-3">
        <button
          onClick={onApply}
          disabled={disabled || isActive}
          className="flex flex-1 items-center gap-3 text-left bg-transparent border-none p-0 cursor-pointer disabled:cursor-default"
        >
          <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm
            ${isAI ? "bg-navy-light text-white" : "bg-yellow text-navy"}`}>
            {isAI ? <Sparkles size={14} /> : <PenLine size={14} />}
          </div>
          <div>
            <p className={`text-[11px] font-black uppercase tracking-[.15em] leading-none mb-1
              ${isActive ? "text-navy" : "text-muted-foreground"}`}>
              {isAI ? "AI Evaluation" : "Manual Review"}
            </p>
            <div className="flex items-center gap-1.5">
              {isActive && <div className="size-1.5 rounded-full bg-navy animate-pulse" />}
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">
                {isActive ? "Currently Applied" : `Select this ${label}`}
              </p>
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-baseline gap-0.5 p-1.5">
            <span className="font-black text-[16px] text-navy leading-none">
              {score}
            </span>
            <span className="text-[10px] font-bold text-navy/40 tracking-tighter">
              /{total || "—"}
            </span>
          </div>

          {feedback && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="size-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-navy/5 transition-colors cursor-pointer bg-white"
            >
              <Layout size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Feedback */}
      {isExpanded && feedback && (
        <div className="px-3.5 pb-4 pt-1 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-secondary/40 rounded-xl p-3 border border-border/40">
            <p className="text-[12px] text-foreground/70 italic leading-relaxed">
              &ldquo;{feedback}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
