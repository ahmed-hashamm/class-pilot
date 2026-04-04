'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Paperclip, Pin, SendHorizontal, Timer, FileText } from 'lucide-react'
import { createAnnouncement } from '@/actions/ClassActions'
import { toast } from "sonner";
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FeatureButton, FileChip, FormSection } from '@/components/ui'
import { PinToggle } from './PinToggle'

export default function AnnouncementInput({
  classId, userId, onSuccess,
}: {
  classId: string
  userId: string
  onSuccess?: () => void
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [deadline, setDeadline] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handlePost = async () => {
    if (!content.trim() && !title.trim() && files.length === 0) return
    setLoading(true)

    const formData = new FormData()
    formData.append('title', title || 'Class Update')
    formData.append('content', content)
    formData.append('classId', classId)
    formData.append('userId', userId)
    formData.append('pinned', String(isPinned))
    if (deadline) formData.append('deadline', deadline)
    files.forEach((f) => formData.append('files', f))

    try {
      const result = await createAnnouncement(formData)
      if (result.success) {
        toast.success("Announcement posted successfully");
        resetForm();
        if (onSuccess) onSuccess();
        (window as any).refreshFeed?.();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to post announcement");
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setTitle(''); setContent(''); setDeadline('')
    setIsPinned(false); setFiles([])
  }

  const hasContent = content.trim() || title.trim() || files.length > 0 || deadline

  return (
    <div className="space-y-6">
      <div className="grid gap-5">
        <FormSection label="Title" description="e.g. Schedule Change">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Important update..."
            className="rounded-xl border-border bg-gray-50/50 py-6"
          />
        </FormSection>

        <FormSection label="Announcement" description="Share details with your class">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What would you like to say?"
            className="min-h-[120px] rounded-xl border-border bg-gray-50/50 resize-none p-4"
          />
        </FormSection>

        <FormSection label="Deadline (Optional)" description="When is a response needed?">
          <div className="relative">
            <Timer size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" />
            <Input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="pl-10 rounded-xl border-border bg-gray-50/50 py-6 w-full"
            />
          </div>
        </FormSection>
      </div>

      <FormSection label="Attachments" description="Add reference files">
        <div className="flex flex-col gap-4">
          <label className="relative flex flex-col items-center justify-center gap-2 
            border-2 border-dashed border-border rounded-2xl py-8 cursor-pointer 
            hover:border-navy/30 hover:bg-navy/5 transition-all bg-secondary/30 group">
            <Paperclip size={20} className="text-navy/40 group-hover:scale-110 transition" />
            <span className="text-[13px] font-bold text-foreground">Add files</span>
            <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
          </label>

          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {files.map((file, i) => (
                <FileChip
                  key={i}
                  name={file.name}
                  onRemove={() => setFiles(files.filter((_, idx) => idx !== i))}
                />
              ))}
            </div>
          )}
        </div>
      </FormSection>

      <div className="flex items-center justify-between border-t border-border/40 pt-6">
        <div className="flex items-center gap-3">
          <PinToggle
            pinned={isPinned}
            onToggle={setIsPinned}
          />
          {hasContent && (
            <FeatureButton
              label="Clear"
              variant="outline"
              onClick={resetForm}
            />
          )}
        </div>
        <FeatureButton
          label="Post Announcement"
          icon={SendHorizontal}
          loading={loading}
          disabled={!hasContent}
          onClick={handlePost}


        />
      </div>
    </div>
  )
}
