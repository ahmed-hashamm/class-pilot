// 'use client'

// import { useRef, useState } from 'react' 
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { 
//   Paperclip, 
//   Calendar, 
//   X, 
//   FileIcon, 
//   Pin, 
//   SendHorizontal, 
//   Loader2 
// } from 'lucide-react'
// import { createAnnouncement } from '../ClassActions' 

// interface AnnouncementInputProps {
//   classId: string
//   userId: string
// }

// export default function AnnouncementInput({ classId, userId }: AnnouncementInputProps) {
//   const [title, setTitle] = useState('')
//   const [content, setContent] = useState('')
//   const [deadline, setDeadline] = useState('')
//   const [isPinned, setIsPinned] = useState(false)
//   // 1. Change to an array of Files
//   const [files, setFiles] = useState<File[]>([])
//   const [isPending, setIsPending] = useState(false)
  
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const dateInputRef = useRef<HTMLInputElement>(null)

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const selectedFiles = Array.from(e.target.files)
//       setFiles((prev) => [...prev, ...selectedFiles])
//     }
//     // Reset input so the same file can be selected again if deleted
//     if (fileInputRef.current) fileInputRef.current.value = ''
//   }

//   const removeFile = (index: number) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index))
//   }

//   const handlePost = async () => {
//     if (!content.trim() && !title.trim() && files.length === 0) return
    
//     setIsPending(true)
//     const formData = new FormData()
//     formData.append('title', title || 'Class Update')
//     formData.append('content', content)
//     formData.append('classId', classId)
//     formData.append('userId', userId)
//     formData.append('pinned', String(isPinned))
//     if (deadline) formData.append('deadline', deadline)
    
//     // 2. Append all files to the same key 'files'
//     files.forEach((file) => {
//       formData.append('files', file)
//     })

//     try {
//       await createAnnouncement(formData)
//       resetForm()
//     } catch (error: any) {
//       console.error(error)
//       alert(error.message || "Failed to post")
//     } finally {
//       setIsPending(false)
//     }
//   }

//   const resetForm = () => {
//     setTitle('')
//     setContent('')
//     setDeadline('')
//     setIsPinned(false)
//     setFiles([])
//     if (fileInputRef.current) fileInputRef.current.value = ''
//   }

//   const formattedDeadline = deadline 
//     ? new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
//     : ''

//   return (
//     <Card className="rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//       <CardContent className="p-0">
//         <div className="border-b bg-white text-muted-foreground">
//           <input 
//             className="w-full p-4 text-sm font-semibold outline-none placeholder:text-gray-400"
//             placeholder="Announcement Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//         </div>

//         <div className="p-6 min-h-[140px] bg-muted text-muted-foreground">
//           <textarea
//             className="w-full bg-transparent outline-none resize-none placeholder:text-gray-400"
//             placeholder="Write something..."
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//           />
          
//           <div className="flex flex-wrap gap-3 mt-4">
//             {/* 3. Map through multiple files */}
//             {files.map((f, index) => (
//               <div key={index} className="flex items-center gap-2 p-2 bg-white rounded-lg border shadow-sm w-fit animate-in zoom-in-95">
//                 <FileIcon size={16} className="text-blue-500" />
//                 <span className="text-xs font-medium truncate max-w-[150px]">{f.name}</span>
//                 <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-500">
//                   <X size={14} />
//                 </button>
//               </div>
//             ))}

//             {deadline && (
//               <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100 text-blue-700 w-fit">
//                 <Calendar size={14} />
//                 <span className="text-xs font-semibold">{formattedDeadline}</span>
//                 <button onClick={() => setDeadline('')} className="ml-1 p-1 hover:bg-blue-100 rounded-full">
//                   <X size={14} />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="p-3 sm:p-4 flex justify-between items-center border-t bg-white">
//           <div className="flex items-center gap-1">
//             <input 
//               type="file" 
//               ref={fileInputRef} 
//               className="hidden" 
//               multiple 
//               onChange={handleFileChange}
//             />
//             <Button variant="ghost" size="md" className="rounded-full" onClick={() => fileInputRef.current?.click()}>
//               <Paperclip size={18} className="text-gray-500" />
//             </Button>
            
//             <input 
//               type="date" 
//               ref={dateInputRef} 
//               className="hidden" 
//               onChange={(e) => setDeadline(e.target.value)}
//             />
//             <Button variant={deadline ? "secondary" : "ghost"} size="md" className="rounded-full" onClick={() => dateInputRef.current?.showPicker()}>
//               <Calendar size={18} className={deadline ? "text-blue-600" : "text-gray-500"} />
//             </Button>

//             <Button 
//               variant="ghost" 
//               size="sm" 
//               className={`ml-1 gap-2 rounded-full px-3 ${isPinned ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
//               onClick={() => setIsPinned(!isPinned)}
//             >
//               <Pin size={16} className={isPinned ? "fill-blue-600" : ""} />
//               <span className="hidden sm:inline text-xs font-medium">Pin</span>
//             </Button>
//           </div>

//           <div className="flex items-center gap-2">
//             {(content || title || files.length > 0 || deadline) && (
//               <Button variant="ghost" size="md" className="rounded-full text-gray-400 hover:text-red-500" onClick={resetForm}>
//                 <X size={20} />
//               </Button>
//             )}

//             <Button 
//               size="md"
//               className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-md transition-all ${
//                 isPending || (!content.trim() && !title.trim() && files.length === 0)
//                 ? 'bg-gray-200 text-gray-400'
//                 : 'bg-blue-600 hover:bg-blue-700 text-white'
//               }`}
//               onClick={handlePost}
//               disabled={isPending || (!content.trim() && !title.trim() && files.length === 0)}
//             >
//               {isPending ? <Loader2 size={20} className="animate-spin" /> : <SendHorizontal size={20} />}
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
'use client'

import { useRef, useState } from 'react'
import { Paperclip, Calendar, X, FileText, Pin, SendHorizontal, Loader2 } from 'lucide-react'
import { createAnnouncement } from '../ClassActions'

export default function AnnouncementInput({
  classId, userId,
}: {
  classId: string
  userId: string
}) {
  const [title,     setTitle]     = useState('')
  const [content,   setContent]   = useState('')
  const [deadline,  setDeadline]  = useState('')
  const [isPinned,  setIsPinned]  = useState(false)
  const [files,     setFiles]     = useState<File[]>([])
  const [isPending, setIsPending] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index))

  const handlePost = async () => {
    if (!content.trim() && !title.trim() && files.length === 0) return
    setIsPending(true)

    const formData = new FormData()
    formData.append('title',   title || 'Class Update')
    formData.append('content', content)
    formData.append('classId', classId)
    formData.append('userId',  userId)
    formData.append('pinned',  String(isPinned))
    if (deadline) formData.append('deadline', deadline)
    files.forEach((f) => formData.append('files', f))

    try {
      await createAnnouncement(formData)
      resetForm()
    } catch (err: any) {
      alert(err.message || 'Failed to post')
    } finally {
      setIsPending(false)
    }
  }

  const resetForm = () => {
    setTitle(''); setContent(''); setDeadline('')
    setIsPinned(false); setFiles([])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const hasContent = content.trim() || title.trim() || files.length > 0 || deadline
  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden">

      {/* Title input */}
      <div className="border-b border-border">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Announcement title"
          className="w-full px-5 py-3.5 text-[14px] font-semibold bg-white
            text-foreground placeholder:text-muted-foreground
            focus:outline-none"
        />
      </div>

      {/* Content area */}
      <div className="px-5 pt-4 pb-3 bg-secondary/30 min-h-[120px]">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something…"
          rows={3}
          className="w-full bg-transparent resize-none text-[14px] text-foreground
            placeholder:text-muted-foreground focus:outline-none"
        />

        {/* Attached tags */}
        {(files.length > 0 || deadline) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {files.map((f, i) => (
              <div key={i} className="inline-flex items-center gap-2 bg-white
                border border-border rounded-lg px-3 py-1.5 text-[12px] font-medium">
                <FileText size={11} className="text-navy" />
                <span className="truncate max-w-[140px]">{f.name}</span>
                <button onClick={() => removeFile(i)}
                  className="text-muted-foreground hover:text-red-500 transition
                    cursor-pointer bg-transparent border-none">
                  <X size={12} />
                </button>
              </div>
            ))}

            {deadline && (
              <div className="inline-flex items-center gap-2 bg-yellow/15
                border border-yellow/40 rounded-lg px-3 py-1.5 text-[12px]
                font-semibold text-navy">
                <Calendar size={11} />
                {formattedDeadline}
                <button onClick={() => setDeadline('')}
                  className="text-navy/50 hover:text-navy transition
                    cursor-pointer bg-transparent border-none">
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-white">
        <div className="flex items-center gap-1">

          {/* Attach file */}
          <input type="file" ref={fileInputRef} className="hidden" multiple
            onChange={handleFileChange} />
          <ToolbarButton onClick={() => fileInputRef.current?.click()}>
            <Paperclip size={16} />
          </ToolbarButton>

          {/* Deadline */}
          <input type="date" ref={dateInputRef} className="hidden"
            onChange={(e) => setDeadline(e.target.value)} />
          <ToolbarButton
            onClick={() => dateInputRef.current?.showPicker()}
            active={!!deadline}>
            <Calendar size={16} />
          </ToolbarButton>

          {/* Pin */}
          <ToolbarButton onClick={() => setIsPinned(!isPinned)} active={isPinned}>
            <Pin size={16} className={isPinned ? 'fill-navy' : ''} />
            <span className="hidden sm:inline text-[11px] font-semibold">Pin</span>
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-2">
          {/* Clear */}
          {hasContent && (
            <ToolbarButton onClick={resetForm}>
              <X size={16} />
            </ToolbarButton>
          )}

          {/* Send */}
          <button
            onClick={handlePost}
            disabled={isPending || !hasContent}
            className={`size-10 rounded-xl flex items-center justify-center
              transition-all cursor-pointer border-none
              ${isPending || !hasContent
                ? 'bg-secondary text-muted-foreground'
                : 'bg-navy text-white hover:bg-navy/90'
              }`}>
            {isPending
              ? <Loader2 size={16} className="animate-spin" />
              : <SendHorizontal size={16} />
            }
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Small toolbar icon button ── */
function ToolbarButton({
  children, onClick, active = false,
}: {
  children: React.ReactNode
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px]
        transition cursor-pointer border-none
        ${active
          ? 'bg-navy/8 text-navy border border-navy/15'
          : 'bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground'
        }`}>
      {children}
    </button>
  )
}