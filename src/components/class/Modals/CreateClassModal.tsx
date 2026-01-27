'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface CreateClassModalProps {
  userId: string
  onClose: () => void
  onSuccess?: () => void
}

export default function CreateClassModal({ userId, onClose, onSuccess }: CreateClassModalProps) {
  const router = useRouter()
  const supabase = createClient()
  const [className, setClassName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateClassCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!className.trim()) {
      setError('Class name is required')
      return
    }

    setLoading(true)
    setError(null)

    const code = generateClassCode()

    try {
      // Create class (user profile should already exist from authentication)
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .insert({
          name: className.trim(),
          description: description.trim() || null,
          code,
          created_by: userId,
        } as any)
        .select()
        .single()

      if (classError) {
        console.error('Class creation error:', classError)
        throw classError
      }

      if (!classData) {
        throw new Error('Class creation failed: No data returned')
      }

      // Add creator as teacher
      const { error: memberError } = await supabase.from('class_members').insert({
        class_id: (classData as any).id,
        user_id: userId,
        role: 'teacher',
      } as any)

      if (memberError) {
        console.error('Member creation error:', memberError)
        throw memberError
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }

      // Close modal and refresh
      onClose()
      router.push(`/dashboard/classes/${(classData as any).id}`)
      router.refresh()
    } catch (err: any) {
      console.error('Error creating class:', err)
      setError(err.message || 'Failed to create class')
    } finally {
      setLoading(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
        {/* Title */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Create Class</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          {/* Input Fields */}
          <div className="space-y-4 mb-6">
            <div>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Class name"
                className="w-full bg-gray-50 px-4 py-3 rounded-lg border-0 border-b-2 border-blue-500 focus:outline-none focus:bg-white focus:border-blue-600 text-gray-900 placeholder:text-gray-400"
                disabled={loading}
                autoFocus
              />
            </div>
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={3}
                className="w-full bg-gray-50 px-4 py-3 rounded-lg border-0 border-b-2 border-blue-500 focus:outline-none focus:bg-white focus:border-blue-600 text-gray-900 placeholder:text-gray-400 resize-none"
                disabled={loading}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !className.trim()}
              className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

