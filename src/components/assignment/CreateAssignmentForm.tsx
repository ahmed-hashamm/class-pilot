// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// // Added Users icon for the group project label
// import { Paperclip, X, UploadCloud, Loader2, Settings2, Users } from 'lucide-react' 
// import { createAssignment } from '@/components/class/ClassActions'
// import { Checkbox } from '@/components/ui/checkbox' // Assuming you have a UI checkbox, otherwise use a standard input

// export default function CreateAssignmentForm({ classId, userId, rubrics }: any) {
//   const router = useRouter()
//   const [loading, setLoading] = useState(false)
//   const [files, setFiles] = useState<File[]>([])
//   // State to track the group project toggle
//   const [isGroupProject, setIsGroupProject] = useState(false)

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setLoading(true)
//     const formData = new FormData(e.currentTarget)
//     formData.append('classId', classId)
//     // Manually append the boolean as a string for the server action
//     formData.append('isGroupProject', String(isGroupProject)) 
    
//     files.forEach(file => formData.append('files', file))

//     try {
//       const result = await createAssignment(formData)
//       if (result.success) {
//         router.push(`/classes/${classId}/assignments/${result.id}`)
//         router.refresh()
//       }
//     } catch (err: any) {
//       alert(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-12 items-start">
      
//       {/* LEFT COLUMN: Main Info */}
//       <div className="flex-1 space-y-5 w-full">
//         {/* ... (Keep your existing Title, Description, and File logic here) */}
        
//         {/* Existing Title/Description/Files blocks... */}
//         <div className="space-y-1">
//           <Label htmlFor="title" className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Title</Label>
//           <Input id="title" name="title" required placeholder="Assignment Title" className="text-lg h-11 border-gray-200 rounded-lg focus-visible:ring-orange-500 transition-all" />
//         </div>

//         <div className="space-y-1">
//           <Label htmlFor="description" className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Instructions</Label>
//           <Textarea id="description" name="description" placeholder="What should students do?..." className="min-h-[100px] max-h-[140px] border-gray-200 rounded-lg p-3 focus:ring-orange-500 text-sm" />
//         </div>

//         <div className="space-y-1">
//           <Label className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Attachments</Label>
//           <div className="flex items-center gap-3">
//             <div className="relative flex-1 group">
//               <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50/30 px-4 h-11 transition-all hover:border-orange-400">
//                 <UploadCloud className="h-4 w-4 text-gray-400" />
//                 <span className="text-xs text-gray-500">Upload reference files</span>
//               </div>
//               <input type="file" multiple className="absolute inset-0 cursor-pointer opacity-0" onChange={(e) => e.target.files && setFiles([...files, ...Array.from(e.target.files)])} />
//             </div>
//           </div>
//           <div className="flex flex-wrap gap-2 pt-1">
//             {files.map((file, i) => (
//               <div key={i} className="flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50/30 px-3 py-1 text-[10px] font-medium text-orange-700">
//                 <Paperclip className="h-3 w-3" />
//                 <span className="truncate max-w-[120px]">{file.name}</span>
//                 <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="hover:text-red-500"><X size={12} /></button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* RIGHT COLUMN: Settings */}
//       <div className="w-full lg:w-64 shrink-0">
//         <div className="border border-gray-100 rounded-xl p-5 space-y-5 bg-white shadow-sm">
//           <div className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-widest text-gray-400 pb-2 border-b border-gray-50">
//             <Settings2 size={14} />
//             Config
//           </div>

//           <div className="space-y-4">
//             {/* NEW: Group Project Toggle */}
//             <div className="flex items-center justify-between p-2 rounded-lg border border-gray-50 bg-gray-50/30">
//               <div className="flex items-center gap-2">
//                 <Users size={14} className={isGroupProject ? "text-orange-500" : "text-gray-400"} />
//                 <Label htmlFor="isGroupProject" className="text-[10px] font-bold text-gray-500 uppercase cursor-pointer">Group Project</Label>
//               </div>
//               <Checkbox 
//                 id="isGroupProject" 
//                 checked={isGroupProject} 
//                 onCheckedChange={(checked) => setIsGroupProject(!!checked)}
//                 className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
//               />
//             </div>

//             <div className="space-y-1">
//               <Label htmlFor="dueDate" className="text-[10px] font-bold text-gray-500 uppercase">Due Date</Label>
//               <Input id="dueDate" name="dueDate" type="datetime-local" className="rounded-md border-gray-200 h-9 text-xs focus-visible:ring-orange-500" />
//             </div>

//             <div className="space-y-1">
//               <Label htmlFor="points" className="text-[10px] font-bold text-gray-500 uppercase">Points</Label>
//               <Input id="points" name="points" type="number" defaultValue="100" className="rounded-md border-gray-200 h-9 text-xs focus-visible:ring-orange-500" />
//             </div>

//             <div className="space-y-1">
//               <Label htmlFor="submissionType" className="text-[10px] font-bold text-gray-500 uppercase">Submission</Label>
//               <select name="submissionType" className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-[11px] focus:ring-1 focus:ring-orange-500 outline-none">
//                 <option value="file">File Upload</option>
//                 <option value="text">Online Text</option>
//                 <option value="both">Both</option>
//               </select>
//             </div>

