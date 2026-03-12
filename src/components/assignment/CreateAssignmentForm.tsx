
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Paperclip, X, UploadCloud, Loader2,
//   Settings2, Users, Calendar, Award, FileText, AlignLeft,
// } from "lucide-react";
// import { createAssignment } from "@/components/class/ClassActions";
// import { Checkbox } from "@/components/ui/checkbox";

// const inputClass = `w-full bg-white border border-border rounded-xl px-4 py-3
//   text-[14px] text-foreground placeholder:text-muted-foreground
//   focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition`;

// const labelClass = `text-[11px] font-bold tracking-[.18em] uppercase text-navy`;

// export default function CreateAssignmentForm({ classId, userId, rubrics }: any) {
//   const router  = useRouter();
//   const [loading,        setLoading]        = useState(false);
//   const [files,          setFiles]          = useState<File[]>([]);
//   const [isGroupProject, setIsGroupProject] = useState(false);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     const formData = new FormData(e.currentTarget);
//     formData.append("classId", classId);
//     formData.append("isGroupProject", String(isGroupProject));
//     files.forEach((file) => formData.append("files", file));

//     try {
//       const result = await createAssignment(formData);
//       if (result.success) {
//         router.push(`/classes/${classId}/assignments/${result.id}`);
//         router.refresh();
//       }
//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">

//       {/* Left — content */}
//       <div className="flex-1 flex flex-col gap-5 w-full">

//         {/* Title */}
//         <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
//           <div className="flex items-center gap-2">
//             <FileText size={14} className="text-navy" />
//             <label htmlFor="title" className={labelClass}>Title</label>
//           </div>
//           <input id="title" name="title" required
//             placeholder="Assignment title"
//             className={inputClass} />
//         </div>

//         {/* Instructions */}
//         <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
//           <div className="flex items-center gap-2">
//             <AlignLeft size={14} className="text-navy" />
//             <label htmlFor="description" className={labelClass}>Instructions</label>
//           </div>
//           <textarea id="description" name="description"
//             placeholder="What should students do?"
//             rows={5}
//             className={`${inputClass} resize-none`} />
//         </div>

//         {/* Attachments */}
//         <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
//           <div className="flex items-center gap-2">
//             <Paperclip size={14} className="text-navy" />
//             <span className={labelClass}>Attachments</span>
//           </div>

//           <label className="relative flex items-center gap-3 border-2 border-dashed
//             border-border rounded-xl px-4 h-12 cursor-pointer hover:border-navy/30
//             hover:bg-secondary/50 transition">
//             <UploadCloud size={15} className="text-muted-foreground" />
//             <span className="text-[13px] text-muted-foreground">
//               Click to upload reference files
//             </span>
//             <input type="file" multiple
//               className="absolute inset-0 opacity-0 cursor-pointer"
//               onChange={(e) =>
//                 e.target.files && setFiles([...files, ...Array.from(e.target.files)])
//               } />
//           </label>

//           {files.length > 0 && (
//             <div className="flex flex-wrap gap-2">
//               {files.map((file, i) => (
//                 <div key={i} className="inline-flex items-center gap-2 bg-secondary
//                   border border-border rounded-lg px-3 py-1.5 text-[12px] font-medium">
//                   <Paperclip size={11} className="text-navy" />
//                   <span className="truncate max-w-[140px]">{file.name}</span>
//                   <button type="button"
//                     onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
//                     className="text-muted-foreground hover:text-red-500 transition
//                       cursor-pointer bg-transparent border-none">
//                     <X size={12} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Right — config */}
//       <div className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
//         <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-5">

//           <div className="flex items-center gap-2 pb-3 border-b border-border">
//             <Settings2 size={13} className="text-navy" />
//             <span className="text-[11px] font-black uppercase tracking-[.18em] text-navy">
//               Config
//             </span>
//           </div>

//           {/* Group project toggle */}
//           <div className="flex items-center justify-between py-2 px-3 bg-secondary
//             border border-border rounded-xl">
//             <div className="flex items-center gap-2">
//               <Users size={13} className={isGroupProject ? "text-navy" : "text-muted-foreground"} />
//               <label htmlFor="isGroupProject"
//                 className="text-[12px] font-semibold text-foreground cursor-pointer">
//                 Group project
//               </label>
//             </div>
//             <Checkbox
//               id="isGroupProject"
//               checked={isGroupProject}
//               onCheckedChange={(checked) => setIsGroupProject(!!checked)}
//               className="data-[state=checked]:bg-navy data-[state=checked]:border-navy"
//             />
//           </div>

