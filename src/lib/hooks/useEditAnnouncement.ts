import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateAnnouncement } from '@/actions/ClassActions'

export function useEditAnnouncement(announcement: any, onClose: () => void, onSuccess: () => void) {
    const [title, setTitle] = useState(announcement.title)
    const [content, setContent] = useState(announcement.content)
    const [isPinned, setIsPinned] = useState(announcement.pinned)
    const [newFiles, setNewFiles] = useState<File[]>([])
    const queryClient = useQueryClient()

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
        newFiles.forEach((file: File) => formData.append('files', file))
        formData.append('existingAttachments', JSON.stringify(existingFiles))

        try {
            await updateAnnouncement(formData)
            queryClient.invalidateQueries({ queryKey: ['streamFeed', announcement.classId] })
            toast.success('Announcement updated successfully')
            onSuccess()
            onClose()
        } catch (err: any) {
            toast.error(err.message || 'Failed to update')
            setError(err.message || 'Failed to update')
        } finally {
            setLoading(false)
        }
    }

    const removeExistingFile = (index: number) =>
        setExistingFiles(existingFiles.filter((_, i) => i !== index))

    const removeNewFile = (index: number) =>
        setNewFiles(newFiles.filter((_, i) => i !== index))

    return {
        title, setTitle,
        content, setContent,
        isPinned, setIsPinned,
        existingFiles, removeExistingFile,
        newFiles, setNewFiles, removeNewFile,
        loading, error,
        handleSave
    }
}
