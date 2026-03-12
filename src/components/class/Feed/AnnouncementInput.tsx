'use client'

import { useRef, useState } from 'react'
import { Paperclip, Calendar, X, FileText, Pin, SendHorizontal, Loader2, Timer } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createAnnouncement } from '../../../actions/ClassActions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function AnnouncementInput({
  classId, userId,
}: {
  classId: string
  userId: string
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [deadline, setDeadline] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

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
    formData.append('title', title || 'Class Update')
    formData.append('content', content)
    formData.append('classId', classId)
    formData.append('userId', userId)
    formData.append('pinned', String(isPinned))
    if (deadline) formData.append('deadline', deadline)
    files.forEach((f) => formData.append('files', f))

    try {
      await createAnnouncement(formData)
      resetForm()
      router.refresh()
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
    <div className="space-y-5">

      {/* Inputs */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ann-title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Title
          </Label>
          <Input
            id="ann-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Important Update for Tomorrow"
            className="rounded-xl border-border bg-gray-50/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ann-content" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Announcement
          </Label>
          <Textarea
            id="ann-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share an update with your class..."
            className="min-h-[120px] rounded-xl border-border bg-gray-50/50 resize-none p-4"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ann-deadline" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Response Deadline (Optional)
          </Label>
          <div className="relative">
            <Timer size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              id="ann-deadline"
              type="datetime-local"
              value={deadline} 
              onChange={(e) => setDeadline(e.target.value)} 
              min={new Date().toISOString().slice(0, 16)}
              className="pl-10 rounded-xl border-border bg-gray-50/50 py-6"
            />
          </div>
          {deadline && (
            <p className="text-[11px] text-navy font-bold pl-1 animate-in fade-in">
              Due: {formattedDeadline}
            </p>
          )}
        </div>
      </div>

      {/* Attachments Display */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-border/40 pt-4 mt-2">
          {files.map((f, i) => (
            <div key={i} className="inline-flex items-center gap-2 bg-navy/5 text-navy
              border border-navy/10 rounded-lg px-3 py-1.5 text-[12px] font-semibold">
              <FileText size={12} />
              <span className="truncate max-w-[140px]">{f.name}</span>
              <button type="button" onClick={() => removeFile(i)}
                className="hover:text-red-500 transition cursor-pointer bg-transparent border-none">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl border-dashed py-5 px-4"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={16} className="mr-2" />
            Add Files
          </Button>

          <Button
            type="button"
            variant={isPinned ? "secondary" : "ghost"}
            size="sm"
            className={`rounded-xl py-5 px-4 ${isPinned ? 'text-navy border-navy/20 bg-yellow/20' : 'text-muted-foreground'}`}
            onClick={() => setIsPinned(!isPinned)}
          >
            <Pin size={16} className={`mr-2 ${isPinned ? 'fill-navy' : ''}`} />
            {isPinned ? 'Pinned' : 'Pin'}
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {hasContent && (
            <Button variant="ghost" onClick={resetForm} className="text-muted-foreground hover:text-red-500 rounded-xl">
              Clear
            </Button>
          )}
          <Button
            onClick={handlePost}
            disabled={isPending || !hasContent}
            className="rounded-xl bg-navy hover:bg-navy/90 text-white min-w-[120px] py-6 shadow-md"
          >
            {isPending ? (
              <Loader2 size={18} className="animate-spin mr-2" />
            ) : (
              <SendHorizontal size={18} className="mr-2" />
            )}
            Post
          </Button>
        </div>
      </div>
    </div>
  )
}