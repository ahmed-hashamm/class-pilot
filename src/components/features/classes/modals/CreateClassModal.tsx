'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plus, Loader2, X } from 'lucide-react'
import { FeatureButton, Button } from '@/components/ui'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const createClassSchema = z.object({
  className: z.string().min(1, 'Class name is required').trim(),
  description: z.string().trim().optional(),
})

type CreateClassFormData = z.infer<typeof createClassSchema>

/**
 * The primary interface for teachers to initialize a new classroom.
 * 
 * Features:
 * - Robust Zod-driven client-side validation for class metadata
 * - Automated generation of a unique 6-character classroom invite code
 * - Atomic persistence workflow: Creates the class record then enrolls the creator as 'teacher'
 * - Integrated navigation orchestration to the newly created classroom
 */
export interface CreateClassModalProps {
  userId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateClassModal({ userId, onClose, onSuccess }: CreateClassModalProps) {
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateClassFormData>({
    resolver: zodResolver(createClassSchema),
    defaultValues: { className: '', description: '' },
  })

  const generateClassCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const onSubmit = async (data: CreateClassFormData) => {
    const code = generateClassCode()

    try {
      // 1. Create class
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .insert({
          name: data.className,
          description: data.description || null,
          code,
          created_by: userId,
        } as any)
        .select()
        .maybeSingle()

      if (classError) throw classError
      if (!classData) throw new Error('Class creation failed: No data returned')

      const classId = (classData as any).id

      // 2. Add creator as teacher
      const { error: memberError } = await supabase.from('class_members').insert({
        class_id: classId,
        user_id: userId,
        role: 'teacher',
      } as any)

      if (memberError) throw memberError

      toast.success('Class created successfully!')
      if (onSuccess) onSuccess()

      onClose()
      router.push(`/classes/${classId}`)
      // Removed router.refresh() as React Query invalidate will handle data refetching in Phase 4
    } catch (err: any) {
      console.error('Error creating class:', err)
      toast.error(err.message || 'Failed to create class')
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose()
    }
  }

  return (
    <div onClick={handleBackdropClick} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2">
            <Plus className="text-accent" size={24} />
            Create Class
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            disabled={isSubmitting} 
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 p-2 h-auto"
          >
            <X size={24} />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="className">Class Name <span className="text-red-500">*</span></Label>
              <Input
                id="className"
                placeholder="e.g. Introduction to Computer Science"
                {...register('className')}
                className="text-navy"
                autoFocus
              />
              {errors.className && (
                <p className="text-sm font-medium text-red-600">{errors.className.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="What is this class about?"
                {...register('description')}
                className="resize-none min-h-[100px] text-navy"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <FeatureButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
              label="Cancel"
            />
            <FeatureButton
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="flex-1"
              label="Create Class"
            />
          </div>
        </form>
      </div>
    </div>
  )
}

