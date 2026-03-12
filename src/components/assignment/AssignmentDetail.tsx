// "use client";

// import { useState } from "react";
// import { format } from "date-fns";
// import { useRouter } from "next/navigation";
// import { ArrowLeft, User, ClipboardList, Clock, Award } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import AttachmentButton from "@/components/class/Buttons/AttachmentButton";
// import SubmissionForm from "./SubmissionForm";
// import SubmissionsList from "./SubmissionsList";

// export default function AssignmentDetail({
//   assignment,
//   isTeacher,
//   submission,
//   submissions,
//   classId,
// }: any) {
//   const [showSubmissionForm, setShowSubmissionForm] = useState(false);
//   const router = useRouter();

//   const attachments = assignment.attachment_paths || [];

//   const getDisplayName = (path: string) => {
//     const fileName = path.split("/").pop() || "File";
//     return fileName.includes("-")
//       ? fileName.split("-").slice(1).join("-")
//       : fileName;
//   };

//   return (
//     <div className="mx-auto flex h-full max-w-[1500px] flex-col gap-6 p-4 lg:h-[calc(100vh-20px)] lg:p-6">
//       {/* TOP BAR */}
//       <div className="flex items-center justify-between">
//         <Button
//           variant="ghost"
//           onClick={() => router.back()}
//           className="h-8 px-0 text-gray-400 hover:text-orange-600"
//         >
//           <ArrowLeft size={16} className="mr-2" /> Back
//         </Button>

//         <Badge className="bg-orange-50 text-orange-600 border border-orange-100 font-bold">
//           Assignment
//         </Badge>
//       </div>

//       <div className="grid flex-1 grid-cols-1 gap-8 overflow-hidden lg:grid-cols-12">
//         {/* LEFT */}
//         <div className="lg:col-span-8 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
//           {/* HEADER */}
//           <div className="flex gap-4">
//             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-lg">
//               <ClipboardList size={22} />
//             </div>

//             <div className="flex flex-col gap-1 flex-1">
//               <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-gray-900">
//                 {assignment.title}
//               </h1>

//               <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold uppercase text-gray-500">
//                 <div className="flex items-center gap-2">
//                   <User size={14} className="text-orange-600" />
//                   {assignment.users?.full_name || "Instructor"}
//                 </div>

//                 <span>
//                   Posted{" "}
//                   {assignment.created_at
//                     ? format(new Date(assignment.created_at), "MMMM d, yyyy")
//                     : ""}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* INSTRUCTIONS */}
//           <section className="space-y-3">
//             <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
//               Instructions
//             </h2>
//             <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
//               <p className="whitespace-pre-wrap text-lg font-medium leading-relaxed text-gray-700">
//                 {assignment.description || assignment.content}
//               </p>
//             </div>
//           </section>

//           {/* MATERIALS */}
//           {attachments.length > 0 && (
//             <section className="space-y-3">
//               <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
//                 Materials
//               </h2>
//               <div className="flex flex-wrap gap-2">
//                 {attachments.map((path: string) => (
//                   <AttachmentButton
//                     key={path}
//                     path={path}
//                     type="assignment"
//                     label={getDisplayName(path)}
//                   />
//                 ))}
//               </div>
//             </section>
//           )}

//           {/* TEACHER VIEW */}
//           {isTeacher && (
//             <section className="border-t border-gray-100 pt-8 space-y-4">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
//                   Class Progress
//                 </h2>
//                 <Badge className="bg-black text-white">
//                   {submissions?.length || 0} Submissions
//                 </Badge>
//               </div>

//               <SubmissionsList
//                 submissions={submissions}
//                 assignment={assignment}
//                 classId={classId}
//               />
//             </section>
//           )}
//         </div>

//         {/* RIGHT */}
//         <aside className="lg:col-span-4">
//           <div className="flex flex-col gap-6 rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm">
//             {/* DETAILS */}
//             <div className="space-y-3">
//               <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
//                 Details
//               </h3>

//               <div className="space-y-2">
//                 <InfoRow
//                   icon={<Clock size={16} />}
//                   label="Due"
//                   value={
//                     assignment.due_date
//                       ? format(new Date(assignment.due_date), "MMM d, h:mm a")
//                       : "Open"
//                   }
//                 />

//                 <InfoRow
//                   icon={<Award size={16} />}
//                   label="Points"
//                   value={`${assignment.points} Total`}
//                 />
//               </div>
//             </div>

