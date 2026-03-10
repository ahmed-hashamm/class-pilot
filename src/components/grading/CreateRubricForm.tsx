// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { createClient } from '@/lib/supabase/client'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Card } from '@/components/ui/card'
// import { Trash2, Plus, Calculator, Info } from 'lucide-react'


// interface Criterion {
//   id: string;
//   name: string;
//   description: string;
//   points: number;
// }

// interface RubricFormProps {
//   userId: string;
//   initialData?: {
//     id: string;
//     name: string;
//     criteria: Criterion[];
//   };
// }

// export default function RubricForm({ userId, initialData }: RubricFormProps) {
//   const supabase = createClient();
//   const router = useRouter();
//   const isEditing = !!initialData;

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [name, setName] = useState(initialData?.name || "");
//   const [criteria, setCriteria] = useState<Criterion[]>(
//     initialData?.criteria || [{ id: crypto.randomUUID(), name: "", description: "", points: 10 }]
//   );

//   // --- Helper Functions ---
//   const calculateTotalPoints = () => criteria.reduce((sum, c) => sum + c.points, 0);

//   const addCriterion = () => {
//     setCriteria([
//       ...criteria,
//       { id: crypto.randomUUID(), name: "", description: "", points: 10 }
//     ]);
//   };

//   const removeCriterion = (id: string) => {
//     if (criteria.length > 1) {
//       setCriteria(criteria.filter((c) => c.id !== id));
//     }
//   };

//   const updateCriterion = (id: string, field: keyof Criterion, value: string | number) => {
//     setCriteria(
//       criteria.map((c) => (c.id === id ? { ...c, [field]: value } : c))
//     );
//   };

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setLoading(true);
//   //   setError(null);

//   //   const payload = {
//   //     name,
//   //     criteria,
//   //     total_points: calculateTotalPoints(),
//   //     created_by: userId,
//   //   };

//   //   try {
//   //     let result;
//   //     if (isEditing && initialData) {
//   //       result = await supabase
//   //         .from("rubrics")
//   //         .update(payload)
//   //         .eq("id", initialData.id)
//   //         .select()
//   //         .single();
//   //     } else {
//   //       result = await supabase
//   //         .from("rubrics")
//   //         .insert(payload)
//   //         .select()
//   //         .single();
//   //     }

//   //     if (result.error) throw result.error;

//   //     router.push(`/rubrics/${(result.data as any).id}`);
//   //     router.refresh();
//   //   } catch (err: any) {
//   //     setError(err.message || "An unexpected error occurred");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     // Explicitly define the payload structure
//     const payload = {
//       name,
//       criteria, // This is the array of Criterion objects
//       total_points: calculateTotalPoints(),
//       created_by: userId,
//     };

//     try {
//       let result;
//       if (isEditing && initialData) {
//         result = (await supabase as any)
//           .from("rubrics")
//           .update(payload) 
//           .eq("id", initialData.id)
//           .select()
//           .single();
//       } else {
//         result = await supabase
//           .from("rubrics")
//           .insert(payload as any)
//           .select()
//           .single();
//       }

//       if (result.error) throw result.error;

//       // Use optional chaining for navigation
//       const newId = (result.data as any).id;
//       if (newId) {
//         router.push(`/rubrics/${newId}`);
//         router.refresh();
//       }
//     } catch (err: any) {
//       setError(err.message || "An unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <form onSubmit={handleSubmit} className="space-y-8 pb-10">
//       {/* SECTION 1: Header Info */}
//       <Card className="border-none shadow-none bg-transparent">
//         <div className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="name" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
//               Rubric Name
//             </Label>
//             <Input
//               id="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               placeholder="e.g., Creative Writing Final Project"
//               className="text-lg h-12 focus-visible:ring-orange-500 border-gray-200 bg-white"
//             />
//           </div>
//         </div>
//       </Card>

//       {/* SECTION 2: Criteria Builder */}
//       <div className="space-y-4">
//         <div className="flex flex-col items-start gap-4 md:flex-row md:items-center justify-between border-b pb-4">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">Grading Criteria</h2>
//             <p className="text-sm text-gray-500">Define how this assignment will be evaluated</p>
//           </div>
//           <Button 
//             type="button" 
//             variant="outline" 
//             size="sm" 
//             onClick={addCriterion} 
//             className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50"
//           >
//             <Plus size={16} />
//             Add Criterion
//           </Button>
//         </div>

