// 'use client'

// import { useState, useEffect } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { Button } from '@/components/ui/button'
// import { submitAssignment } from '@/components/class/ClassActions'
// import { Loader2, CheckCircle2, AlertCircle, Award, MessageSquare, FileText, Users } from 'lucide-react'

// export default function SubmissionForm({ assignment, onClose, onSuccess }: any) {
//   const [loading, setLoading] = useState(false)
//   const [checking, setChecking] = useState(true)
//   const [submissionData, setSubmissionData] = useState<any>(null)
//   const [error, setError] = useState<string | null>(null)

//   const [content, setContent] = useState('')
//   const [files, setFiles] = useState<File[]>([])

//   const supabase = createClient()

//   useEffect(() => {
//     checkExistingSubmission()
//   }, [assignment.id])

//   async function checkExistingSubmission() {
//     try {
//       const { data: { user } } = await supabase.auth.getUser()
//       if (!user) return

//       // Start the query for this specific assignment
//       let query = supabase.from('submissions').select('*').eq('assignment_id', assignment.id)

//       if (assignment.is_group_project) {
//         // 1. Fetch the Group ID for the CURRENT user viewing the form
//         const { data: memberData } = await supabase
//           .from('project_members')
//           .select('project_id')
//           .eq('user_id', user.id)
//           .maybeSingle()
//       const projectId = (memberData as any).project_id;
//         if (projectId) {
//           // 2. Filter by group_id so all members see the same submission record
//           query = query.eq('group_id', projectId)
//         } else {
//           setChecking(false)
//           return
//         }
//       } else {
//         // Individual project: Filter by the logged-in user's ID
//         query = query.eq('user_id', user.id)
//       }

//       const { data: existing } = await query.maybeSingle()

//       if (existing) {
//         setSubmissionData(existing)
//       }

//     } catch (err) {
//       console.error("Check error:", err)
//     } finally {
//       setChecking(false)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)

//     try {
//       const { data: { user } } = await supabase.auth.getUser()
//       if (!user) throw new Error('Not authenticated')

//       let groupId = null

//       // Ensure we have the group ID if this is a team project
//       if (assignment.is_group_project) {
//         const { data: memberData } = await supabase
//           .from('project_members')
//           .select('project_id')
//           .eq('user_id', user.id)
//           .maybeSingle()

//         if (!memberData) throw new Error("You are not part of a group for this project.")
//         groupId = (memberData as any).project_id
//       }

//       let uploadedFiles: any[] = []
//       for (const file of files) {
//         const filePath = `submissions/${assignment.id}/${user.id}/${Date.now()}-${file.name}`
//         const { error: uploadError } = await supabase.storage.from('assignments').upload(filePath, file)
//         if (uploadError) throw uploadError

//         const { data: { publicUrl } } = supabase.storage.from('assignments').getPublicUrl(filePath)
//         uploadedFiles.push({ name: file.name, url: publicUrl })
//       }

//       // Pass groupId to the server action to link the row to the whole team
//       await submitAssignment({
//         assignmentId: assignment.id,
//         userId: user.id,
//         groupId: groupId, 
//         content: assignment.submission_type !== 'file' ? content : undefined,
//         files: uploadedFiles,
//         isGroupProject: assignment.is_group_project
//       })

//       onSuccess()
//       checkExistingSubmission() // Refresh local state to show "Submitted" view
//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (checking) {
//     return (
//       <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl min-w-[400px]">
//         <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-4" />
//         <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Updating Status...</span>
//       </div>
//     )
//   }

//   // View state for already submitted assignments (Individual or Group)
//   if (submissionData) {
//     // Map 'final_grade' from DB to your 'grade' variable
//     const grade = submissionData.final_grade 
//     const isGraded = submissionData.status === 'graded' || grade !== null

//     return (
//       <div className="overflow-hidden bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full mx-auto">
//         <div className={`p-5 flex items-center justify-between ${isGraded ? 'bg-indigo-600' : 'bg-emerald-500'} text-white`}>
//           <div className="flex items-center gap-2">
//             <CheckCircle2 size={20} />
//             <span className="font-bold text-sm uppercase tracking-wider">
//               {isGraded ? 'Assessment Complete' : 'Work Turned In'}
//             </span>
//           </div>
//           {assignment.is_group_project && (
//             <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded text-[10px] font-bold uppercase">
//               <Users size={12} /> Team
//             </div>
//           )}
//         </div>

//         <div className="p-8 text-center space-y-6">
//           {isGraded ? (
//             <div className="space-y-4">
//               <div className="relative inline-block">
//                 <div className="h-24 w-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center border-4 border-indigo-100 mx-auto">
//                   <Award size={48} />
//                 </div>
//               </div>
//               <div>
//                 <h2 className="text-3xl font-black text-slate-900">{grade} / {assignment.points}</h2>
//                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Points Earned</p>
//               </div>

