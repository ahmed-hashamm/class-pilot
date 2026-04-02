"use client"

import { format } from "date-fns"
import { ClipboardList } from "lucide-react"
import AttachmentButton from "@/components/features/classes/buttons/AttachmentButton"

interface SubmissionContentProps {
  studentName?: string
  assignmentTitle?: string
  submittedAt?: string | null
  createdAt?: string | null
  content?: string | null
  files?: { name: string; url: string }[]
}

export function SubmissionContent({
  studentName,
  assignmentTitle,
  submittedAt,
  createdAt,
  content,
  files = []
}: SubmissionContentProps) {
  return (
    <div className="w-full lg:flex-1 flex flex-col gap-6 min-w-0">
      {/* Simple Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="shrink-0 size-12 rounded-2xl bg-navy flex items-center justify-center text-yellow shadow-sm font-black text-lg">
            {studentName?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-[24px] tracking-tight leading-tight text-foreground break-words">{studentName}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-[13px] text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5 min-w-0">
                <ClipboardList size={13} className="text-navy/60 shrink-0" />
                <span className="truncate">{assignmentTitle}</span>
              </span>
              <span className="hidden sm:inline text-border">·</span>
              <span className="truncate">
                Submitted {submittedAt || createdAt
                  ? format(new Date(submittedAt || createdAt || ""), "MMM d, h:mm a")
                  : "Recently"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Response area */}
      <div className="flex flex-col gap-2.5 w-full min-w-0 overflow-hidden">
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-navy/40 pl-1">Response</p>
        <div className="bg-white border border-border rounded-2xl p-4 sm:p-6 shadow-sm w-full min-w-0 overflow-hidden">
          <p className="whitespace-pre-wrap break-words text-[14px] leading-relaxed text-foreground/80 w-full overflow-hidden">
            {content || "No text content."}
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
  )
}