//         <div className="space-y-6">
//           {criteria.map((criterion, index) => (
//             <div key={criterion.id} className="group relative bg-white border border-gray-200 rounded-xl p-6 transition-all hover:border-orange-300 hover:shadow-sm">
//               <div className="absolute -left-3 top-6 bg-orange-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
//                 {index + 1}
//               </div>

//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                   <div className="md:col-span-3 space-y-2">
//                     <Label className="text-xs font-bold uppercase text-gray-400">Criterion Name</Label>
//                     <Input
//                       value={criterion.name}
//                       onChange={(e) => updateCriterion(criterion.id, 'name', e.target.value)}
//                       required
//                       placeholder="e.g., Grammar & Punctuation"
//                       className="border-gray-100 focus-visible:ring-orange-500"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-xs font-bold uppercase text-gray-400">Max Points</Label>
//                     <Input
//                       type="number"
//                       min="0"
//                       step="0.5"
//                       value={criterion.points}
//                       onChange={(e) => updateCriterion(criterion.id, 'points', parseFloat(e.target.value) || 0)}
//                       required
//                       className="border-gray-100 focus-visible:ring-orange-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-1">
//                     <Info size={12} />
//                     Scoring Description (Optional)
//                   </Label>
//                   <textarea
//                     value={criterion.description}
//                     onChange={(e) => updateCriterion(criterion.id, 'description', e.target.value)}
//                     rows={2}
//                     className="flex w-full rounded-lg border border-gray-100 bg-gray-50/30 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 transition-all"
//                     placeholder="Describe what a student must do to earn full points..."
//                   />
//                 </div>

//                 {criteria.length > 1 && (
//                   <div className="flex justify-end pt-2">
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => removeCriterion(criterion.id)}
//                       className="text-gray-400 hover:text-red-500 hover:bg-red-50 gap-2 transition-colors"
//                     >
//                       <Trash2 size={14} />
//                       Remove
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* SECTION 3: Footer/Total Sticky Bar */}
//       <div className="sticky bottom-6 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 z-10">
//         <div className="flex items-center gap-3">
//           <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
//             <Calculator size={24} />
//           </div>
//           <div>
//             <p className="text-xs font-bold uppercase text-gray-400">Total Rubric Weight</p>
//             <p className="text-2xl font-black text-gray-900 tracking-tight">{calculateTotalPoints()} Points</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-3 w-full md:w-auto">
//           <Button
//             type="button"
//             variant="ghost"
//             onClick={() => router.back()}
//             disabled={loading}
//             className="flex-1 md:flex-none"
//           >
//             Cancel
//           </Button>
//           <Button 
//             type="submit" 
//             disabled={loading}
//             className="flex bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 shadow-md"
//           >
//             {loading ? 'Saving...' : isEditing ? 'Update Rubric' : 'Create Rubric'}
//           </Button>
//         </div>
//       </div>

//       {error && (
//         <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600">
//           {error}
//         </div>
//       )}
//     </form>
//   )
// }
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Plus, Calculator, Info, AlertCircle, Loader2 } from 'lucide-react'

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
  const supabase  = createClient()
  const router    = useRouter()
  const isEditing = !!initialData

  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [name,     setName]     = useState(initialData?.name || '')
  const [criteria, setCriteria] = useState<Criterion[]>(
    initialData?.criteria || [{ id: crypto.randomUUID(), name: '', description: '', points: 10 }]
  )

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
    setLoading(true); setError(null)

    const payload = { name, criteria, total_points: totalPoints, created_by: userId }

    try {
      let result
      if (isEditing && initialData) {
        result = await (supabase as any)
          .from('rubrics').update(payload).eq('id', initialData.id).select().single()
      } else {
        result = await supabase
          .from('rubrics').insert(payload as any).select().single()
      }

      if (result.error) throw result.error

      const newId = (result.data as any).id
      if (newId) { router.push(`/rubrics/${newId}`); router.refresh() }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-32">

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
              disabled={loading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center
                gap-2 bg-navy text-white font-bold text-[14px] px-6 py-2.5
                rounded-xl hover:bg-navy/90 transition disabled:opacity-60
                cursor-pointer border-none">
              {loading
                ? <><Loader2 size={14} className="animate-spin" />Saving…</>
                : isEditing ? 'Update rubric' : 'Create rubric'
              }
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}