//               {submissionData.feedback && (
//                 <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100 relative">
//                   <MessageSquare className="absolute right-4 top-4 text-slate-200" size={20} />
//                   <p className="text-[10px] font-bold text-indigo-600 uppercase mb-1">Feedback</p>
//                   <p className="text-sm text-slate-600 leading-relaxed italic">"{submissionData.feedback}"</p>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
//                 <FileText size={32} />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-slate-900">Submitted & Pending</h3>
//                 <p className="text-sm text-slate-500 mt-2 leading-relaxed">
//                   {assignment.is_group_project 
//                     ? "Your team's work has been received. You will see the grade here once the teacher finishes review." 
//                     : "Your work is in the queue! Your teacher will review and grade it soon."}
//                 </p>
//               </div>
//             </div>
//           )}

//           <div className="pt-4 border-t border-slate-50">
//             <Button variant="outline" className="w-full rounded-xl" onClick={onClose}>
//               Close
//             </Button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-xl shadow-lg border border-slate-100 max-w-lg w-full">
//       <div className="flex items-center justify-between border-b border-slate-50 pb-4">
//         <h3 className="font-bold text-slate-900">
//           {assignment.is_group_project ? "Group Submission" : "Individual Submission"}
//         </h3>
//       </div>

//       {assignment.is_group_project && (
//         <div className="flex gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
//           <AlertCircle className="text-amber-600 shrink-0" size={18} />
//           <p className="text-[11px] text-amber-800">
//             <strong>Team Project:</strong> Only one member needs to submit. The grade will automatically appear for all members.
//           </p>
//         </div>
//       )}

//       <div className="space-y-2">
//         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Content</label>
//         <textarea 
//           className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[140px] bg-slate-50/30" 
//           value={content} 
//           onChange={e => setContent(e.target.value)} 
//           placeholder="Enter submission details..."
//         />
//       </div>

//       <div className="space-y-2">
//         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attachments</label>
//         <input 
//           type="file" 
//           multiple 
//           className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-indigo-50 file:text-indigo-700"
//           onChange={e => setFiles(Array.from(e.target.files || []))} 
//         />
//       </div>

//       {error && (
//         <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg flex items-center gap-2 border border-red-100">
//           <AlertCircle size={14} /> {error}
//         </div>
//       )}

//       <div className="flex gap-3 pt-2">
//         <Button 
//           type="submit" 
//           disabled={loading}
//           className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl"
//         >
//           {loading ? <Loader2 className="animate-spin" size={20} /> : 'Submit Work'}
//         </Button>
//         <Button variant="outline" onClick={onClose} className="h-12 rounded-xl px-6">
//           Cancel
//         </Button>
//       </div>
//     </form>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { submitAssignment } from '@/actions/ClassActions'
import {
  Loader2, CheckCircle2, AlertCircle, Award,
  MessageSquare, FileText, Users, Paperclip, X, UploadCloud,
} from 'lucide-react'
import { toast } from 'sonner'

