'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createPoll } from '@/actions/ClassFeaturesActions'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2 } from 'lucide-react'

interface PollInputProps {
  classId: string
  onSuccess?: () => void
}

export default function PollInput({ classId, onSuccess }: PollInputProps) {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState<string[]>(['', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ''])
    }
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validOptions = options.filter(opt => opt.trim() !== '')

    if (!question.trim()) {
      toast.error('Question is required')
      return
    }
    if (validOptions.length < 2) {
      toast.error('At least two valid options are required')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createPoll(classId, question, validOptions)
      if (result.success) {
        toast.success('Poll created')
        setQuestion('')
        setOptions(['', ''])
        if (onSuccess) onSuccess()
      } else {
        toast.error(result.error || 'Failed to create poll')
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
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              placeholder="Ask your class..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label>Options</Label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required={index < 2}
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                    className="h-8 w-8 p-0 shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
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
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Option
            </Button>
          )}

          <div className="flex justify-end gap-2 pt-2">
            {onSuccess && (
              <Button type="button" variant="ghost" onClick={onSuccess}>
                Cancel
              </Button>
            )}
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Post Poll
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