//           {/* Due date */}
//           <div className="flex flex-col gap-1.5">
//             <label htmlFor="dueDate"
//               className="flex items-center gap-1.5 text-[11px] font-bold
//               tracking-[.18em] uppercase text-navy">
//               <Calendar size={11} /> Due date
//             </label>
//             <input id="dueDate" name="dueDate" type="datetime-local"
//               className={`${inputClass} text-[13px] py-2`} />
//           </div>

//           {/* Points */}
//           <div className="flex flex-col gap-1.5">
//             <label htmlFor="points"
//               className="flex items-center gap-1.5 text-[11px] font-bold
//               tracking-[.18em] uppercase text-navy">
//               <Award size={11} /> Points
//             </label>
//             <input id="points" name="points" type="number" defaultValue="100"
//               className={`${inputClass} text-[13px] py-2`} />
//           </div>

//           {/* Submission type */}
//           <div className="flex flex-col gap-1.5">
//             <label htmlFor="submissionType"
//               className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">
//               Submission type
//             </label>
//             <select name="submissionType"
//               className={`${inputClass} text-[13px] py-2 cursor-pointer`}>
//               <option value="file">File upload</option>
//               <option value="text">Online text</option>
//               <option value="both">Both</option>
//             </select>
//           </div>

//           {/* Rubric */}
//           <div className="flex flex-col gap-1.5">
//             <label htmlFor="rubricId"
//               className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">
//               Rubric
//             </label>
//             <select name="rubricId"
//               className={`${inputClass} text-[13px] py-2 cursor-pointer`}>
//               <option value="">None</option>
//               {rubrics.map((r: any) => (
//                 <option key={r.id} value={r.id}>{r.name}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <button type="submit" disabled={loading}
//           className="w-full inline-flex items-center justify-center gap-2
//             bg-navy text-white font-bold text-[14px] py-3 rounded-xl
//             hover:bg-navy/90 hover:-translate-y-0.5 transition-all shadow-sm
//             disabled:opacity-60 disabled:translate-y-0 cursor-pointer border-none">
//           {loading
//             ? <><Loader2 size={15} className="animate-spin" />Creating...</>
//             : "Create assignment"
//           }
//         </button>
//       </div>
//     </form>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Paperclip, X, UploadCloud, Loader2,
  Settings2, Users, Calendar, Award, FileText, AlignLeft,
} from "lucide-react";
import { createAssignment, updateAssignment } from "@/actions/ClassActions";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const inputClass = `w-full bg-white border border-border rounded-xl px-4 py-3
  text-[14px] text-foreground placeholder:text-muted-foreground
  focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition`;
const labelClass = `text-[11px] font-bold tracking-[.18em] uppercase text-navy`;

interface InitialData {
  id: string; title: string; description?: string; due_date?: string;
  points?: number; submission_type?: string; rubric_id?: string;
  is_group_project?: boolean; attachments?: { name: string; url: string }[];
}

