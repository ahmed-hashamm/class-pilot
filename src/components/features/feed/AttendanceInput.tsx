'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createAttendance } from '@/actions/ClassFeaturesActions'
import { toast } from 'sonner'
import { Calendar, Timer, SendHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { FeatureButton, FormSection } from '@/components/ui'
import { PinToggle } from './PinToggle'

interface AttendanceInputProps {
  classId: string
  onSuccess?: () => void
}

export default function AttendanceInput({ classId, onSuccess }: AttendanceInputProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [deadline, setDeadline] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async () => {
    if (!title.trim() || !date) {
      toast.error('Title and Date are required')
      return
    }

    setLoading(true)
    try {
      const result = await createAttendance(
        classId,
        date,
        title,
        deadline ? new Date(deadline).toISOString() : undefined,
        isPinned
      )

      if (result.success) {
        toast.success('Attendance session created')
        setTitle('')
        setDeadline('')
        setIsPinned(false)
        if (onSuccess) onSuccess()
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to create attendance')
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = title.trim() && date

  return (
    <div className="space-y-6">
      <div className="grid gap-5">
        <FormSection label="Attendance Title" description="e.g. Lecture 12: Introduction to React">
          <div className="relative">
            <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" />
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="What is this session about?"
              className="pl-10 rounded-xl border-border bg-gray-50/50 py-6"
            />
          </div>
        </FormSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormSection label="Session Date" description="Select the date of the session">
            <Input 
              type="date"
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="rounded-xl border-border bg-gray-50/50 py-6"
            />
          </FormSection>

          <FormSection label="Deadline (Optional)" description="When should registration close?">
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
      </div>

      <div className="flex items-center justify-between border-t border-border/40 pt-6">
        <div className="flex items-center gap-3">
          <PinToggle 
            pinned={isPinned} 
            onToggle={setIsPinned} 
          />
          {(title.trim() || deadline) && (
            <FeatureButton
              label="Clear"
              variant="ghost"
              onClick={() => {
                setTitle('')
                setDeadline('')
                setIsPinned(false)
              }}
            />
          )}
        </div>
        <FeatureButton
          label="Create Session"
          icon={SendHorizontal}
          loading={loading}
          disabled={!isFormValid || loading}
          onClick={handleCreate}
          className="min-w-[180px] py-6 shadow-md"
          size="lg"
        />
      </div>
    </div>
  )
}
