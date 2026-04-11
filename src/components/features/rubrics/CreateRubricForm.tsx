/**
 * @file CreateRubricForm.tsx
 * @description Form to create or edit a rubric. Uses AIGeneratorPanel for AI generation, and RubricCriteriaList for criteria management.
 */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator, AlertCircle, Loader2 } from 'lucide-react'
import { saveRubricAction } from '@/actions/ClassFeaturesActions'
import { toast } from 'sonner'
import { AIGeneratorPanel } from './AIGeneratorPanel'
import { RubricCriteriaList } from './RubricCriteriaList'
import { FeatureButton } from '@/components/ui/FeatureButton'
import { Button } from '@/components/ui/button'

export interface Criterion {
  id: string
  name: string
  description: string
  points: number
}

export interface RubricFormProps {
  userId: string
  initialData?: {
    id: string
    name: string
    criteria: Criterion[]
  }
}

const inputClass = `w-full bg-white border border-border rounded-xl px-4 py-3
  text-[14px] text-foreground placeholder:text-muted-foreground
  focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition`

const labelClass = `text-[11px] font-bold tracking-[.18em] uppercase text-navy`

export default function RubricForm({ userId, initialData }: RubricFormProps) {
  const router = useRouter()

  const isEditing = !!initialData

  const [loading, setLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState(initialData?.name || '')

  const [criteria, setCriteria] = useState<Criterion[]>(
    initialData?.criteria || [{ id: crypto.randomUUID(), name: '', description: '', points: 10 }]
  )

  const handleAIGenerationSuccess = (generatedCriteria: Criterion[], title: string) => {
    setCriteria(generatedCriteria);
    if (!name) setName(title); // Use title as name if name is empty
  };

  const totalPoints = criteria.reduce((sum, c) => sum + c.points, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading || isGenerating) return

    setLoading(true)
    setError(null)

    const payload = {
      id: initialData?.id,
      name: name.trim() || 'Untitled Rubric',
      criteria,
      total_points: totalPoints,
      created_by: userId
    }

    try {
      const { data, error: saveError } = await saveRubricAction(payload)

      if (saveError) throw new Error(saveError)
      if (!data) throw new Error('Failed to save rubric')

      toast.success(isEditing ? 'Rubric updated!' : 'Rubric created!')

      const newId = (data as any).id
      if (newId) {
        router.push(`/rubrics/${newId}`)
        router.refresh()
      }
    } catch (err: any) {
      const msg = err.message || 'An unexpected error occurred'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }

  }



  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-32">

      {/* AI Generator Panel */}
      <AIGeneratorPanel
        onSuccess={handleAIGenerationSuccess}
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
      />

      {/* Rubric name */}
      <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-2">
        <label htmlFor="name" className={labelClass}>Rubric name</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. Creative Writing Final Project"
          className={`${inputClass} text-[16px] font-semibold`}
        />
      </div>

      {/* Criteria builder */}
      <RubricCriteriaList
        criteria={criteria}
        setCriteria={setCriteria}
      />

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200
          text-red-600 text-[13px] font-semibold px-4 py-3 rounded-xl">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Sticky footer */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-10">
        <div className="bg-white/90 backdrop-blur-md border border-border rounded-2xl
          px-6 py-4 shadow-lg flex flex-col sm:flex-row items-center
          justify-between gap-4">

          {/* Total */}
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-navy flex items-center justify-center">
              <Calculator size={16} className="text-yellow" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest
                text-muted-foreground">
                Total weight
              </p>
              <p className="font-black text-[20px] tracking-tight leading-none">
                {totalPoints} pts
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              variant="outline"
              className="flex-1 sm:flex-none px-5 py-2.5"
            >
              Cancel
            </Button>
            <FeatureButton
              type="submit"
              disabled={loading || isGenerating}
              loading={loading || isGenerating}
              loadingLabel={loading ? "Saving…" : isGenerating ? "Processing AI…" : ""}
              label={isEditing ? 'Update rubric' : 'Create rubric'}
              className="flex-1 sm:flex-none px-6 py-2.5"
            />
          </div>
        </div>
      </div>
    </form>
  )
}
