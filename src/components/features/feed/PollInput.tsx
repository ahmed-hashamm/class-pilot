'use client'

/**
 * PollInput component manages the creation and UI of interactive polls.
 * It follows the Class Pilot design system with navy/yellow accents and rounded shapes.
 * 
 * @module features/feed/PollInput
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPoll } from '@/actions/ClassFeaturesActions'
import { toast } from 'sonner'
import { Timer, SendHorizontal, HelpCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { FeatureButton } from '@/components/common'
import { PollOptionsList } from './PollOptionsList'
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

  /**
   * Handles the poll creation logic.
   */
  const handleCreate = async () => {
    const validOptions = options.map(o => o.trim()).filter(o => o !== '')
    if (!question.trim() || validOptions.length < 2) {
      toast.error('Question and at least 2 valid options are required')
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

      if (result.success) {
        toast.success('Poll published to feed')
        setQuestion('')
        setOptions(['', ''])
        setDeadline('')
        setIsPinned(false)
        if (onSuccess) onSuccess()
        router.refresh()
      } else {
        toast.error(result.error || 'Check your poll details')
      }
    } catch (err: any) {
      toast.error('Failed to publish poll')
      console.error('Poll creation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const isFormDirty = question.trim() || options.some(o => o.trim()) || deadline

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid gap-10">
        {/* Question Input Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-navy/5 flex items-center justify-center">
              <HelpCircle size={14} className="text-navy" />
            </div>
            <label className="text-[11px] font-black tracking-[0.15em] uppercase text-navy/70">
              Poll Question
            </label>
          </div>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
            placeholder="e.g. Which topic should we cover in the next lecture?"
            className="rounded-2xl border-2 border-border bg-gray-50/30 py-8 px-6 text-[16px] font-bold text-navy placeholder:text-muted-foreground/40 focus:bg-white transition-all shadow-sm focus:ring-4 focus:ring-navy/5 focus:border-navy"
          />
        </div>

        {/* Options List Component */}
        <PollOptionsList 
          options={options} 
          onChange={setOptions} 
          disabled={loading} 
        />

        {/* Deadline Configuration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-navy/5 flex items-center justify-center">
              <Timer size={14} className="text-navy" />
            </div>
            <label className="text-[11px] font-black tracking-[0.15em] uppercase text-navy/70">
              Deadline (Optional)
            </label>
          </div>
          <div className="relative group">
            <Timer size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/30 group-focus-within:text-navy transition-colors" />
            <Input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              disabled={loading}
              min={new Date().toISOString().slice(0, 16)}
              className="pl-16 pr-6 rounded-2xl border-2 border-border bg-gray-50/30 py-8 font-bold text-navy focus:bg-white transition-all shadow-sm focus:ring-4 focus:ring-navy/5 focus:border-navy"
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between border-t-2 border-border/50 pt-8 mt-4">
        <div className="flex items-center gap-6">
          <PinToggle
            pinned={isPinned}
            onToggle={setIsPinned}
            disabled={loading}
          />
          {isFormDirty && !loading && (
            <button
              onClick={() => {
                setQuestion('')
                setOptions(['', ''])
                setDeadline('')
                setIsPinned(false)
              }}
              className="text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-red-500 transition cursor-pointer bg-transparent border-none"
            >
              Clear Draft
            </button>
          )}
        </div>
        
        <FeatureButton
          label="Create Poll"
          icon={SendHorizontal}
          loading={loading}
          disabled={!question.trim() || options.filter(o => o.trim()).length < 2}
          onClick={handleCreate}
          className="min-w-[200px] h-[60px] shadow-xl hover:shadow-2xl transition-all"
        />
      </div>
    </div>
  )
}