//             {/* STUDENT VIEW */}
//             {!isTeacher && (
//               <div className="space-y-4 border-t flex flex-col justify-center items-center border-gray-100 pt-6">
//                 <div className="flex w-full items-center justify-between">
//                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
//                     Status
//                   </span>
//                   <Badge
//                     className={submission ? "bg-green-500" : "bg-orange-500"}
//                   >
//                     {submission ? "Turned In" : "Assigned"}
//                   </Badge>
//                 </div>

//                 {submission && submission.status === "graded" && (
//                   <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-900">
//                     <p className="text-sm font-bold uppercase tracking-wider opacity-70">
//                       Acquired Grade
//                     </p>
//                     <p className="text-5xl font-black">
//                       {submission.final_grade ?? 0}
//                       <span className="text-xl opacity-60">
//                         /{assignment.points}
//                       </span>
//                     </p>
//                   </div>
//                 )}

//                 <Button
//                   onClick={() => setShowSubmissionForm(true)}
//                   className={`h-12 w-52 border-2 border-orange-600   rounded-2xl text-base font-black shadow-lg transition-all active:scale-95 ${
//                     submission
//                     ? "bg-orange-600 text-white hover:bg-orange-700 shadow-orange-100"
//                       : "bg-white text-orange-600 border-2  hover:text-white hover:bg-orange-600"
//                   }`}
//                 >
//                   {submission ? "Update Submission" : "Add Submission"}
//                 </Button>
//               </div>
//             )}
//           </div>
//         </aside>
//       </div>

//       {/* MODAL */}
//       {showSubmissionForm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
//           <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[2rem] bg-white p-2 shadow-2xl">
//             <SubmissionForm
//               assignment={assignment}
//               submission={submission}
//               onClose={() => setShowSubmissionForm(false)}
//               onSuccess={() => {
//                 setShowSubmissionForm(false);
//                 router.refresh();
//               }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* Small reusable row */
// function InfoRow({ icon, label, value }: any) {
//   return (
//     <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
//       <span className="flex items-center gap-2 text-[10px] font-black uppercase text-orange-600">
//         {icon} {label}
//       </span>
//       <span className="text-xs font-black text-gray-900">{value}</span>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, User, ClipboardList, Clock,
  Award, CheckCircle2, BookOpen, Pencil, Trash2
} from "lucide-react";
import { toast } from "sonner";
import AttachmentButton from "@/components/class/Buttons/AttachmentButton";
import SubmissionForm from "./SubmissionForm";
import SubmissionsList from "./SubmissionsList";

