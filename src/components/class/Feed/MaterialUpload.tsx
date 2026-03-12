'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UploadCloud, X, Loader2, Paperclip, SendHorizontal, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const ALLOWED_FILE_TYPES = ['pdf', 'docx', 'ppt', 'pptx']

export default function MaterialUpload({
  classId, userId, onSuccess,
}: {
  classId: string
  userId: string
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files)
    const valid = selected.filter((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase()
      return ext && ALLOWED_FILE_TYPES.includes(ext)
    })
    if (valid.length < selected.length)
      alert('Only PDF, DOCX, PPT, and PPTX files are allowed.')
    setFiles((prev) => [...prev, ...valid])
    e.target.value = ''
  }

  const handleUpload = async () => {
    if (!files.length) return
    setLoading(true)
    const formData = new FormData()
    formData.append('title', title || 'Untitled Material')
    formData.append('description', description)
    formData.append('classId', classId)
    formData.append('userId', userId)
    files.forEach((f) => formData.append('files', f))

    try {
      const { createMaterial } = await import('../../../actions/ClassActions')
      await createMaterial(formData)
      resetForm()
      onSuccess()
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Failed to upload materials')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTitle(''); setDescription(''); setFiles([])
  }

  const hasContent = title.trim() || description.trim() || files.length > 0

  return (
    <div className="space-y-6">
      
      {/* Inputs */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mat-title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Material Title
          </Label>
          <Input 
            id="mat-title"
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g. Week 1 Lecture Slides"
            className="rounded-xl border-border bg-gray-50/50 py-6"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mat-desc" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Description (Optional)
          </Label>
          <Textarea 
            id="mat-desc"
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Add context for these materials..."
            className="min-h-[80px] rounded-xl border-border bg-gray-50/50 resize-none p-4"
          />
        </div>
      </div>

      {/* Dropzone area */}
      <div className="space-y-3">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Files
        </Label>
        <label className="relative flex flex-col items-center justify-center gap-3
          border-2 border-dashed border-border/60 rounded-2xl py-10 cursor-pointer
          hover:border-navy/30 hover:bg-navy/5 transition-all bg-gray-50/30 group">
          <div className="size-12 rounded-full bg-navy/5 flex items-center justify-center text-navy group-hover:scale-110 transition">
            <UploadCloud size={24} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-foreground">Click or drag to upload</p>
            <p className="text-[11px] text-muted-foreground mt-1">PDF, DOCX, PPT, PPTX only</p>
          </div>
          <input type="file" multiple className="hidden" onChange={handleFileChange} />
        </label>

        {/* File Chips */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {files.map((file, i) => (
              <div key={i} className="inline-flex items-center gap-2 bg-navy/5 text-navy
                border border-navy/10 rounded-lg px-3 py-1.5 text-[12px] font-semibold">
                <FileText size={12} />
                <span className="truncate max-w-[140px]">{file.name}</span>
                <button type="button" 
                  onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                  className="hover:text-red-500 transition cursor-pointer bg-transparent border-none"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-border/40 pt-6 mt-2">
        {hasContent && (
          <Button variant="ghost" onClick={resetForm} className="text-muted-foreground hover:text-red-500 rounded-xl">
            Clear
          </Button>
        )}
        <Button 
          onClick={handleUpload} 
          disabled={loading || files.length === 0}
          className="rounded-xl bg-navy hover:bg-navy/90 text-white min-w-[160px] py-6 shadow-md"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin mr-2" />
          ) : (
            <SendHorizontal size={18} className="mr-2" />
          )}
          Upload Materials
        </Button>
      </div>
    </div>
  )
}