export default function SubmissionForm({ assignment, onClose, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [submissionData, setSubmissionData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const supabase = createClient()

  useEffect(() => { checkExistingSubmission() }, [assignment.id])

  async function checkExistingSubmission() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      let query = supabase.from('submissions').select('id, assignment_id, user_id, final_grade, status, feedback, group_id').eq('assignment_id', assignment.id)

      if (assignment.is_group_project) {
        const { data: memberData } = await supabase
          .from('project_members').select('project_id')
          .eq('user_id', user.id).maybeSingle()
        const projectId = (memberData as any)?.project_id
        if (projectId) query = query.eq('group_id', projectId)
        else { setChecking(false); return }
      } else {
        query = query.eq('user_id', user.id)
      }

      const { data: existing } = await query.maybeSingle()
      if (existing) setSubmissionData(existing)
    } catch (err) {
      console.error('Check error:', err)
    } finally {
      setChecking(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let groupId = null
      if (assignment.is_group_project) {
        const { data: memberData } = await supabase
          .from('project_members').select('project_id')
          .eq('user_id', user.id).maybeSingle()
        if (!memberData) throw new Error('You are not part of a group for this project.')
        groupId = (memberData as any).project_id
      }

      const uploadedFiles: any[] = []
      for (const file of files) {
        const filePath = `submissions/${assignment.id}/${user.id}/${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage.from('assignments').upload(filePath, file)
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from('assignments').getPublicUrl(filePath)
        uploadedFiles.push({ name: file.name, url: publicUrl })
      }

      await submitAssignment({
        assignmentId: assignment.id,
        userId: user.id,
        groupId,
        content: assignment.submission_type !== 'file' ? content : undefined,
        files: uploadedFiles,
        isGroupProject: assignment.is_group_project,
      })

      toast.success("Work submitted successfully")
      onSuccess()
      checkExistingSubmission()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ── Checking ── */
  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-12 bg-white rounded-2xl">
        <Loader2 className="animate-spin text-navy" size={24} />
        <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
          Checking status…
        </span>
      </div>
    )
  }

  /* ── Already submitted ── */
  if (submissionData) {
    const grade = submissionData.final_grade
    const isGraded = submissionData.status === 'graded' || grade !== null

    return (
      <div className="bg-white rounded-2xl overflow-hidden max-w-md w-full mx-auto">

        {/* Status banner */}
        <div className={`flex items-center justify-between px-6 py-4
          ${isGraded ? 'bg-navy' : 'bg-green-500'} text-white`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={17} />
            <span className="font-bold text-[13px] uppercase tracking-wider">
              {isGraded ? 'Assessment complete' : 'Work turned in'}
            </span>
          </div>
          {assignment.is_group_project && (
            <span className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-1
              rounded-full text-[10px] font-bold uppercase">
              <Users size={11} /> Team
            </span>
          )}
        </div>

        <div className="p-8 flex flex-col items-center gap-6 text-center">
          {isGraded ? (
            <>
              {/* Grade display */}
              <div className="bg-navy rounded-2xl px-10 py-6 flex flex-col items-center gap-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                  Points earned
                </p>
                <p className="font-black text-[52px] text-yellow leading-none">
                  {grade}
                  <span className="text-[22px] text-white/40">/{assignment.points}</span>
                </p>
              </div>

              {submissionData.feedback && (
                <div className="w-full bg-secondary border border-border rounded-2xl p-5 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={13} className="text-navy" />
                    <p className="text-[11px] font-bold uppercase tracking-widest text-navy">
                      Feedback
                    </p>
                  </div>
                  <p className="text-[13px] text-foreground/80 leading-relaxed italic">
                    "{submissionData.feedback}"
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="size-16 rounded-2xl bg-green-50 border border-green-200
                flex items-center justify-center">
                <FileText size={28} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-black text-[18px] tracking-tight">Submitted & pending</h3>
                <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed max-w-xs">
                  {assignment.is_group_project
                    ? "Your team's work has been received. You'll see the grade here once the teacher finishes review."
                    : "Your work is in! Your teacher will review and grade it soon."}
                </p>
              </div>
            </>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 font-semibold text-[14px] text-muted-foreground
              border border-border rounded-xl hover:text-foreground hover:border-navy/30
              transition cursor-pointer bg-white">
            Close
          </button>
        </div>
      </div>
    )
  }

  /* ── Submission form ── */
  return (
    <form onSubmit={handleSubmit}
      className="flex flex-col gap-5 p-6 bg-white rounded-2xl max-w-lg w-full">

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="font-black text-[16px] tracking-tight">
          {assignment.is_group_project ? 'Group submission' : 'Your submission'}
        </h3>
        <button type="button" onClick={onClose}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary
            rounded-lg transition cursor-pointer bg-transparent border-none">
          <X size={15} />
        </button>
      </div>

      {/* Group notice */}
      {assignment.is_group_project && (
        <div className="flex gap-3 p-4 bg-yellow/10 border border-yellow/40 rounded-xl">
          <AlertCircle size={16} className="text-navy shrink-0 mt-0.5" />
          <p className="text-[12px] text-navy leading-relaxed">
            <strong>Team project:</strong> Only one member needs to submit. The grade
            will automatically appear for all members.
          </p>
        </div>
      )}

      {/* Content textarea */}
      {assignment.submission_type !== 'file' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">
            Response
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your submission details…"
            rows={5}
            className="w-full resize-none bg-white border border-border rounded-xl px-4 py-3
              text-[14px] text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition"
          />
        </div>
      )}

      {/* File upload */}
      {assignment.submission_type !== 'text' && (
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">
            Attachments
          </label>
          <label className="relative flex items-center gap-3 border-2 border-dashed
            border-border rounded-xl px-4 h-12 cursor-pointer hover:border-navy/30
            hover:bg-secondary/50 transition">
            <UploadCloud size={15} className="text-muted-foreground" />
            <span className="text-[13px] text-muted-foreground">Upload files</span>
            <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => e.target.files && setFiles([...files, ...Array.from(e.target.files)])} />
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
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200
          text-red-600 text-[13px] font-semibold px-4 py-3 rounded-xl">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center gap-2
            bg-navy text-white font-bold text-[14px] py-3 rounded-xl
            hover:bg-navy/90 transition disabled:opacity-60 cursor-pointer border-none">
          {loading ? <><Loader2 size={15} className="animate-spin" />Submitting…</> : 'Submit work'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 font-semibold text-[14px] text-muted-foreground
            border border-border rounded-xl hover:text-foreground hover:border-navy/30
            transition cursor-pointer bg-white">
          Cancel
        </button>
      </div>
    </form>
  )
}
