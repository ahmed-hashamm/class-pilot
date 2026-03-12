'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createAttendance } from '@/actions/ClassFeaturesActions'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface AttendanceInputProps {
  classId: string
  onSuccess?: () => void
}

export default function AttendanceInput({ classId, onSuccess }: AttendanceInputProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) {
      toast.error('Date is required')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createAttendance(classId, date, title)
      if (result.success) {
        toast.success('Attendance created')
        setTitle('')
        if (onSuccess) onSuccess()
      } else {
        toast.error(result.error || 'Failed to create attendance')
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                placeholder="e.g. Lecture 4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            {onSuccess && (
              <Button type="button" variant="ghost" onClick={onSuccess}>
                Cancel
              </Button>
            )}
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Post Attendance
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
