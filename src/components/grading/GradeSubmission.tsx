"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ClipboardList,
  Sparkles,
  PenLine,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import AttachmentButton from "../class/Buttons/AttachmentButton";
import AIGradingButton from "./AIGradingButton";
import ManualGradingForm from "./ManualGradingForm";

export default function GradeSubmission({
  submission,
  classId,
}: {
  submission: any;
  classId: string;
}) {
  const [gradingMode, setGradingMode] = useState<"ai" | "manual" | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false); // New state for AI loading
  const router = useRouter();
  const supabase = createClient();

  const assignment = submission.assignments;
  const student = submission.users;
  const files = submission.files || [];

  const handleSetFinalGrade = async (type: "ai" | "manual") => {
    setIsUpdating(true);
    const scoreToUse = type === "ai" ? submission.ai_grade : submission.manual_grade;

    try {
      // FIX: Cast supabase as any to bypass the TypeScript 'never' error
      const { error } = await (supabase as any)
        .from("submissions")
        .update({ 
            final_grade: scoreToUse,
            updated_at: new Date().toISOString() 
        })
        .eq("id", submission.id);

      if (error) throw error;
      router.refresh();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-[1500px] flex-col gap-6 p-4 lg:h-[calc(100vh-20px)] lg:p-6">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="h-8 px-0 text-gray-400 hover:text-orange-600">
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>

        <div className="flex items-center gap-3">
          {submission.final_grade !== null && (
            <Badge className="bg-green-50 text-green-700 border-green-100 flex gap-1 items-center">
              <CheckCircle2 size={12} /> Final Grade: {submission.final_grade}
            </Badge>
          )}
          <Badge variant="outline" className="border-orange-200 text-orange-600 bg-orange-50 font-bold">
            Submission Detail
          </Badge>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-8 overflow-hidden lg:grid-cols-12">
        {/* LEFT: SUBMISSION VIEW */}
        <div className="lg:col-span-7 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex gap-4">
            <Avatar className="h-14 w-14 ring-2 ring-orange-100">
              <AvatarImage src={student?.avatar_url} />
              <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-xl">
                {student?.full_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-black text-gray-900 leading-none mb-2">{student?.full_name}</h1>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                <ClipboardList size={14} className="text-orange-500" />
                {assignment?.title}
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm relative">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-6">Student Response</h2>
            <p className="whitespace-pre-wrap text-xl font-medium leading-relaxed text-gray-800">
                {submission.content || "This submission has no text content."}
            </p>
          </div>

          {files.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-4">
              {files.map((file: any, i: number) => (
                <AttachmentButton key={i} path={file.url} type="assignment" label={file.name} />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: GRADING ACTIONS & COMPARISON */}
        <aside className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          
          {/* GRADE COMPARISON PANEL */}
          {(submission.ai_grade !== null || submission.manual_grade !== null) && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Finalize Grading</h3>
              <div className="flex flex-col gap-4">
                {/* AI CARD */}
                {submission.ai_grade !== null && (
                  <Card className={`p-6 rounded-[2rem] border-2 transition-all ${submission.final_grade === submission.ai_grade ? 'border-blue-500 bg-blue-50/40 shadow-blue-100/50 shadow-lg' : 'border-gray-100'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <Badge className="bg-blue-600 hover:bg-blue-600 text-white border-0 flex gap-1 py-1"><Sparkles size={12}/> AI Suggested</Badge>
                      <span className="text-3xl font-black text-gray-900">{submission.ai_grade}</span>
                    </div>
                    <p className="text-sm text-gray-600 italic mb-5 leading-snug">"{submission.ai_feedback}"</p>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 rounded-2xl h-12 font-bold transition-all" 
                      onClick={() => handleSetFinalGrade("ai")}
                      disabled={isUpdating || submission.final_grade === submission.ai_grade}
                    >
                       {submission.final_grade === submission.ai_grade ? "Currently Active" : "Apply AI Grade"}
                    </Button>
                  </Card>
                )}

                {/* MANUAL CARD */}
                {submission.manual_grade !== null && (
                  <Card className={`p-6 rounded-[2rem] border-2 transition-all ${submission.final_grade === submission.manual_grade ? 'border-orange-500 bg-orange-50/40 shadow-orange-100/50 shadow-lg' : 'border-gray-100'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <Badge className="bg-orange-600 hover:bg-orange-600 text-white border-0 flex gap-1 py-1"><PenLine size={12}/> Manual Grade</Badge>
                      <span className="text-3xl font-black text-gray-900">{submission.manual_grade}</span>
                    </div>
                    <p className="text-sm text-gray-600 italic mb-5 leading-snug">"{submission.teacher_feedback}"</p>
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700 rounded-2xl h-12 font-bold transition-all" 
                      onClick={() => handleSetFinalGrade("manual")}
                      disabled={isUpdating || submission.final_grade === submission.manual_grade}
                    >
                       {submission.final_grade === submission.manual_grade ? "Currently Active" : "Apply Manual Grade"}
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* GENERATE GRADE PANEL */}
          <div className="rounded-[3rem] border border-gray-100 bg-white p-8 shadow-sm space-y-6">
            {!gradingMode ? (
              <>
                <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase text-gray-900">Grading Methods</h3>
                    <p className="text-xs text-gray-400 font-medium">Choose how you'd like to evaluate this work</p>
                </div>
                
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => setGradingMode("ai")} 
                        className="w-full group rounded-3xl border-2 border-gray-50 p-5 text-left hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-center gap-5"
                    >
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase text-gray-900 leading-tight">AI Rubric Scan</p>
                            <p className="text-[10px] font-bold text-gray-400 tracking-wide uppercase">Automated Feedback</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => setGradingMode("manual")} 
                        className="w-full group rounded-3xl border-2 border-gray-50 p-5 text-left hover:border-orange-500 hover:bg-orange-50/30 transition-all flex items-center gap-5"
                    >
                        <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <PenLine size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase text-gray-900 leading-tight">Manual Evaluation</p>
                            <p className="text-[10px] font-bold text-gray-400 tracking-wide uppercase">Teacher Input</p>
                        </div>
                    </button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                    <Badge variant="secondary" className="px-3 py-1 font-bold text-[10px] tracking-widest uppercase">
                        {gradingMode === "ai" ? "AI Evaluation Mode" : "Manual Grading Mode"}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => setGradingMode(null)} className="text-gray-400 hover:text-red-500 font-bold h-7">Cancel</Button>
                </div>

                {gradingMode === "ai" ? (
                  <AIGradingButton 
                    submission={submission} 
                    onGradingStart={() => setIsAiProcessing(true)} // Added onGradingStart
                    onGradingComplete={() => { 
                        setIsAiProcessing(false);
                        setGradingMode(null); 
                        router.refresh(); 
                    }} 
                  />
                ) : (
                  <ManualGradingForm 
                    submission={submission} 
                    rubric={assignment?.rubrics} 
                    onCancel={() => setGradingMode(null)} 
                    onSuccess={() => { 
                        setGradingMode(null); 
                        router.refresh(); 
                    }} 
                  />
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import {
//   ArrowLeft,
//   ClipboardList,
//   Sparkles,
//   PenLine,
//   FileIcon,
//   ExternalLink,
// } from 'lucide-react'

// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// import AIGradingButton from './AIGradingButton'
// import ManualGradingForm from './ManualGradingForm'

// export default function GradeSubmission({
//   submission,
//   classId,
// }: {
//   submission: any
//   classId: string
// }) {
//   const [gradingMode, setGradingMode] = useState<'ai' | 'manual' | null>(null)
//   const router = useRouter()

//   const assignment = submission.assignments
//   const student = submission.users
//   const files = submission.files || []

//   const getInitials = (name?: string) =>
//     name
//       ?.split(' ')
//       .map(n => n[0])
//       .join('')
//       .slice(0, 2)
//       .toUpperCase() || '?'

//   const avatarSrc =
//     student?.avatar_url?.startsWith('http')
//       ? student.avatar_url
//       : student?.avatar_url
//       ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${student.avatar_url}`
//       : undefined

//   return (
//     <div className=" flex  h-full w-full flex-col gap-5 p-4 lg:h-[calc(100vh-20px)] lg:p-6">

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
//           Grading
//         </Badge>
//       </div>

//       {/* FULL WIDTH BODY */}
//       <div className="flex flex-1 gap-6 overflow-hidden flex-col lg:flex-row">

//         {/* LEFT — TAKES MAX SPACE */}
//         <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-6">

//           {/* HEADER */}
//           <div className="flex items-start gap-4">
//             <Avatar className="h-12 w-12 ring-1 ring-gray-100 shrink-0">
//               <AvatarImage
//                 src={avatarSrc}
//                 alt={student?.full_name}
//                 className="object-cover"
//               />
//               <AvatarFallback className="bg-orange-100 text-orange-700 font-bold">
//                 {getInitials(student?.full_name)}
//               </AvatarFallback>
//             </Avatar>

//             <div className="flex flex-col gap-1 min-w-0">
//               <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-gray-900 truncate">
//                 {student?.full_name || 'Student Submission'}
//               </h1>

//               <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-gray-500">
//                 <ClipboardList size={14} className="text-orange-600" />
//                 {assignment?.title}
//               </div>
//             </div>
//           </div>

//           {/* CONTENT */}
//           <section className="space-y-3">
//             <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
//               Submission Content
//             </h2>

//             <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
//               <p className="whitespace-pre-wrap text-lg font-medium leading-relaxed text-gray-700">
//                 {submission.content || 'No written submission provided.'}
//               </p>
//             </div>
//           </section>

//           {/* ATTACHMENTS */}
//           {files.length > 0 && (
//             <section className="space-y-3">
//               <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
//                 Attachments
//               </h2>

//               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
//                 {files.map((file: any, index: number) => (
//                   <a
//                     key={index}
//                     href={file.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-orange-200 hover:bg-orange-50/40"
//                   >
//                     <div className="flex items-center gap-3 overflow-hidden">
//                       <div className="rounded-lg border border-gray-100 bg-white p-2 text-gray-400 group-hover:text-orange-600">
//                         <FileIcon size={18} />
//                       </div>
//                       <span className="truncate text-sm font-bold text-gray-700">
//                         {file.name || `Attachment ${index + 1}`}
//                       </span>
//                     </div>
//                     <ExternalLink size={14} className="text-gray-300 group-hover:text-orange-400" />
//                   </a>
//                 ))}
//               </div>
//             </section>
//           )}
//         </div>

//         {/* RIGHT — COMPACT GRADING PANEL */}
//         <aside className="w-full lg:w-[420px] shrink-0">
//           <div className="flex flex-col gap-5 rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-sm">

//             {!gradingMode ? (
//               <>
//                 <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
//                   Grading Method
//                 </h3>

//                 <button
//                   onClick={() => setGradingMode('ai')}
//                   className="group rounded-[2rem] border-2 border-gray-100 bg-white p-5 text-left transition-all hover:border-blue-500 hover:shadow-md"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="h-11 w-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white">
//                       <Sparkles size={22} />
//                     </div>
//                     <div>
//                       <p className="font-black uppercase text-gray-900">
//                         AI Assisted
//                       </p>
//                       <p className="text-xs font-medium text-gray-500">
//                         Auto rubric evaluation
//                       </p>
//                     </div>
//                   </div>
//                 </button>

//                 <button
//                   onClick={() => setGradingMode('manual')}
//                   className="group rounded-[2rem] border-2 border-gray-100 bg-white p-5 text-left transition-all hover:border-orange-500 hover:shadow-md"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="h-11 w-11 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white">
//                       <PenLine size={22} />
//                     </div>
//                     <div>
//                       <p className="font-black uppercase text-gray-900">
//                         Manual Grade
//                       </p>
//                       <p className="text-xs font-medium text-gray-500">
//                         Instructor input
//                       </p>
//                     </div>
//                   </div>
//                 </button>
//               </>
//             ) : (
//               <>
//                 <div className="flex items-center justify-between border-b border-gray-100 pb-3">
//                   <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
//                     {gradingMode === 'ai' ? 'AI Evaluation' : 'Manual Entry'}
//                   </h3>
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     onClick={() => setGradingMode(null)}
//                     className="text-orange-600 font-bold text-xs"
//                   >
//                     Change
//                   </Button>
//                 </div>

//                 {gradingMode === 'ai' ? (
//                   <AIGradingButton
//                     submission={submission}
//                      onGradingStart={() => {}}
//                     onGradingComplete={() => {
//                       setGradingMode(null)
//                       router.refresh()
//                     }}
//                   />
//                 ) : (
//                   <ManualGradingForm
//                     submission={submission}
//                     rubric={assignment?.rubrics}
//                     assignment={assignment}
//                     onCancel={() => setGradingMode(null)}
//                     onSuccess={() => {
//                       setGradingMode(null)
//                       router.refresh()
//                     }}
//                   />
//                 )}
//               </>
//             )}
//           </div>
//         </aside>
//       </div>
//     </div>
//   )
// }
