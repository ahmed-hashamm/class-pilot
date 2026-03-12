'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPoll } from '@/actions/ClassFeaturesActions'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2, Timer, SendHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PollInputProps {
  classId: string
  onSuccess?: () => void
}

export default function PollInput({ classId, onSuccess }: PollInputProps) {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState<string[]>(['', ''])
  const [deadline, setDeadline] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const addOption = () => {
    if (options.length < 10) setOptions([...options, ''])
  }

  const removeOption = (index: number) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    const validOptions = options.filter(opt => opt.trim() !== '')

    if (!question.trim()) {
      toast.error('Question is required')
      return
    }
    if (validOptions.length < 2) {
      toast.error('Two options are required')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createPoll(
        classId,
        question,
        validOptions,
        deadline ? new Date(deadline).toISOString() : undefined,
      )
      if (result.success) {
        toast.success('Poll posted')
        setQuestion('')
        setOptions(['', ''])
        setDeadline('')
        if (onSuccess) onSuccess()
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to create poll')
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasContent = question.trim() || options.some(o => o.trim()) || deadline
  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <div className="space-y-6">
      
      {/* Inputs */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="poll-q" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Question
          </Label>
          <Input 
            id="poll-q"
            value={question} 
            onChange={(e) => setQuestion(e.target.value)} 
            placeholder="What's your question?" 
            className="rounded-xl border-border bg-gray-50/50 py-6"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Options
          </Label>
          <div className="grid gap-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="size-8 shrink-0 rounded-full border border-border bg-white 
                  flex items-center justify-center text-[11px] font-black text-navy shadow-sm">
                  {index + 1}
                </div>
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 rounded-xl border-border bg-gray-50/50"
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                    className="shrink-0 p-2 text-muted-foreground hover:text-red-500 rounded-lg"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {options.length < 10 && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addOption} 
              className="mt-1 rounded-xl border-dashed border-border/60 hover:border-navy/30 hover:bg-navy/5 text-muted-foreground"
            >
              <Plus size={16} className="mr-2" />
              Add another option
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="poll-deadline" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Response Deadline (Optional)
          </Label>
          <div className="relative">
            <Timer size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              id="poll-deadline"
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

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-end gap-4 pt-2">

        <div className="flex items-center gap-3">
          {hasContent && (
            <Button variant="ghost" onClick={() => { setQuestion(''); setOptions(['', '']); setDeadline(''); }} className="text-muted-foreground hover:text-red-500 rounded-xl">
              Clear
            </Button>
          )}
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !question.trim()}
            className="rounded-xl bg-navy hover:bg-navy/90 text-white min-w-[120px] py-6 shadow-md"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin mr-2" />
            ) : (
              <SendHorizontal size={18} className="mr-2" />
            )}
            Post Poll
          </Button>
        </div>
      </div>
    </div>
  )
}
