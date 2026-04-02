'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Calculator, Info, AlertCircle, Loader2, Sparkles, Wand2 } from 'lucide-react'
import { generateAIGradingCriteria, saveRubricAction } from '@/actions/ClassFeaturesActions'
import { toast } from 'sonner'


interface Criterion {
  id: string
  name: string
  description: string
  points: number
}

interface RubricFormProps {
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
  const [aiTitle, setAiTitle] = useState('')
  const [aiDescription, setAiDescription] = useState('')
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false)

  const [criteria, setCriteria] = useState<Criterion[]>(
    initialData?.criteria || [{ id: crypto.randomUUID(), name: '', description: '', points: 10 }]
  )

  const handleGenerateAI = async () => {
    if (!aiTitle || !aiDescription) {
      toast.error('Please provide assignment details')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const { data, error: aiError } = await generateAIGradingCriteria({
        title: aiTitle,
        description: aiDescription,
      })

      if (aiError) throw new Error(aiError)
      if (!data) throw new Error('No data received')

      // Map AI criteria to the form format
      const formattedCriteria = data.map((c: any) => ({
        id: crypto.randomUUID(),
        name: c.name,
        description: c.description,
        points: c.points,
      }))

      setCriteria(formattedCriteria)
      if (!name) setName(aiTitle) // Use title as name if name is empty
      setIsAiPanelOpen(false)
      toast.success('Rubric generated successfully!')
    } catch (err: any) {
      setError(err.message || 'Failed to generate rubric')
      toast.error('AI generation failed')
    } finally {
      setIsGenerating(false)
    }
  }


  const totalPoints = criteria.reduce((sum, c) => sum + c.points, 0)

  const addCriterion = () => setCriteria([
    ...criteria,
    { id: crypto.randomUUID(), name: '', description: '', points: 10 },
  ])

  const removeCriterion = (id: string) => {
    if (criteria.length > 1) setCriteria(criteria.filter((c) => c.id !== id))
  }

  const updateCriterion = (id: string, field: keyof Criterion, value: string | number) =>
    setCriteria(criteria.map((c) => (c.id === id ? { ...c, [field]: value } : c)))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading || isGenerating) return

    setLoading(true)
    setError(null)

    const payload = {
      id: initialData?.id,
      name: name.trim() || aiTitle || 'Untitled Rubric',
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
      <div className={`bg-navy/5 border ${isAiPanelOpen ? 'border-navy/20 shadow-lg' : 'border-dashed border-navy/20'} rounded-2xl overflow-hidden transition-all`}>
        <button
          type="button"
          onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
          className="w-full flex items-center justify-between p-4 bg-white hover:bg-navy/5 transition group"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-navy/10 flex items-center justify-center text-navy">
              <Sparkles size={18} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-[14px] text-foreground">AI Rubric Generator</h3>
              <p className="text-[11px] text-muted-foreground">Generate criteria automatically from your assignment details</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${isAiPanelOpen ? 'bg-navy text-white' : 'bg-navy/10 text-navy group-hover:bg-navy group-hover:text-white'}`}>
            {isAiPanelOpen ? 'Close' : 'Try it'}
          </div>
        </button>

        {isAiPanelOpen && (
          <div className="p-6 flex flex-col gap-5 bg-white border-t border-border">
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Assignment context title</label>
              <input
                value={aiTitle}
                onChange={(e) => setAiTitle(e.target.value)}
                placeholder="e.g. Victorian Poetry Analysis Essay"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Assignment instructions/description</label>
              <textarea
                value={aiDescription}
                onChange={(e) => setAiDescription(e.target.value)}
                placeholder="Paste your assignment instructions here. Include what you want students to focus on..."
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGenerating || !aiTitle || !aiDescription}
                className="inline-flex items-center gap-2 bg-navy text-white font-black text-[13px] px-6 py-3 rounded-xl hover:bg-navy/90 transition shadow-md disabled:opacity-50"
              >
                {isGenerating ? (
                  <><Loader2 size={16} className="animate-spin" /> Generating...</>
                ) : (
                  <><Wand2 size={16} /> Generate Grading Criteria</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between
          pb-4 border-b border-border">
          <div>
            <h2 className="font-black text-[17px] tracking-tight">Grading criteria</h2>
            <p className="text-[13px] text-muted-foreground">
              Define how this assignment will be evaluated
            </p>
          </div>
          <button
            type="button"
            onClick={addCriterion}
            className="inline-flex items-center gap-2 text-[13px] font-semibold
              px-4 py-2.5 bg-white border border-border rounded-xl text-foreground
              hover:text-navy hover:border-navy/30 transition cursor-pointer">
            <Plus size={14} /> Add criterion
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {criteria.map((criterion, index) => (
            <div key={criterion.id}
              className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-4
                hover:border-navy/20 transition relative">

              {/* Index badge */}
              <div className="absolute -top-3 -left-3 size-6 bg-navy text-yellow
                rounded-full flex items-center justify-center text-[11px] font-black">
                {index + 1}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Name */}
                <div className="sm:col-span-3 flex flex-col gap-1.5">
                  <label className={labelClass}>Criterion name</label>
                  <input
                    value={criterion.name}
                    onChange={(e) => updateCriterion(criterion.id, 'name', e.target.value)}
                    required
                    placeholder="e.g. Grammar & Punctuation"
                    className={inputClass}
                  />
                </div>

                {/* Points */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Max points</label>
                  <input
                    type="number" min="0" step="0.5"
                    value={criterion.points}
                    onChange={(e) =>
                      updateCriterion(criterion.id, 'points', parseFloat(e.target.value) || 0)
                    }
                    required
                    className={`${inputClass} text-center font-bold`}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold
                  tracking-[.18em] uppercase text-navy">
                  <Info size={11} /> Description
                  <span className="font-medium text-muted-foreground normal-case
                    tracking-normal">(optional)</span>
                </label>
                <textarea
                  value={criterion.description}
                  onChange={(e) => updateCriterion(criterion.id, 'description', e.target.value)}
                  rows={2}
                  placeholder="Describe what a student must do to earn full points…"
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Remove */}
              {criteria.length > 1 && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeCriterion(criterion.id)}
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold
                      text-muted-foreground hover:text-red-500 transition
                      cursor-pointer bg-transparent border-none">
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

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
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="flex-1 sm:flex-none px-5 py-2.5 font-semibold text-[14px]
                text-muted-foreground border border-border rounded-xl
                hover:text-foreground hover:border-navy/30 transition
                cursor-pointer bg-white disabled:opacity-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isGenerating}
              className="flex-1 sm:flex-none inline-flex items-center justify-center
                gap-2 bg-navy text-white font-bold text-[14px] px-6 py-2.5
                rounded-xl hover:bg-navy/90 transition disabled:opacity-60
                cursor-pointer border-none">
              {loading
                ? <><Loader2 size={14} className="animate-spin" />Saving…</>
                : isGenerating ? <><Loader2 size={14} className="animate-spin" />Processing AI…</>
                  : isEditing ? 'Update rubric' : 'Create rubric'
              }
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
