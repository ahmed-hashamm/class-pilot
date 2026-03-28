"use client";

import { User, ClipboardList, Clock, Award, CheckCircle2, BookOpen, Users, AlertCircle } from "lucide-react";
import { format, isPast } from "date-fns";
import AttachmentButton from "@/components/features/classes/buttons/AttachmentButton";
import { SubmissionsList } from "@/components/features/submissions";

export function AssignmentHeader({ 
  assignment, 
  isTeacher, 
  isTurnedIn, 
  isGraded 
}: { 
  assignment: any; 
  isTeacher?: boolean; 
  isTurnedIn?: boolean; 
  isGraded?: boolean 
}) {
  const isExpired = assignment.due_date ? isPast(new Date(assignment.due_date)) : false;

  const getStatus = () => {
    // Teacher Specific Status
    if (isTeacher) {
      if (isExpired) return { label: "Ended", icon: AlertCircle, classes: "bg-red-50 text-red-700 border-red-200" };
      return { label: "Active", icon: Clock, classes: "bg-green-50 text-green-700 border-green-200" };
    }

    // Student Status
    if (isGraded) return { label: "Graded", classes: "bg-navy text-white border-navy" };
    if (isTurnedIn) return { label: "Turned in", classes: "bg-green-50 text-green-700 border-green-200" };
    return { label: "Assigned", classes: "bg-yellow/10 text-navy border-yellow/30" };
  };

  const status = getStatus();

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="shrink-0 size-12 rounded-2xl bg-navy flex items-center justify-center text-yellow shadow-sm">
          <ClipboardList size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-[24px] tracking-tight leading-tight text-foreground break-words">{assignment.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-[13px] text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5"><User size={13} className="text-navy/60" />{assignment.users?.full_name || "Instructor"}</span>
            <span className="text-border">·</span>
            <span>Posted {assignment.created_at ? format(new Date(assignment.created_at), "MMM d, yyyy") : ""}</span>
          </div>
        </div>
      </div>

      <span className={`shrink-0 inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider rounded-full px-4 py-1.5 border ${status.classes}`}>
        {isTeacher && status.icon && <status.icon size={13} />}
        {(isGraded || isTurnedIn) && !isTeacher && <CheckCircle2 size={13} />} 
        {status.label}
      </span>
    </div>
  );
}

export function AssignmentInfo({ assignment, submission }: { assignment: any; submission?: any }) {
  const isGraded = submission?.status === 'graded';

  return (
    <div className="flex flex-col gap-3">
      {isGraded && (
        <div className="flex items-center justify-between bg-navy text-white rounded-2xl px-4 py-4 shadow-md mb-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">Your Grade</span>
            <span className="text-[11px] font-medium text-white/80 italic">Graded by instructor</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[28px] font-black text-yellow leading-none">{submission.final_grade ?? 0}</span>
            <span className="text-[12px] font-bold text-white/30">/ {assignment.points}</span>
          </div>
        </div>
      )}
      <InfoRow icon={<Clock size={14} />} label="Due Date" value={assignment.due_date ? format(new Date(assignment.due_date), "MMM d, h:mm a") : "No deadline"} />
      <InfoRow icon={<Award size={14} />} label="Total Value" value={`${assignment.points} points`} />
      <InfoRow icon={<BookOpen size={14} />} label="Type" value={assignment.submission_type === 'file' ? 'File Upload' : 'Text Entry'} />
      {assignment.is_group_project && (
        <InfoRow icon={<Users size={14} />} label="Format" value="Group Project" />
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between bg-white border border-border rounded-2xl px-4 py-3 shadow-sm hover:border-navy/20 transition-colors">
      <div className="flex items-center gap-2.5">
        <div className="size-7 rounded-lg bg-navy/5 flex items-center justify-center text-navy/60">{icon}</div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-navy/40">{label}</span>
      </div>
      <span className="text-[12px] font-black text-foreground">{value}</span>
    </div>
  );
}

export function AssignmentInstructions({ assignment }: { assignment: any }) {
  const attachments = assignment.attachment_paths || [];
  const getDisplayName = (path: string) => {
    const fileName = path.split("/").pop() || "File";
    return fileName.includes("-") ? fileName.split("-").slice(1).join("-") : fileName;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-navy/40">Instructions</p>
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <p className="whitespace-pre-wrap break-words text-[14px] leading-relaxed text-foreground/80">{assignment.description || assignment.content || "No instructions provided."}</p>
        </div>
      </div>
      {attachments.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-navy/40">Attachments</p>
          <div className="flex flex-wrap gap-2">
            {attachments.map((path: string) => <AttachmentButton key={path} path={path} type="assignment" label={getDisplayName(path)} />)}
          </div>
        </div>
      )}
    </div>
  );
}

export function StudentStatus({ isTurnedIn, isGraded, onShowForm }: { isTurnedIn: boolean; isGraded?: boolean; onShowForm: () => void }) {
  if (isGraded) return null;

  return (
    <button
      onClick={onShowForm}
      className={`w-full inline-flex items-center justify-center gap-2 font-black text-[13px] py-3.5 rounded-xl border-2 transition-all cursor-pointer ${isTurnedIn ? "bg-navy text-white border-navy hover:bg-navy/90" : "bg-white text-navy border-navy hover:bg-navy hover:text-white"}`}
    >
      <BookOpen size={16} /> {isTurnedIn ? "Edit Submission" : "Add Submission"}
    </button>
  );
}

export function TeacherProgress({ submissions, assignment, classId }: any) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-navy/40">Classwork Overview</p>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black bg-navy/5 text-navy border border-navy/10 rounded-full px-3 py-1">{submissions?.length || 0} Submissions</span>
      </div>
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden min-h-[200px]">
        <SubmissionsList submissions={submissions} assignment={assignment} classId={classId} />
      </div>
    </div>
  );
}