//             <div className="space-y-1">
//               <Label htmlFor="rubricId" className="text-[10px] font-bold text-gray-500 uppercase">Rubric</Label>
//               <select name="rubricId" className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-[11px] focus:ring-1 focus:ring-orange-500 outline-none">
//                 <option value="">None</option>
//                 {rubrics.map((r: any) => (
//                   <option key={r.id} value={r.id}>{r.name}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <Button 
//             type="submit" 
//             className="w-full bg-orange-500 hover:bg-orange-600 text-white h-10 font-bold rounded-lg transition-all shadow-md shadow-orange-100" 
//             disabled={loading}
//           >
//             {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
//           </Button>
//         </div>
//       </div>
//     </form>
//   )
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Paperclip, X, UploadCloud, Loader2,
  Settings2, Users, Calendar, Award, FileText, AlignLeft,
} from "lucide-react";
import { createAssignment } from "@/components/class/ClassActions";
import { Checkbox } from "@/components/ui/checkbox";

const inputClass = `w-full bg-white border border-border rounded-xl px-4 py-3
  text-[14px] text-foreground placeholder:text-muted-foreground
  focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition`;

const labelClass = `text-[11px] font-bold tracking-[.18em] uppercase text-navy`;

export default function CreateAssignmentForm({ classId, userId, rubrics }: any) {
  const router  = useRouter();
  const [loading,        setLoading]        = useState(false);
  const [files,          setFiles]          = useState<File[]>([]);
  const [isGroupProject, setIsGroupProject] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("classId", classId);
    formData.append("isGroupProject", String(isGroupProject));
    files.forEach((file) => formData.append("files", file));

    try {
      const result = await createAssignment(formData);
      if (result.success) {
        router.push(`/classes/${classId}/assignments/${result.id}`);
        router.refresh();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">

      {/* Left — content */}
      <div className="flex-1 flex flex-col gap-5 w-full">

        {/* Title */}
        <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-navy" />
            <label htmlFor="title" className={labelClass}>Title</label>
          </div>
          <input id="title" name="title" required
            placeholder="Assignment title"
            className={inputClass} />
        </div>

        {/* Instructions */}
        <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <AlignLeft size={14} className="text-navy" />
            <label htmlFor="description" className={labelClass}>Instructions</label>
          </div>
          <textarea id="description" name="description"
            placeholder="What should students do?"
            rows={5}
            className={`${inputClass} resize-none`} />
        </div>

        {/* Attachments */}
        <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Paperclip size={14} className="text-navy" />
            <span className={labelClass}>Attachments</span>
          </div>

          <label className="relative flex items-center gap-3 border-2 border-dashed
            border-border rounded-xl px-4 h-12 cursor-pointer hover:border-navy/30
            hover:bg-secondary/50 transition">
            <UploadCloud size={15} className="text-muted-foreground" />
            <span className="text-[13px] text-muted-foreground">
              Click to upload reference files
            </span>
            <input type="file" multiple
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) =>
                e.target.files && setFiles([...files, ...Array.from(e.target.files)])
              } />
          </label>

          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((file, i) => (
                <div key={i} className="inline-flex items-center gap-2 bg-secondary
                  border border-border rounded-lg px-3 py-1.5 text-[12px] font-medium">
                  <Paperclip size={11} className="text-navy" />
                  <span className="truncate max-w-[140px]">{file.name}</span>
                  <button type="button"
                    onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                    className="text-muted-foreground hover:text-red-500 transition
                      cursor-pointer bg-transparent border-none">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right — config */}
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
        <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-5">

          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Settings2 size={13} className="text-navy" />
            <span className="text-[11px] font-black uppercase tracking-[.18em] text-navy">
              Config
            </span>
          </div>

          {/* Group project toggle */}
          <div className="flex items-center justify-between py-2 px-3 bg-secondary
            border border-border rounded-xl">
            <div className="flex items-center gap-2">
              <Users size={13} className={isGroupProject ? "text-navy" : "text-muted-foreground"} />
              <label htmlFor="isGroupProject"
                className="text-[12px] font-semibold text-foreground cursor-pointer">
                Group project
              </label>
            </div>
            <Checkbox
              id="isGroupProject"
              checked={isGroupProject}
              onCheckedChange={(checked) => setIsGroupProject(!!checked)}
              className="data-[state=checked]:bg-navy data-[state=checked]:border-navy"
            />
          </div>

          {/* Due date */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="dueDate"
              className="flex items-center gap-1.5 text-[11px] font-bold
              tracking-[.18em] uppercase text-navy">
              <Calendar size={11} /> Due date
            </label>
            <input id="dueDate" name="dueDate" type="datetime-local"
              className={`${inputClass} text-[13px] py-2`} />
          </div>

          {/* Points */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="points"
              className="flex items-center gap-1.5 text-[11px] font-bold
              tracking-[.18em] uppercase text-navy">
              <Award size={11} /> Points
            </label>
            <input id="points" name="points" type="number" defaultValue="100"
              className={`${inputClass} text-[13px] py-2`} />
          </div>

          {/* Submission type */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="submissionType"
              className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">
              Submission type
            </label>
            <select name="submissionType"
              className={`${inputClass} text-[13px] py-2 cursor-pointer`}>
              <option value="file">File upload</option>
              <option value="text">Online text</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* Rubric */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="rubricId"
              className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">
              Rubric
            </label>
            <select name="rubricId"
              className={`${inputClass} text-[13px] py-2 cursor-pointer`}>
              <option value="">None</option>
              {rubrics.map((r: any) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2
            bg-navy text-white font-bold text-[14px] py-3 rounded-xl
            hover:bg-navy/90 hover:-translate-y-0.5 transition-all shadow-sm
            disabled:opacity-60 disabled:translate-y-0 cursor-pointer border-none">
          {loading
            ? <><Loader2 size={15} className="animate-spin" />Creating...</>
            : "Create assignment"
          }
        </button>
      </div>
    </form>
  );
}