'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPoll } from '@/actions/ClassFeaturesActions'
import { toast } from 'sonner'
import { Plus, Timer, SendHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FeatureButton, FormSection } from '@/components/ui'
import { PinToggle } from './PinToggle'

interface PollInputProps {
  classId: string
  onSuccess?: () => void
}

export default function PollInput({ classId, onSuccess }: PollInputProps) {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState<string[]>(['', ''])
  const [deadline, setDeadline] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async () => {
    const validOptions = options.map(o => o.trim()).filter(o => o !== '')
    if (!question.trim() || validOptions.length < 2) {
      toast.error('Question and at least 2 options are required')
      return
    }

    setLoading(true)
    try {
      const result = await createPoll(
        classId,
        question,
        validOptions,
        deadline ? new Date(deadline).toISOString() : undefined,
        isPinned
      )

      if (result.error) {
        toast.error(result.error || 'Failed to create poll')
      } else {
        toast.success('Poll created successfully')
        setQuestion('')
        setOptions(['', ''])
        setDeadline('')
        setIsPinned(false)
        if (onSuccess) onSuccess()
        router.refresh()
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5">
        <FormSection label="Poll Question" description="What do you want to ask the class?">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. When should we have the extra class?"
            className="rounded-xl border-border bg-gray-50/50 py-6"
          />
        </FormSection>

        <FormSection label="Options" description="Add choices for your students">
          <div className="space-y-3">
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2 group">
                <Input
                  value={opt}
                  onChange={(e) => {
                    const next = [...options]
                    next[i] = e.target.value
                    setOptions(next)
                  }}
                  placeholder={`Option ${i + 1}`}
                  className="rounded-xl border-border bg-gray-50/50"
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setOptions(options.filter((_, idx) => idx !== i))}
                    className="p-3 h-auto w-auto text-muted-foreground hover:text-red-500"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOptions([...options, ''])}
              className="text-[12px] font-bold text-navy hover:text-navy/80 flex items-center gap-1.5 px-1 mt-1"
            >
              <Plus size={14} /> Add another option
            </Button>
          </div>
        </FormSection>

        <FormSection label="Deadline (Optional)" description="When should the poll close?">
          <div className="relative">
            <Timer size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" />
            <Input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="pl-10 rounded-xl border-border bg-gray-50/50 py-6"
            />
          </div>
        </FormSection>
      </div>

      <div className="flex items-center justify-between border-t border-border/40 pt-6">
        <div className="flex items-center gap-3">
          <PinToggle
            pinned={isPinned}
            onToggle={setIsPinned}
          />
          {(question.trim() || options.some(o => o.trim()) || deadline) && (
            <FeatureButton
              label="Clear"
              variant="outline"
              onClick={() => {
                setQuestion('')
                setOptions(['', ''])
                setDeadline('')
                setIsPinned(false)
              }}
            />
          )}
        </div>
        <FeatureButton
          label="Create Poll"
          icon={SendHorizontal}
          loading={loading}
          disabled={!question.trim() || options.filter(o => o.trim()).length < 2}
          onClick={handleCreate}

        />
      </div>
    </div>
  )
}
