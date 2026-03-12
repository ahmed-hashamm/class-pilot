'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createAttendance } from '@/actions/ClassFeaturesActions'
import { toast } from 'sonner'
import { Loader2, Calendar, Timer, SendHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AttendanceInputProps {
  classId: string
  onSuccess?: () => void
}

export default function AttendanceInput({ classId, onSuccess }: AttendanceInputProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [deadline, setDeadline] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!date) {
      toast.error('Date is required')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createAttendance(
        classId,
        date,
        title || undefined,
        deadline ? new Date(deadline).toISOString() : undefined
      )

      if (result.success) {
        toast.success('Attendance session created')
        setTitle('')
        setDeadline('')
        if (onSuccess) onSuccess()
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to create attendance')
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasContent = title.trim() || deadline || date !== new Date().toISOString().split('T')[0]
  const formattedDate = new Date(date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })

  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <div className="space-y-6">
      
      {/* Inputs */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="att-title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Session Title (Optional)
          </Label>
          <Input 
            id="att-title"
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g. Lecture 12: Introduction to React"
            className="rounded-xl border-border bg-gray-50/50 py-6"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="att-date" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Session Date
            </Label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                id="att-date"
                type="date"
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="pl-10 rounded-xl border-border bg-gray-50/50 py-6"
              />
            </div>
            <p className="text-[11px] text-muted-foreground font-medium pl-1">
              Currently: {formattedDate}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="att-deadline" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Response Deadline (Optional)
            </Label>
            <div className="relative">
              <Timer size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                id="att-deadline"
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
      </div>

      {/* Info Card */}
      <div className="bg-yellow/5 border border-yellow/20 rounded-2xl p-4 flex items-start gap-4">
        <div className="size-10 rounded-xl bg-yellow/10 flex items-center justify-center text-navy shrink-0">
          <Calendar size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-navy">Take Attendance</h4>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">
            Students will be able to mark themselves as "Present" for this date. 
            You can lock the session manually later or set a deadline above.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {hasContent && (
          <Button 
            variant="ghost" 
            onClick={() => {
              setTitle('');
              setDate(new Date().toISOString().split('T')[0]);
              setDeadline('');
            }} 
            className="text-muted-foreground hover:text-red-500 rounded-xl"
          >
            Reset
          </Button>
        )}
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !date}
          className="rounded-xl bg-navy hover:bg-navy/90 text-white min-w-[160px] py-6 shadow-md"
        >
          {isSubmitting ? (
            <Loader2 size={18} className="animate-spin mr-2" />
          ) : (
            <SendHorizontal size={18} className="mr-2" />
          )}
          Create Session
        </Button>
      </div>
    </div>
  )
}
