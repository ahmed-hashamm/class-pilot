'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface UploadMaterialModalProps {
  classId: string
  userId: string
  onClose: () => void
  onSuccess: () => void
}

export default function UploadMaterialModal({
  classId,
  userId,
  onClose,
  onSuccess,
}: UploadMaterialModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!file) {
      setError('Please select a file')
      setLoading(false)
      return
    }

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `materials/${classId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('materials')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('materials').getPublicUrl(filePath)

      // Create material record
      const { error: insertError } = await supabase.from('materials').insert({
        class_id: classId,
        title,
        description: description || null,
        file_url: publicUrl,
        created_by: userId,
      } as any)

      if (insertError) throw insertError

      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to upload material')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl m-4">
        <CardHeader>
          <CardTitle>Upload Material</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">File *</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                required
                accept=".pdf,.doc,.docx,.txt,.zip,.pptx,.xlsx"
              />
              {file && <p className="text-sm text-gray-600">Selected: {file.name}</p>}
            </div>
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}
            <div className="flex gap-4">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

