'use client'

import { createClient } from '@/lib/supabase/client'
import { X, Loader2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const joinClassSchema = z.object({
  classCode: z.string().min(1, 'Class code is required').trim(),
})

type JoinClassFormData = z.infer<typeof joinClassSchema>

interface JoinClassModalProps {
  userId: string
  onClose: () => void
  onSuccess: () => void
}

export default function JoinClassModal({ userId, onClose, onSuccess }: JoinClassModalProps) {
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinClassFormData>({
    resolver: zodResolver(joinClassSchema),
    defaultValues: { classCode: '' },
  })

  const onSubmit = async (data: JoinClassFormData) => {
    try {
      // 1. Find the class with this code
      const { data: classroom, error: fetchError } = await supabase
        .from('classes')
        .select('id')
        .eq('code', data.classCode.toUpperCase())
        .single()

      if (fetchError || !classroom) {
        throw new Error('Classroom not found. Please check the code.')
      }

      // 2. Enroll the user
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

      toast.success('Successfully joined the class!')
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Failed to join class')
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (!isSubmitting) onClose()
    }
  }

  return (
    <div onClick={handleBackdropClick} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2">
            <Users className="text-accent" size={24} />
            Join Classroom
          </h2>
          <button onClick={onClose} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600 disabled:opacity-50">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Ask your teacher for the class code, then enter it below.
          </p>

          <div className="space-y-2">
            <Label htmlFor="code">Class Code</Label>
            <Input
              id="code"
              placeholder="e.g. ABC123"
              {...register('classCode')}
              className="text-lg tracking-widest font-mono text-navy uppercase"
            />
            {errors.classCode && (
              <p className="text-sm font-medium text-red-600">{errors.classCode.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-navy hover:bg-navy-light text-white">
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Join Class'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}   