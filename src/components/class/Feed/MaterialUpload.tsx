// 'use client'

// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Card, CardContent } from '@/components/ui/card'
// import { UploadCloud, X, Loader2, Paperclip } from 'lucide-react'

// interface MaterialUploadProps {
//   classId: string
//   userId: string
//   onSuccess: () => void
// }

// const ALLOWED_FILE_TYPES = ['pdf', 'docx', 'ppt', 'pptx']

// export default function MaterialUpload({
//   classId,
//   userId,
//   onSuccess,
// }: MaterialUploadProps) {
//   const [loading, setLoading] = useState(false)
//   const [files, setFiles] = useState<File[]>([])

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return

//     const selected = Array.from(e.target.files)

//     const validFiles = selected.filter((file) => {
//       const ext = file.name.split('.').pop()?.toLowerCase()
//       return ext && ALLOWED_FILE_TYPES.includes(ext)
//     })

//     const invalidFiles = selected.filter((file) => {
//       const ext = file.name.split('.').pop()?.toLowerCase()
//       return !ext || !ALLOWED_FILE_TYPES.includes(ext)
//     })

//     if (invalidFiles.length > 0) {
//       alert('Only PDF, DOCX, PPT, and PPTX files are allowed')
//     }

//     setFiles((prev) => [...prev, ...validFiles])
//     e.target.value = ''
//   }

//   const removeFile = (index: number) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index))
//   }

//   const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     if (files.length === 0) return

//     setLoading(true)
//     const formData = new FormData(e.currentTarget)

//     formData.append('classId', classId)
//     formData.append('userId', userId)

//     files.forEach((file) => {
//       formData.append('files', file)
//     })

//     try {
//       const { createMaterial } = await import('../ClassActions')
//       await createMaterial(formData)

//       setFiles([])
//       onSuccess()
//     } catch (error: any) {
//       console.error(error)
//       alert(error.message || 'Failed to upload materials')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Card className="border-2  rounded-2xl">
//       <CardContent className="p-4">
//         <form onSubmit={handleUpload} className="space-y-4">
//           <div className="grid gap-4 sm:grid-cols-2">
//             <div>
//               <Label>Title</Label>
//               <Input name="title" required placeholder="e.g., Week 1 Slides" />
//             </div>
//             <div>
//               <Label>Description</Label>
//               <Input name="description" placeholder="Optional notes" />
//             </div>
//           </div>

//           <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6">
//             <UploadCloud className="mb-2 h-8 w-8" />
//             <p className="text-sm italic">Drag files or browse</p>
//             <input
//               type="file"
//               multiple
//               className="absolute inset-0 cursor-pointer opacity-0"
//               onChange={handleFileChange}
//             />
//           </div>

//           {files.length > 0 && (
//             <div className="grid gap-2 max-h-32 overflow-y-auto">
//               {files.map((file, i) => (
//                 <div key={i} className="flex items-center justify-between border p-2 rounded">
//                   <div className="flex items-center gap-2 truncate">
//                     <Paperclip size={14} />
//                     <span className="truncate">{file.name}</span>
//                   </div>
//                   <button type="button" onClick={() => removeFile(i)}>
//                     <X size={14} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="flex justify-end gap-2">
//             <Button type="submit" disabled={loading || files.length === 0}>
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Uploading...
//                 </>
//               ) : (
//                 `Post ${files.length} File${files.length > 1 ? 's' : ''}`
//               )}
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }
'use client'

import { useState } from 'react'
import { UploadCloud, X, Loader2, Paperclip } from 'lucide-react'

const ALLOWED_FILE_TYPES = ['pdf', 'docx', 'ppt', 'pptx']

const inputClass = `w-full bg-white border border-border rounded-xl px-4 py-3
  text-[14px] text-foreground placeholder:text-muted-foreground
  focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition`

const labelClass = `text-[11px] font-bold tracking-[.18em] uppercase text-navy`

export default function MaterialUpload({
  classId, userId, onSuccess,
}: {
  classId: string
  userId: string
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [files,   setFiles]   = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files)
    const valid   = selected.filter((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase()
      return ext && ALLOWED_FILE_TYPES.includes(ext)
    })
    if (valid.length < selected.length)
      alert('Only PDF, DOCX, PPT, and PPTX files are allowed.')
    setFiles((prev) => [...prev, ...valid])
    e.target.value = ''
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!files.length) return
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.append('classId', classId)
    formData.append('userId', userId)
    files.forEach((f) => formData.append('files', f))
    try {
      const { createMaterial } = await import('../ClassActions')
      await createMaterial(formData)
      setFiles([])
      onSuccess()
    } catch (err: any) {
      alert(err.message || 'Failed to upload materials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpload} className="flex flex-col gap-4">

      {/* Title + description */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Title</label>
          <input name="title" required placeholder="e.g. Week 1 Slides"
            className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Description</label>
          <input name="description" placeholder="Optional notes"
            className={inputClass} />
        </div>
      </div>

      {/* Dropzone */}
      <label className="relative flex flex-col items-center justify-center gap-2
        border-2 border-dashed border-border rounded-xl py-8 cursor-pointer
        hover:border-navy/30 hover:bg-secondary/40 transition">
        <UploadCloud size={22} className="text-muted-foreground" />
        <p className="text-[13px] text-muted-foreground font-medium">
          Click to browse files
        </p>
        <p className="text-[11px] text-muted-foreground/60">
          PDF, DOCX, PPT, PPTX
        </p>
        <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileChange} />
      </label>

      {/* File chips */}
      {files.length > 0 && (
        <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between bg-secondary
              border border-border rounded-xl px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <Paperclip size={12} className="text-navy shrink-0" />
                <span className="text-[12px] font-medium truncate">{file.name}</span>
              </div>
              <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                className="shrink-0 text-muted-foreground hover:text-red-500 transition
                  cursor-pointer bg-transparent border-none ml-2">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <button type="submit"
          disabled={loading || files.length === 0}
          className="inline-flex items-center gap-2 bg-navy text-white font-bold
            text-[13px] px-5 py-2.5 rounded-xl hover:bg-navy/90 transition
            disabled:opacity-50 cursor-pointer border-none">
          {loading
            ? <><Loader2 size={14} className="animate-spin" />Uploading…</>
            : `Post ${files.length} file${files.length !== 1 ? 's' : ''}`
          }
        </button>
      </div>
    </form>
  )
}