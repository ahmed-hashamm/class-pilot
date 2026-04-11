/**
 * @file MaterialUpload.tsx
 * @description Upload component for course materials in the feed.
 * Provides file selection, validation, and AI ingestion integration.
 */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SendHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from "sonner"
import { FeatureButton, FormSection } from '@/components/ui'
import { PinToggle } from './PinToggle'
import { FileUploadArea } from '@/components/ui/FileUploadArea'

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
  const [isPinned, setIsPinned] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const router = useRouter()

  const handleUpload = async () => {
    if (!files.length) return
    setLoading(true)
    const formData = new FormData()
    formData.append('title', title || 'Untitled Material')
    formData.append('description', description)
    formData.append('classId', classId)
    formData.append('userId', userId)
    formData.append('pinned', String(isPinned))
    files.forEach((f) => formData.append('files', f))

    try {
      const { createMaterial } = await import('@/actions/ClassActions')
      const result = await createMaterial(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Materials uploaded successfully")
        resetForm()
        onSuccess()
          ; (window as any).refreshFeed?.()

        const materialId = (result.data as any)?.materialId
        if (materialId) {
          fetch('/api/materials/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ materialId }),
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
    setIsPinned(false)
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

        <FormSection label="Files" description="PDF, DOCX, PPT, PPTX files only">
          <FileUploadArea
            files={files}
            onFilesChange={setFiles}
            variant="lg"
            onValidate={(f) => {
              const ext = f.name.split('.').pop()?.toLowerCase()
              const isValid = ext && (ALLOWED_FILE_TYPES as readonly string[]).includes(ext)
              if (!isValid) toast.error(`Only PDF, DOCX, PPT, and PPTX files are allowed. Skipped ${f.name}.`)
              return !!isValid;
            }}
          />
        </FormSection>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-t border-border/40 pt-6">
        <div className="flex items-center justify-between w-full lg:w-auto gap-3">
          <PinToggle
            pinned={isPinned}
            onToggle={setIsPinned}
          />
          {hasContent && (
            <FeatureButton
              variant="outline"
              label="Clear"
              onClick={resetForm}
              className="px-4"
            />
          )}
        </div>
        <FeatureButton
          label="Upload Materials"
          icon={SendHorizontal}
          loading={loading}
          disabled={files.length === 0}
          onClick={handleUpload}
          className="w-full lg:w-fit shadow-md !py-4"
        />
      </div>
    </div>
  )
}
