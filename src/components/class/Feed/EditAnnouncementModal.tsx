'use client'

import { useState } from 'react'
import { X, Pin, Loader2, AlertCircle, FileText, Paperclip, UploadCloud } from 'lucide-react'
import { updateAnnouncement } from '../../../actions/ClassActions'

interface Props {
    announcement: {
        id: string
        title: string
        content: string
        pinned: boolean
        classId: string
        attachment_paths?: string[] | null
    }
    onClose: () => void
    onSuccess: () => void
}

const inputClass = `w-full bg-white border border-border rounded-xl px-4 py-3
  text-[14px] text-foreground placeholder:text-muted-foreground
  focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition`

export default function EditAnnouncementModal({ announcement, onClose, onSuccess }: Props) {
    const [title, setTitle] = useState(announcement.title)
    const [content, setContent] = useState(announcement.content)
    const [isPinned, setIsPinned] = useState(announcement.pinned)
    const [newFiles, setNewFiles] = useState<File[]>([])

    // Convert string array to objects for existing files UI
    const [existingFiles, setExistingFiles] = useState<{ name: string; url: string }[]>(
        (announcement.attachment_paths || []).map((path: string) => {
            const fileName = path.split('/').pop() || 'File'
            let cleanName = fileName.includes('-') ? fileName.split('-').slice(1).join('-') : fileName
            return { name: cleanName, url: path }
        })
    )

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSave = async () => {
        if (!title.trim() && !content.trim()) return
        setLoading(true); setError(null)

        const formData = new FormData()
        formData.append('id', announcement.id)
        formData.append('classId', announcement.classId)
        formData.append('title', title)
        formData.append('content', content)
        formData.append('pinned', String(isPinned))

        // Handle files
        newFiles.forEach(file => formData.append('files', file))
        formData.append('existingAttachments', JSON.stringify(existingFiles))

        try {
            await updateAnnouncement(formData)
            onSuccess()
            onClose()
        } catch (err: any) {
            setError(err.message || 'Failed to update')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm flex items-center
      justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-xl bg-navy flex items-center justify-center">
                            <FileText size={13} className="text-yellow" />
                        </div>
                        <h3 className="font-black text-[17px] tracking-tight">Edit announcement</h3>
                    </div>
                    <button onClick={onClose}
                        className="p-1.5 text-muted-foreground hover:text-foreground
              hover:bg-secondary rounded-lg transition cursor-pointer
              bg-transparent border-none">
                        <X size={16} />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-4">
                    {error && (
                        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200
              text-red-600 text-[13px] font-semibold px-4 py-3 rounded-xl">
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}

                    {/* Title */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">
                            Title
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Announcement title"
                            className={inputClass}
                        />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">
                            Content
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What do you want to share?"
                            rows={4}
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    {/* Attachments */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold tracking-[.18em] uppercase text-navy flex items-center gap-2">
                            <Paperclip size={12} /> Attachments
                        </label>

                        <label className="relative flex items-center gap-3 border-2 border-dashed
                            border-border rounded-xl px-4 h-12 cursor-pointer hover:border-navy/30
                            hover:bg-secondary/50 transition">
                            <UploadCloud size={15} className="text-muted-foreground" />
                            <span className="text-[13px] text-muted-foreground">
                                Upload new files
                            </span>
                            <input type="file" multiple
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) =>
                                    e.target.files && setNewFiles([...newFiles, ...Array.from(e.target.files)])
                                } />
                        </label>

                        {/* Existing Files */}
                        {existingFiles.length > 0 && (
                            <div className="flex flex-col gap-1.5 mt-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    Current files
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {existingFiles.map((file, i) => (
                                        <div key={i} className="inline-flex items-center gap-2 bg-secondary
                                            border border-border rounded-lg px-3 py-1.5 text-[12px] font-medium">
                                            <Paperclip size={11} className="text-navy" />
                                            <span className="truncate max-w-[140px]">{file.name}</span>
                                            <button type="button"
                                                onClick={() => setExistingFiles(existingFiles.filter((_, idx) => idx !== i))}
                                                className="text-muted-foreground hover:text-red-500 transition
                                                    cursor-pointer bg-transparent border-none p-0 flex">
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Files */}
                        {newFiles.length > 0 && (
                            <div className="flex flex-col gap-1.5 mt-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    New files
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {newFiles.map((file, i) => (
                                        <div key={i} className="inline-flex items-center gap-2 bg-white
                                            border border-border rounded-lg px-3 py-1.5 text-[12px] font-medium">
                                            <Paperclip size={11} className="text-navy-light" />
                                            <span className="truncate max-w-[140px]">{file.name}</span>
                                            <button type="button"
                                                onClick={() => setNewFiles(newFiles.filter((_, idx) => idx !== i))}
                                                className="text-muted-foreground hover:text-red-500 transition
                                                    cursor-pointer bg-transparent border-none p-0 flex">
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pin toggle */}
                    <button
                        type="button"
                        onClick={() => setIsPinned(!isPinned)}
                        className={`inline-flex items-center gap-2.5 px-4 py-3 rounded-xl border
              text-[13px] font-semibold transition cursor-pointer
              ${isPinned
                                ? 'bg-navy/8 border-navy/20 text-navy'
                                : 'bg-white border-border text-muted-foreground hover:border-navy/20 hover:bg-secondary'
                            }`}>
                        <Pin size={14} className={isPinned ? 'fill-navy' : ''} />
                        {isPinned ? 'Pinned to top' : 'Pin this announcement'}
                    </button>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 pb-6">
                    <button onClick={onClose}
                        className="flex-1 py-3 text-[14px] font-semibold text-muted-foreground
              hover:text-foreground hover:bg-secondary rounded-xl transition
              cursor-pointer bg-transparent border-none">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 inline-flex items-center justify-center gap-2
              bg-navy text-white font-semibold text-[14px] py-3 rounded-xl
              hover:bg-navy/90 transition disabled:opacity-60 cursor-pointer border-none">
                        {loading
                            ? <><Loader2 size={14} className="animate-spin" />Saving…</>
                            : 'Save changes'
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}