export default function AssignmentDetail({
  assignment, isTeacher, submission, submissions, classId,
}: any) {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromTab = searchParams.get("from") || "stream";

  const attachments = assignment.attachment_paths || [];
  const isGraded = submission?.status === "graded";
  const isTurnedIn = !!submission;

  const getDisplayName = (path: string) => {
    const fileName = path.split("/").pop() || "File";
    return fileName.includes("-") ? fileName.split("-").slice(1).join("-") : fileName;
  };

  return (
    <div className="mx-auto flex h-full max-w-[1500px] flex-col gap-6 p-4
      lg:h-[calc(100vh-20px)] lg:p-6">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/classes/${classId}?tab=${fromTab}`)}
          className="inline-flex items-center gap-2 text-[13px] font-semibold
            text-muted-foreground hover:text-navy transition-colors
            cursor-pointer bg-transparent border-none">
          <ArrowLeft size={15} /> Back to Work
        </button>

        <div className="flex items-center gap-3">
          {isTeacher && (
            <>
              <button
                onClick={() => router.push(`/classes/${classId}/assignments/${assignment.id}/edit?from=${fromTab}`)}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold
                  tracking-widest uppercase bg-secondary text-foreground hover:bg-navy hover:text-white
                  border border-border rounded-full px-3 py-1 transition-colors cursor-pointer">
                <Pencil size={11} /> Edit
              </button>
              <button
                onClick={async () => {
                  if (!confirm("Are you sure you want to delete this assignment?")) return;
                  const { deleteAssignment } = await import('@/actions/ClassActions');
                  try {
                    await deleteAssignment(assignment.id, classId);
                    toast.success("Assignment deleted");
                    router.push(`/classes/${classId}?tab=${fromTab}`);
                  } catch (err) {
                    toast.error("Failed to delete assignment");
                  }
                }}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold
                  tracking-widest uppercase bg-red-50 text-red-600 hover:bg-red-500 hover:text-white
                  border border-red-200 rounded-full px-3 py-1 transition-colors cursor-pointer">
                <Trash2 size={11} /> Delete
              </button>
            </>
          )}
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold
            tracking-widest uppercase bg-yellow/20 text-navy border border-yellow/40
            rounded-full px-3 py-1">
            <ClipboardList size={11} /> Assignment
          </span>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-8 overflow-hidden lg:grid-cols-12">

        {/* Left */}
        <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto pr-2">

          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="shrink-0 size-12 rounded-2xl bg-navy flex items-center
              justify-center text-yellow shadow-sm">
              <ClipboardList size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-black text-[clamp(22px,3vw,36px)] tracking-tight
                leading-tight text-foreground mb-2">
                {assignment.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold
                uppercase text-muted-foreground tracking-wide">
                <span className="flex items-center gap-1.5">
                  <User size={12} className="text-navy" />
                  {assignment.users?.full_name || "Instructor"}
                </span>
                <span className="text-border">·</span>
                <span>
                  Posted {assignment.created_at
                    ? format(new Date(assignment.created_at), "MMMM d, yyyy")
                    : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <section className="flex flex-col gap-2">
            <p className="text-[10px] font-black uppercase tracking-[.25em]
              text-muted-foreground/60">
              Instructions
            </p>
            <div className="bg-white border border-border rounded-2xl p-6">
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/80">
                {assignment.description || assignment.content}
              </p>
            </div>
          </section>

          {/* Attachments */}
          {attachments.length > 0 && (
            <section className="flex flex-col gap-2">
              <p className="text-[10px] font-black uppercase tracking-[.25em]
                text-muted-foreground/60">
                Materials
              </p>
              <div className="flex flex-wrap gap-2">
                {attachments.map((path: string) => (
                  <AttachmentButton key={path} path={path} type="assignment"
                    label={getDisplayName(path)} />
                ))}
              </div>
            </section>
          )}

          {/* Teacher: submissions */}
          {isTeacher && (
            <section className="flex flex-col gap-3 border-t border-border pt-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[.25em]
                  text-muted-foreground/60">
                  Class progress
                </p>
                <span className="inline-flex items-center gap-1.5 text-[11px]
                  font-bold bg-navy text-white rounded-full px-3 py-1">
                  {submissions?.length || 0} submissions
                </span>
              </div>
              <SubmissionsList submissions={submissions} assignment={assignment}
                classId={classId} />
            </section>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="lg:col-span-4">
          <div className="flex flex-col gap-5 bg-white border border-border rounded-2xl p-6">

            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-black uppercase tracking-[.25em]
                text-muted-foreground/60">
                Details
              </p>
              <InfoRow icon={<Clock size={14} />} label="Due"
                value={assignment.due_date
                  ? format(new Date(assignment.due_date), "MMM d, h:mm a")
                  : "Open"} />
              <InfoRow icon={<Award size={14} />} label="Points"
                value={`${assignment.points} total`} />
            </div>

            {/* Student view */}
            {!isTeacher && (
              <div className="flex flex-col gap-4 border-t border-border pt-5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest
                    text-muted-foreground/60">
                    Status
                  </p>
                  <span className={`inline-flex items-center gap-1.5 text-[11px]
                    font-bold rounded-full px-3 py-1 border
                    ${isTurnedIn
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-yellow/20 text-navy border-yellow/40"
                    }`}>
                    {isTurnedIn ? <><CheckCircle2 size={11} /> Turned in</> : "Assigned"}
                  </span>
                </div>

                {isGraded && (
                  <div className="bg-navy rounded-2xl p-5 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest
                      text-white/50 mb-1">
                      Your grade
                    </p>
                    <p className="font-black text-[48px] text-yellow leading-none">
                      {submission.final_grade ?? 0}
                      <span className="text-[20px] text-white/40">/{assignment.points}</span>
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setShowSubmissionForm(true)}
                  className={`w-full inline-flex items-center justify-center gap-2
                    font-bold text-[14px] py-3 rounded-xl border-2 transition-all cursor-pointer
                    ${isTurnedIn
                      ? "bg-navy text-white border-navy hover:bg-navy/90"
                      : "bg-white text-navy border-navy hover:bg-navy hover:text-white"
                    }`}>
                  <BookOpen size={15} />
                  {isTurnedIn ? "Update submission" : "Add submission"}
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Submission modal */}
      {showSubmissionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center
          bg-navy/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <SubmissionForm
              assignment={assignment}
              submission={submission}
              onClose={() => setShowSubmissionForm(false)}
              onSuccess={() => { setShowSubmissionForm(false); router.refresh(); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between bg-secondary border border-border
      rounded-xl px-4 py-3">
      <span className="flex items-center gap-2 text-[11px] font-bold uppercase
        tracking-wide text-navy">
        {icon} {label}
      </span>
      <span className="text-[13px] font-black text-foreground">{value}</span>
    </div>
  );
}