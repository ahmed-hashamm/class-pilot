'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Loader2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface JoinClassModalProps {
  userId: string
  onClose: () => void
  onSuccess: () => void
}

export default function JoinClassModal({ userId, onClose, onSuccess }: JoinClassModalProps) {
  const supabase = createClient()
  const [classCode, setClassCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Find the class with this code
      const { data: classroom, error: fetchError } = await supabase
        .from('classes')
        .select('id')
        .eq('code', classCode.trim())
        .single()

      if (fetchError || !classroom) {
        throw new Error('Classroom not found. Please check the code.')
      }

      // 2. Enroll the user (assuming a table named 'class_enrollments')
      const { error: joinError } = await supabase
        .from('class_members') 
        .insert({
          class_id: (classroom as any).id,
          user_id: userId,
          role: 'student' // default role
        } as any)

      if (joinError) {
        if (joinError.code === '23505') throw new Error('You are already in this class!')
        throw joinError
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2">
            <Users className="text-accent" size={24} />
            Join Classroom
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleJoin} className="p-6 space-y-4">
          <p className="text-sm text-gray-500">
            Ask your teacher for the class code, then enter it below.
          </p>

          <div className="space-y-2">
            <Label htmlFor="code">Class Code</Label>
            <Input
              id="code"
              placeholder="e.g. ABC123"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              className="text-lg tracking-widest font-mono text-navy"
              required
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-600 bg-red-50 p-2 rounded border border-red-100">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !classCode} className="flex-1 bg-navy hover:bg-navy-light text-white">
              {loading ? <Loader2 className="animate-spin" /> : 'Join Class'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}   