export default function CreateAssignmentForm({ classId, userId, rubrics, initialData }: {
  classId: string; userId: string; rubrics: any[]; initialData?: InitialData;
}) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [loading, setLoading] = useState(false);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<{ name: string; url: string }[]>(initialData?.attachments || []);
  const [isGroupProject, setIsGroupProject] = useState(initialData?.is_group_project || false);

  const defaultDueDate = initialData?.due_date
    ? new Date(initialData.due_date).toISOString().slice(0, 16) : '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("classId", classId);
    formData.append("isGroupProject", String(isGroupProject));
    newFiles.forEach((file) => formData.append("files", file));
    try {
      if (isEditing && initialData) {
        formData.append("assignmentId", initialData.id);
        formData.append("existingAttachments", JSON.stringify(existingFiles));
        const result = await updateAssignment(formData);
        if (result.success) { 
          toast.success("Assignment updated successfully");
          router.push(`/classes/${classId}/assignments/${result.id}`); 
          router.refresh(); 
        }
      } else {
        const result = await createAssignment(formData);
        if (result.success) { 
          toast.success("Assignment created successfully");
          router.push(`/classes/${classId}/assignments/${result.id}`); 
          router.refresh(); 
        }
      }
    } catch (err: any) { toast.error(err.message || "Failed to save assignment"); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">

      {/* Left */}
      <div className="flex-1 flex flex-col gap-5 w-full">

        <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2"><FileText size={14} className="text-navy" /><label htmlFor="title" className={labelClass}>Title</label></div>
          <input id="title" name="title" required defaultValue={initialData?.title || ''} placeholder="Assignment title" className={inputClass} />
        </div>

        <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2"><AlignLeft size={14} className="text-navy" /><label htmlFor="description" className={labelClass}>Instructions</label></div>
          <textarea id="description" name="description" defaultValue={initialData?.description || ''} placeholder="What should students do?" rows={5} className={`${inputClass} resize-none`} />
        </div>

        <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2"><Paperclip size={14} className="text-navy" /><span className={labelClass}>Attachments</span></div>
          <label className="relative flex items-center gap-3 border-2 border-dashed border-border rounded-xl px-4 h-12 cursor-pointer hover:border-navy/30 hover:bg-secondary/50 transition">
            <UploadCloud size={15} className="text-muted-foreground" />
            <span className="text-[13px] text-muted-foreground">Click to upload reference files</span>
            <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => e.target.files && setNewFiles([...newFiles, ...Array.from(e.target.files)])} />
          </label>
          {existingFiles.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current files</p>
              <div className="flex flex-wrap gap-2">
                {existingFiles.map((file, i) => (
                  <div key={i} className="inline-flex items-center gap-2 bg-secondary border border-border rounded-lg px-3 py-1.5 text-[12px] font-medium">
                    <Paperclip size={11} className="text-navy" />
                    <span className="truncate max-w-[140px]">{file.name}</span>
                    <button type="button" onClick={() => setExistingFiles(existingFiles.filter((_, idx) => idx !== i))}
                      className="text-muted-foreground hover:text-red-500 transition cursor-pointer bg-transparent border-none"><X size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {newFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {newFiles.map((file, i) => (
                <div key={i} className="inline-flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-1.5 text-[12px] font-medium">
                  <Paperclip size={11} className="text-navy-light" />
                  <span className="truncate max-w-[140px]">{file.name}</span>
                  <button type="button" onClick={() => setNewFiles(newFiles.filter((_, idx) => idx !== i))}
                    className="text-muted-foreground hover:text-red-500 transition cursor-pointer bg-transparent border-none"><X size={12} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
        <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Settings2 size={13} className="text-navy" />
            <span className="text-[11px] font-black uppercase tracking-[.18em] text-navy">Config</span>
          </div>
          <div className="flex items-center justify-between py-2 px-3 bg-secondary border border-border rounded-xl">
            <div className="flex items-center gap-2">
              <Users size={13} className={isGroupProject ? "text-navy" : "text-muted-foreground"} />
              <label htmlFor="isGroupProject" className="text-[12px] font-semibold text-foreground cursor-pointer">Group project</label>
            </div>
            <Checkbox id="isGroupProject" checked={isGroupProject} onCheckedChange={(c) => setIsGroupProject(!!c)}
              className="data-[state=checked]:bg-navy data-[state=checked]:border-navy" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="dueDate" className="flex items-center gap-1.5 text-[11px] font-bold tracking-[.18em] uppercase text-navy">
              <Calendar size={11} /> Due date
            </label>
            <input id="dueDate" name="dueDate" type="datetime-local" defaultValue={defaultDueDate} className={`${inputClass} text-[13px] py-2`} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="points" className="flex items-center gap-1.5 text-[11px] font-bold tracking-[.18em] uppercase text-navy">
              <Award size={11} /> Points
            </label>
            <input id="points" name="points" type="number" defaultValue={initialData?.points ?? 100} className={`${inputClass} text-[13px] py-2`} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="submissionType" className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">Submission type</label>
            <select name="submissionType" defaultValue={initialData?.submission_type || 'file'} className={`${inputClass} text-[13px] py-2 cursor-pointer`}>
              <option value="file">File upload</option>
              <option value="text">Online text</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="rubricId" className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">Rubric</label>
            <select name="rubricId" defaultValue={initialData?.rubric_id || ''} className={`${inputClass} text-[13px] py-2 cursor-pointer`}>
              <option value="">None</option>
              {rubrics.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-navy text-white font-bold text-[14px] py-3 rounded-xl hover:bg-navy/90 hover:-translate-y-0.5 transition-all shadow-sm disabled:opacity-60 disabled:translate-y-0 cursor-pointer border-none">
          {loading
            ? <><Loader2 size={15} className="animate-spin" />{isEditing ? 'Saving…' : 'Creating…'}</>
            : isEditing ? 'Save changes' : 'Create assignment'
          }
        </button>
      </div>
    </form>
  );
}