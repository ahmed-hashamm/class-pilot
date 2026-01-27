// 'use client'

// import { useState } from 'react'
// import { createClient } from '@/lib/supabase/client'
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

// export default function MaterialUpload({ classId, userId, onSuccess }: MaterialUploadProps) {
//   const supabase = createClient()
//   const [loading, setLoading] = useState(false)
//   const [files, setFiles] = useState<File[]>([])

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       // Logic same as announcement: append new files to current selection
//       setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
//     }
//     // Clear input so same file can be re-selected if removed
//     e.target.value = ''
//   }

//   const removeFile = (index: number) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index))
//   }

 
//  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     if (files.length === 0) return

//     setLoading(true)
//     const formData = new FormData(e.currentTarget)
    
//     // Add context fields that aren't in the form inputs
//     formData.append('classId', classId)
//     formData.append('userId', userId)
    
//     // Append all selected files to the 'files' key
//     files.forEach((file) => {
//       formData.append('files', file)
//     })

//     try {
//       // Use your new server action
//       const { createMaterial } = await import('../actions') // ensure correct path
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
//     <Card className="border-2 border-emerald-100 bg-emerald-50/30 shadow-sm rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
//       <CardContent className="p-4">
//         <form onSubmit={handleUpload} className="space-y-4">
//           {/* Inputs Section */}
//           <div className="grid gap-4 sm:grid-cols-2">
//             <div className="space-y-2">
//               <Label htmlFor="title" className="text-emerald-900 font-semibold text-sm">Title</Label>
//               <Input 
//                 id="title" 
//                 name="title" 
//                 required 
//                 placeholder="e.g., Week 1 Slides" 
//                 className="bg-white border-emerald-100 focus-visible:ring-emerald-500" 
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="description" className="text-emerald-900 font-semibold text-sm">Description</Label>
//               <Input 
//                 id="description" 
//                 name="description" 
//                 placeholder="Optional notes..." 
//                 className="bg-white border-emerald-100 focus-visible:ring-emerald-500" 
//               />
//             </div>
//           </div>

//           {/* Dropzone Area */}
//           <div className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-200 bg-white p-6 transition-colors hover:border-emerald-400">
//             <UploadCloud className="mb-2 h-8 w-8 text-emerald-400 group-hover:text-emerald-500" />
//             <p className="text-sm text-emerald-600 italic">Drag files or <span className="font-bold">browse</span></p>
//             <input 
//               type="file" 
//               multiple 
//               className="absolute inset-0 cursor-pointer opacity-0" 
//               onChange={handleFileChange} 
//             />
//           </div>

//           {/* File Selection Tags */}
//           {files.length > 0 && (
//             <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 max-h-32 overflow-y-auto pr-1">
//               {files.map((file, i) => (
//                 <div key={i} className="flex items-center justify-between rounded-lg border border-emerald-100 bg-white p-2 text-xs shadow-sm animate-in zoom-in-95">
//                   <div className="flex items-center gap-2 truncate text-emerald-700">
//                     <Paperclip size={14} className="shrink-0" />
//                     <span className="truncate">{file.name}</span>
//                   </div>
//                   <button 
//                     type="button" 
//                     onClick={() => removeFile(i)} 
//                     className="text-gray-400 hover:text-red-500 transition-colors"
//                   >
//                     <X size={14} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-2 pt-2 border-t border-emerald-100">
//             <Button 
//               type="button" 
//               variant="ghost" 
//               onClick={onSuccess} 
//               disabled={loading}
//               className="text-emerald-700 hover:bg-emerald-100"
//             >
//               Cancel
//             </Button>
//             <Button 
//               type="submit" 
//               className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-full" 
//               disabled={loading || files.length === 0}
//             >
//               {loading ? (
//                 <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
//               ) : (
//                 `Post ${files.length} ${files.length === 1 ? 'File' : 'Files'}`
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { UploadCloud, X, Loader2, Paperclip } from 'lucide-react'

interface MaterialUploadProps {
  classId: string
  userId: string
  onSuccess: () => void
}

const ALLOWED_FILE_TYPES = ['pdf', 'docx', 'ppt', 'pptx']

export default function MaterialUpload({
  classId,
  userId,
  onSuccess,
}: MaterialUploadProps) {
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const selected = Array.from(e.target.files)

    const validFiles = selected.filter((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase()
      return ext && ALLOWED_FILE_TYPES.includes(ext)
    })

    const invalidFiles = selected.filter((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase()
      return !ext || !ALLOWED_FILE_TYPES.includes(ext)
    })

    if (invalidFiles.length > 0) {
      alert('Only PDF, DOCX, PPT, and PPTX files are allowed')
    }

    setFiles((prev) => [...prev, ...validFiles])
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (files.length === 0) return

    setLoading(true)
    const formData = new FormData(e.currentTarget)

    formData.append('classId', classId)
    formData.append('userId', userId)

    files.forEach((file) => {
      formData.append('files', file)
    })

    try {
      const { createMaterial } = await import('../actions')
      await createMaterial(formData)

      setFiles([])
      onSuccess()
    } catch (error: any) {
      console.error(error)
      alert(error.message || 'Failed to upload materials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-2 border-emerald-100 bg-emerald-50/30 rounded-2xl">
      <CardContent className="p-4">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Title</Label>
              <Input name="title" required placeholder="e.g., Week 1 Slides" />
            </div>
            <div>
              <Label>Description</Label>
              <Input name="description" placeholder="Optional notes" />
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6">
            <UploadCloud className="mb-2 h-8 w-8" />
            <p className="text-sm italic">Drag files or browse</p>
            <input
              type="file"
              multiple
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={handleFileChange}
            />
          </div>

          {files.length > 0 && (
            <div className="grid gap-2 max-h-32 overflow-y-auto">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between border p-2 rounded">
                  <div className="flex items-center gap-2 truncate">
                    <Paperclip size={14} />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <button type="button" onClick={() => removeFile(i)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={loading || files.length === 0}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                `Post ${files.length} File${files.length > 1 ? 's' : ''}`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
