"use client";

import { User, ClipboardList, Clock, Award, CheckCircle2, BookOpen } from "lucide-react";
import { format } from "date-fns";
import AttachmentButton from "@/components/features/classes/buttons/AttachmentButton";
import { SubmissionsList } from "@/components/features/submissions";

export function AssignmentHeader({ assignment }: { assignment: any }) {
  return (
    <div className="flex items-center gap-4">
      <div className="shrink-0 size-12 rounded-2xl bg-navy flex items-center justify-center text-yellow shadow-sm">
        <ClipboardList size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="font-black text-[24px] tracking-tight leading-tight text-foreground">{assignment.title}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-1 text-[13px] text-muted-foreground font-medium">
          <span className="flex items-center gap-1.5"><User size={13} className="text-navy/60" />{assignment.users?.full_name || "Instructor"}</span>
          <span className="text-border">·</span>
          <span>Posted {assignment.created_at ? format(new Date(assignment.created_at), "MMM d, yyyy") : ""}</span>
        </div>
      </div>
    </div>
  );
}

export function AssignmentInfo({ assignment }: { assignment: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InfoRow icon={<Clock size={14} />} label="Due Date" value={assignment.due_date ? format(new Date(assignment.due_date), "MMM d, h:mm a") : "No deadline"} />
      <InfoRow icon={<Award size={14} />} label="Total Value" value={`${assignment.points} points`} />
    </div>
  );
}

function InfoRow({ icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between bg-white border border-border rounded-2xl px-5 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-xl bg-navy/8 border border-navy/15 flex items-center justify-center">{icon}</div>
        <span className="text-[12px] font-bold uppercase tracking-wide text-navy/60">{label}</span>
      </div>
      <span className="text-[14px] font-black text-foreground">{value}</span>
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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-navy/60">Instructions</p>
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/80">{assignment.description || assignment.content || "No instructions provided."}</p>
        </div>
      </div>
      {attachments.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-navy/60">Reference Materials</p>
          <div className="flex flex-wrap gap-2">
            {attachments.map((path: string) => <AttachmentButton key={path} path={path} type="assignment" label={getDisplayName(path)} />)}
          </div>
        </div>
      )}
    </div>
  );
}

export function StudentStatus({ isTurnedIn, isGraded, submission, assignment, onShowForm }: any) {
  return (
    <div className="flex flex-col gap-5 border-t border-border pt-8 mt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-navy/60">Your Status</p>
          <span className={`inline-flex items-center gap-1.5 text-[13px] font-black rounded-full px-4 py-1.5 border ${isTurnedIn ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow/10 text-navy border-yellow/30"}`}>
            {isTurnedIn ? <><CheckCircle2 size={14} /> Turned in</> : "Assigned"}
          </span>
        </div>
        {isGraded && (
          <div className="bg-navy rounded-2xl px-6 py-4 text-center sm:text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Final Grade</p>
            <p className="font-black text-[32px] text-yellow leading-none">{submission.final_grade ?? 0}<span className="text-[14px] text-white/40"> / {assignment.points}</span></p>
          </div>
        )}
      </div>
      <button onClick={onShowForm} className={`w-full inline-flex items-center justify-center gap-2 font-black text-[14px] py-3.5 rounded-xl border-2 transition-all cursor-pointer ${isTurnedIn ? "bg-navy text-white border-navy hover:bg-navy/90" : "bg-white text-navy border-navy hover:bg-navy hover:text-white"}`}>
        <BookOpen size={16} /> {isTurnedIn ? "Update your submission" : "Add submission"}
      </button>
    </div>
  );
}

export function TeacherProgress({ submissions, assignment, classId }: any) {
  return (
    <div className="flex flex-col gap-5 border-t border-border pt-8 mt-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-navy/60">Class Progress</p>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-black bg-navy text-white rounded-full px-4 py-1.5">{submissions?.length || 0} Submissions</span>
      </div>
      <SubmissionsList submissions={submissions} assignment={assignment} classId={classId} />
    </div>
  );
}
