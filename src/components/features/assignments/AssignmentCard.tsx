"use client";

import Link from "next/link";
import { format, isToday, isPast } from "date-fns";
import { 
  Award, 
  Calendar, 
  Users, 
  ChevronRight, 
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  User
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import AttachmentButton from "@/components/features/classes/buttons/AttachmentButton";

interface AssignmentCardProps {
  assignment: any;
  classId: string;
  getDisplayName: (path: string) => string;
  muted?: boolean;
}

export default function AssignmentCard({
  assignment,
  classId,
  getDisplayName,
  muted = false,
}: AssignmentCardProps) {
  const [imgError, setImgError] = useState(false);
  const teacher = assignment.users;
  const dueDate = assignment.due_date ? new Date(assignment.due_date) : null;
  const isOverdue = dueDate && isPast(dueDate) && !assignment.user_submission;
  
  // Status Logic - Simplified for responsiveness
  const getStatus = () => {
    if (assignment.user_submission) {
      return assignment.user_submission.status === 'graded' 
        ? { label: 'Graded', icon: Award, text: 'text-navy', bg: 'sm:bg-yellow/10 sm:border-yellow/20' }
        : { label: 'Submitted', icon: CheckCircle2, text: 'text-green-600', bg: 'sm:bg-green-50 sm:border-green-100' };
    }
    if (isOverdue) return { label: 'Missing', icon: AlertCircle, text: 'text-red-600', bg: 'sm:bg-red-50 sm:border-red-100' };
    if (dueDate && isToday(dueDate)) return { label: 'Due Today', icon: Clock, text: 'text-orange-600', bg: 'sm:bg-orange-50 sm:border-orange-100' };
    return { label: 'Assigned', icon: FileText, text: 'text-navy/60', bg: 'sm:bg-navy/5 sm:border-navy/10' };
  };

  const status = getStatus();

  return (
    <Link
      href={`/classes/${classId}/assignments/${assignment.id}?from=work`}
      className={`group relative flex items-stretch gap-0 bg-white border border-border rounded-2xl overflow-hidden transition-all duration-300
        hover:shadow-xl hover:shadow-navy/5 hover:-translate-y-1 active:scale-[0.99]
        ${muted ? "opacity-75 grayscale-[0.2]" : ""}`}
    >
      {/* Date Sideline Box */}
      <div className={`w-20 sm:w-24 shrink-0 flex flex-col items-center justify-center border-r border-border transition-colors
        ${muted ? "bg-secondary/30" : "bg-secondary/10 group-hover:bg-navy/5"}`}>
        {dueDate ? (
          <>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-1">
              {format(dueDate, "MMM")}
            </span>
            <span className={`text-2xl font-black leading-none ${muted ? "text-muted-foreground/60" : "text-navy"}`}>
              {format(dueDate, "d")}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground/40 mt-1">
              {format(dueDate, "EEE")}
            </span>
          </>
        ) : (
          <Calendar size={20} className="text-muted-foreground/20" />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 sm:p-6 min-w-0 flex flex-col gap-4">
        {/* Top Metadata & Title */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
              <h3 className="font-black text-[16px] sm:text-[18px] text-foreground truncate group-hover:text-navy transition-colors tracking-tight">
                {assignment.title}
              </h3>
              {assignment.is_group_project && (
                <span className="shrink-0 flex items-center gap-1 bg-navy/5 text-navy border border-navy/10 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                  <Users size={10} /> Team
                </span>
              )}
            </div>
            
            {/* Status Pill - Responsive (Icon only on mobile) */}
            <div className={`shrink-0 flex items-center gap-1.2 sm:gap-1.5 sm:px-2.5 sm:py-1 rounded-full sm:border text-[10px] font-black uppercase tracking-wider ${status.text} ${status.bg}`}>
              <status.icon size={12} className="sm:size-3" />
              <span className="hidden sm:inline">{status.label}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {assignment.description && (
              <p className="text-[13px] text-muted-foreground/60 line-clamp-1 leading-relaxed max-w-2xl">
                {assignment.description}
              </p>
            )}
            {/* Mobile-only teacher name */}
            <div className="sm:hidden flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground/40 mt-0.5 uppercase tracking-wide">
              <User size={10} className="opacity-40" />
              <span className="truncate max-w-[180px]">{teacher?.full_name || "Teacher"}</span>
            </div>
          </div>
        </div>

        {/* Lower Info Bar */}
        <div className="flex items-center justify-between gap-4 mt-auto pt-3 border-t border-secondary/40">
          <div className="flex items-center gap-4">
            {/* Points */}
            <div className="flex items-center gap-1.5 text-navy/60 font-black text-[11px] uppercase tracking-wider">
              <Award size={14} className="text-yellow-500" />
              {assignment.points ?? 100} PTS
            </div>

            {/* Submissions Count - Desktop only */}
            <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground/30 font-bold text-[11px] uppercase tracking-wider ml-1">
               <FileText size={14} />
               {assignment.submission_count} Submissions
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 ml-auto pr-1">
            {/* Teacher Avatar - Desktop only */}
            <div className="flex items-center gap-2 group/author shrink-0">
              <div className="size-5 rounded-lg overflow-hidden border border-border bg-secondary flex items-center justify-center text-[9px] font-black text-navy shrink-0 relative">
                {teacher?.avatar_url && !imgError ? (
                  <Image 
                    src={teacher.avatar_url.startsWith('http') ? teacher.avatar_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${teacher.avatar_url}`}
                    alt={teacher.full_name}
                    fill
                    className="object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : teacher?.full_name?.charAt(0)}
              </div>
              <span className="text-[10px] font-bold text-muted-foreground/50 transition-colors group-hover/author:text-navy truncate max-w-[100px]">
                {teacher?.full_name || "Teacher"}
              </span>
            </div>

            {/* Quick Link Button - Far Right */}
            <div className="size-7 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground/40 group-hover:bg-navy group-hover:text-white transition-all shrink-0 shadow-sm border border-border/50">
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
