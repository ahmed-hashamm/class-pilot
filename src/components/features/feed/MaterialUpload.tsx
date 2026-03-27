'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UploadCloud, SendHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from "sonner"
import { FeatureButton, FileChip, FormSection } from '@/components/ui'

import { ALLOWED_FILE_TYPES } from "@/lib/data/materials";

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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files)
    const valid = selected.filter((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase()
      return ext && (ALLOWED_FILE_TYPES as readonly string[]).includes(ext)
    })
    if (valid.length < selected.length)
      toast.error('Only PDF, DOCX, PPT, and PPTX files are allowed.')
    setFiles((prev) => [...prev, ...valid])
    if (fileInputRef.current) fileInputRef.current.value = ''
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
      const { createMaterial } = await import('@/actions/ClassActions')
      const result = await createMaterial(formData)
      if (result.success) {
        toast.success("Materials uploaded successfully");
        resetForm()
        onSuccess()
        ;(window as any).refreshFeed?.()

        // Auto-sync for AI in the background
        if (result.materialId) {
          fetch('/api/materials/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ materialId: result.materialId }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) toast.success(`AI synced (${data.chunks} chunks)`)
            })
            .catch(() => { /* silent fail — manual sync available */ })
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload materials")
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
      <div className="grid gap-5">
        <FormSection label="Material Title" description="e.g. Week 1 Lecture Slides">
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter a descriptive title..."
            className="rounded-xl border-border bg-gray-50/50 py-6"
          />
        </FormSection>

        <FormSection label="Description (Optional)" description="Add context for these materials...">
          <Textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="What should students know about these files?"
            className="min-h-[100px] rounded-xl border-border bg-gray-50/50 resize-none p-4"
          />
        </FormSection>
      </div>

      <FormSection label="Files" description="PDF, DOCX, PPT, PPTX files only">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative flex flex-col items-center justify-center gap-3
          border-2 border-dashed border-border/60 rounded-2xl py-10 cursor-pointer
          hover:border-navy/30 hover:bg-navy/5 transition-all bg-gray-50/30 group"
        >
          <div className="size-12 rounded-full bg-navy/5 flex items-center justify-center text-navy group-hover:scale-110 transition">
            <UploadCloud size={24} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-foreground">Click or drag to upload</p>
            <p className="text-[11px] text-muted-foreground mt-1">Select files from your device</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            multiple 
            className="hidden" 
            onChange={handleFileChange} 
          />
        </div>

        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3">
            {files.map((file, i) => (
              <FileChip
                key={i}
                name={file.name}
                onRemove={() => setFiles(files.filter((_, idx) => idx !== i))}
              />
            ))}
          </div>
        )}
      </FormSection>

      <div className="flex items-center justify-end gap-3 border-t border-border/40 pt-6">
        {hasContent && (
          <FeatureButton
            variant="ghost"
            label="Clear everything"
            onClick={resetForm}
          />
        )}
        <FeatureButton
          label="Upload materials"
          icon={SendHorizontal}
          loading={loading}
          disabled={files.length === 0}
          onClick={handleUpload}
          className="min-w-[180px] py-6 shadow-md"
          size="lg"
        />
      </div>
    </div>
  )
}
