// import { createClient } from '@/lib/supabase/server'
// import { redirect, notFound } from 'next/navigation'
// import Link from 'next/link'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { format } from 'date-fns'
// import { ChevronLeft, Pencil, FileText, Calendar, BarChart3 } from 'lucide-react'

// interface RubricCriterion {
//   id: string;
//   name: string;
//   description?: string;
//   points: number;
// }

// interface Rubric {
//   id: string;
//   name: string;
//   created_at: string;
//   total_points: number;
//   criteria: RubricCriterion[];
// }

// export default async function RubricDetailPage({
//   params,
// }: {
//   params: Promise<{ id: string }>
// }) {
//   const { id } = await params
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()

//   if (!user) {
//     redirect('/login')
//   }

//   const { data: rubric, error: rubricError } = await supabase
//     .from('rubrics') 
//     .select('*')
//     .eq('id', id)
//     .eq('created_by', user.id)
//     .single() as { data: Rubric | null, error: any }

//   if (rubricError || !rubric) {
//     notFound()
//   }

//   const criteria = Array.isArray(rubric.criteria) ? rubric.criteria : []

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-8">
//       {/* 1. TOP NAVIGATION */}
//       <div className="flex items-center justify-between">
//         <Link 
//           href="/rubrics" 
//           className="flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors gap-1"
//         >
//           <ChevronLeft size={16} />
//           Back to Rubrics
//         </Link>
//         <Link href={`/rubrics/${rubric.id}/edit`} className="flex items-center p-2 border rounded-md text-sm font-medium bg-white text-orange-600 hover:text-white hover:bg-orange-600 transition-colors gap-2">
//           <Pencil size={14} />
//           Edit Rubric
//         </Link>
//       </div>

//       {/* 2. HEADER SECTION */}
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-8">
//         <div className="space-y-2">
//           <div className="flex items-center gap-3 text-orange-600">
//             <FileText size={20} />
//             <span className="text-sm font-bold uppercase tracking-widest">Rubric Template</span>
//           </div>
//           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
//             {rubric.name}
//           </h1>
//           <div className="flex items-center gap-4 text-sm text-gray-500">
//             <span className="flex items-center gap-1">
//               <Calendar size={14} />
//               {format(new Date(rubric.created_at), 'MMMM d, yyyy')}
//             </span>
//             <span className="flex items-center gap-1">
//               <BarChart3 size={14} />
//               {criteria.length} Criteria
//             </span>
//           </div>
//         </div>

//         <div className="bg-orange-50 px-6 py-4 rounded-2xl border border-orange-100 text-center">
//           <p className="text-[10px] font-bold uppercase text-orange-600 tracking-widest">Total Value</p>
//           <p className="text-3xl font-black text-orange-700">{rubric.total_points} <span className="text-sm font-medium">pts</span></p>
//         </div>
//       </div>

//       {/* 3. CRITERIA LIST */}
//       <div className="space-y-4">
//         <h2 className="text-lg font-bold text-gray-800">Evaluation Criteria</h2>
//         <div className="grid gap-3">
//           {criteria.map((criterion, index) => (
//             <Card key={criterion.id || index} className="border-gray-100 shadow-sm hover:border-orange-200 transition-all">
//               <CardContent className="p-0">
//                 <div className="flex flex-col sm:flex-row items-stretch">
//                   {/* Point Label Side */}
//                   <div className="sm:w-32 bg-gray-50/50 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-100 p-4">
//                     <span className="text-2xl font-black text-gray-700">{criterion.points}</span>
//                     <span className="text-[10px] font-bold uppercase text-gray-400">Points</span>
//                   </div>

