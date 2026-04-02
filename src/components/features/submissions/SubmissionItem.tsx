"use client"

import { format } from "date-fns"
import Link from "next/link"
import { Calendar, ArrowRight, Users, FileText } from "lucide-react"
import { StudentAvatar } from "@/components/features/students/StudentAvatar"
import { SubmissionStatusBadge } from "./SubmissionStatusBadge"
import { GroupMembersList } from "./GroupMembersList"

interface SubmissionItemProps {
  submission: any
  assignment: any
  classId: string
  isGrading?: boolean
  getAvatarSrc: (path?: string) => string | undefined
  isLast?: boolean
}

export function SubmissionItem({
  submission,
  assignment,
  classId,
  isGrading,
  getAvatarSrc,
  isLast
}: SubmissionItemProps) {
  const student = submission.users
  const studentName = student?.full_name || student?.email || "Unknown Student"
  const isGraded = submission.status === "graded" || !!submission.final_grade
  const isDraft = (typeof submission.ai_grade === "number" && submission.ai_grade !== null) && submission.final_grade === null
  const isGroup = !!assignment.is_group_project
  const groupData = submission.group_projects
  const groupName = groupData?.title
  const members = groupData?.project_members || []

  return (
    <div className={`flex flex-col gap-4 px-4 sm:px-6 py-5 hover:bg-secondary/20 transition-all group
      ${!isLast ? "border-b border-border" : ""}`}>

      <div className="flex items-center justify-between gap-3">
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {isGroup ? (
            <div className="shrink-0 size-9 sm:size-10 rounded-xl bg-navy flex items-center justify-center text-yellow border border-navy/20 shadow-sm">
              <Users size={18} className="sm:size-5" />
            </div>
          ) : (
            <StudentAvatar name={studentName} src={getAvatarSrc(student?.avatar_url)} size="size-9 sm:size-10" />
          )}

          <div className="min-w-0 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="font-bold text-[14px] sm:text-[15px] lg:text-[16px] text-foreground truncate group-hover:text-navy transition-colors">
                {isGroup ? (groupName || "Unnamed Team") : studentName}
              </p>
              <div className="flex gap-1.5 items-center">
                {isGroup && <StatusTag label="Team" />}
                {isDraft && <StatusTag label="Draft" icon={<FileText size={10} />} color="bg-yellow/20 text-navy border-yellow/30" />}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-muted-foreground whitespace-nowrap overflow-hidden mt-0.5">
              {isGrading ? (
                <span className="text-blue-600 font-black animate-pulse flex items-center gap-1">AI Grading...</span>
              ) : (
                <>
                  <Calendar size={10} className="sm:size-3" />
                  <span className="truncate">{formatDate(submission.submitted_at || submission.created_at)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Score + Status + Action */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          {(submission.final_grade !== null || (isDraft && submission.ai_grade !== null)) && (
            <div className="hidden sm:flex flex-col items-end">
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isDraft ? "text-yellow-600" : "text-muted-foreground"}`}>
                {isDraft ? "AI Draft" : "Score"}
              </p>
              <p className={`font-black text-[17px] leading-tight ${isDraft ? "text-yellow-700" : "text-foreground"}`}>
                {submission.final_grade ?? submission.ai_grade}
                <span className="text-[12px] font-bold opacity-50 ml-0.5">/{assignment.points}</span>
              </p>
            </div>
          )}

          <SubmissionStatusBadge isGraded={isGraded} isDraft={isDraft} />

          <Link href={`/classes/${classId}/assignments/${assignment.id}/submissions/${submission.id}`}>
            <button className={`size-10 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer group/btn shadow-sm
              ${isGraded ? "bg-white text-navy border-border hover:border-navy/40" : "bg-navy text-white border-navy hover:bg-navy/90"}`}>
              <ArrowRight size={18} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </Link>
        </div>
      </div>

      {isGroup && <GroupMembersList members={members} getAvatarSrc={getAvatarSrc} />}
    </div>
  )
}

function StatusTag({ label, icon, color = "bg-navy/5 text-navy border-navy/10" }: { label: string, icon?: React.ReactNode, color?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${color}`}>
      {icon} {label}
    </span>
  )
}

function formatDate(dateStr: string) {
  if (!dateStr) return "Not submitted";
  try {
    return format(new Date(dateStr), "MMM d, h:mm a");
  } catch (e) {
    return "Invalid Date";
  }
}