//                   {/* Content Side */}
//                   <div className="flex-1 p-5">
//                     <div className="flex items-start justify-between">
//                       <div className="space-y-1">
//                         <h3 className="font-bold text-gray-900 flex items-center gap-2">
//                           <span className="text-orange-500 text-xs">{String(index + 1).padStart(2, '0')}</span>
//                           {criterion.name}
//                         </h3>
//                         {criterion.description ? (
//                           <p className="text-sm text-gray-600 leading-relaxed">
//                             {criterion.description}
//                           </p>
//                         ) : (
//                           <p className="text-xs italic text-gray-400">No description provided.</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {/* 4. FOOTER INFO */}
//       <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 flex gap-3 items-start">
//         <div className="text-blue-500 mt-0.5">
//           <BarChart3 size={18} />
//         </div>
//         <p className="text-xs text-blue-700 leading-relaxed">
//           <strong>Tip:</strong> This rubric can be attached to any assignment. When grading, you can click on these criteria to automatically calculate the student&apos;s score.
//         </p>
//       </div>
//     </div>
//   )
// }
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ChevronLeft, Pencil, FileText, Calendar, BarChart3, BookOpen, Lightbulb } from 'lucide-react'

interface RubricCriterion {
  id: string
  name: string
  description?: string
  points: number
}

interface Rubric {
  id: string
  name: string
  created_at: string
  total_points: number
  criteria: RubricCriterion[]
}

export default async function RubricDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: rubric, error: rubricError } = await supabase
    .from('rubrics')
    .select('*')
    .eq('id', id)
    .eq('created_by', user.id)
    .single() as { data: Rubric | null; error: any }

  if (rubricError || !rubric) notFound()

  const criteria = Array.isArray(rubric.criteria) ? rubric.criteria : []

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-8">

      {/* Top nav */}
      <div className="flex items-center justify-between">
        <Link href="/rubrics"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold
            text-muted-foreground hover:text-navy transition-colors">
          <ChevronLeft size={15} /> Back to rubrics
        </Link>

        <Link href={`/rubrics/${rubric.id}/edit`}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold
            px-4 py-2 bg-white border border-border rounded-xl text-foreground
            hover:text-navy hover:border-navy/30 transition-all">
          <Pencil size={13} /> Edit rubric
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between
        pb-6 border-b border-border">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-navy flex items-center justify-center">
              <BookOpen size={14} className="text-yellow" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-navy">
              Rubric template
            </span>
          </div>
          <h1 className="font-black text-[clamp(22px,3vw,32px)] tracking-tight leading-tight">
            {rubric.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-[12px]
            text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {format(new Date(rubric.created_at), 'MMMM d, yyyy')}
            </span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1.5">
              <BarChart3 size={12} />
              {criteria.length} criteria
            </span>
          </div>
        </div>

        {/* Total points card */}
        <div className="shrink-0 bg-navy rounded-2xl px-6 py-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">
            Total value
          </p>
          <p className="font-black text-[32px] text-yellow leading-none">
            {rubric.total_points}
            <span className="text-[16px] text-white/40"> pts</span>
          </p>
        </div>
      </div>

      {/* Criteria list */}
      <div className="flex flex-col gap-3">
        <h2 className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">
          Evaluation criteria
        </h2>

        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          {criteria.map((criterion, index) => (
            <div key={criterion.id || index}
              className={`flex items-stretch
                ${index < criteria.length - 1 ? 'border-b border-border' : ''}`}>

              {/* Points side */}
              <div className="w-20 sm:w-24 shrink-0 bg-secondary/60 border-r border-border
                flex flex-col items-center justify-center p-4 gap-0.5">
                <span className="font-black text-[22px] text-foreground leading-none">
                  {criterion.points}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wide
                  text-muted-foreground">
                  pts
                </span>
              </div>

              {/* Content side */}
              <div className="flex-1 p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-navy/50">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-bold text-[14px] text-foreground">
                    {criterion.name}
                  </h3>
                </div>
                {criterion.description ? (
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {criterion.description}
                  </p>
                ) : (
                  <p className="text-[12px] italic text-muted-foreground/60">
                    No description provided.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="flex items-start gap-3 bg-yellow/10 border border-yellow/30
        rounded-2xl px-5 py-4">
        <Lightbulb size={15} className="text-navy shrink-0 mt-0.5" />
        <p className="text-[13px] text-navy leading-relaxed">
          <strong>Tip:</strong> This rubric can be attached to any assignment. When grading,
          criteria will be used to automatically calculate the student&apos;s score.
        </p>
      </div>
    </div>
  )
}