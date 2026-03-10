// 'use client'

// import { useState } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { Button } from '@/components/ui/button'
// import { Sparkles } from 'lucide-react'
// interface AIGradingButtonProps {
//   submission: any
//   onGradingStart: () => void
//   onGradingComplete: () => void
// }

// export default function AIGradingButton({
//   submission,
//   onGradingStart,
//   onGradingComplete,
// }: AIGradingButtonProps) {
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const supabase = createClient()

//   const handleAIGrading = async () => {
//     if (!confirm('Start AI grading? This will analyze the submission against the rubric.')) {
//       return
//     }

//     setLoading(true)
//     setError(null)
//     onGradingStart()

//     try {
//       const response = await fetch(
//         `/api/assignments/${submission.assignment_id}/grade/${submission.id}`,
//         {
//           method: 'POST',
//         }
//       )

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || 'Failed to grade submission')
//       }

//       onGradingComplete()
//     } catch (err: any) {
//       setError(err.message || 'Failed to grade submission')
//       onGradingComplete()
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="flex flex-col gap-4">
//       <div className="rounded-2xl bg-blue-50/50 p-5 border border-blue-100">
//         <p className="text-[11px] font-bold uppercase text-blue-600 mb-3 tracking-wider">
//           AI Evaluation
//         </p>
//         <p className="text-sm text-gray-600 mb-4 leading-relaxed">
//           The AI will analyze the submission text and files against your specific rubric criteria.
//         </p>
        
//         <Button
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl transition-all"
//           onClick={handleAIGrading}
//           disabled={loading || submission.ai_grade !== null}
//         >
//           {loading ? (
//             <div className="flex items-center gap-2">
//               <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//               <span>Analyzing...</span>
//             </div>
//           ) : (
//             <div className="flex items-center gap-2">
//               <Sparkles size={18} />
//               <span>{submission.ai_grade ? "Re-run AI Grade" : "Start AI Grading"}</span>
//             </div>
//           )}
//         </Button>
//       </div>
//       {error && <p className="text-xs text-red-500 font-medium px-2">{error}</p>}
//     </div>
//   );
// }


'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react'

interface AIGradingButtonProps {
  submission: any
  onGradingStart: () => void
  onGradingComplete: () => void
}

export default function AIGradingButton({
  submission, onGradingStart, onGradingComplete,
}: AIGradingButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const supabase  = createClient()

  const alreadyGraded = submission.ai_grade !== null

  const handleAIGrading = async () => {
    if (!confirm('Start AI grading? This will analyze the submission against the rubric.')) return

    setLoading(true); setError(null)
    onGradingStart()

    try {
      const res = await fetch(
        `/api/assignments/${submission.assignment_id}/grade/${submission.id}`,
        { method: 'POST' }
      )
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to grade submission')
      }
      onGradingComplete()
    } catch (err: any) {
      setError(err.message || 'Failed to grade submission')
      onGradingComplete()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Info card */}
      <div className="bg-navy/5 border border-navy/12 rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-navy flex items-center justify-center">
            <Sparkles size={13} className="text-yellow" />
          </div>
          <p className="text-[12px] font-bold uppercase tracking-widest text-navy">
            AI evaluation
          </p>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The AI will analyze the submission text and files against your specific rubric criteria
          and produce a suggested grade with feedback.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={handleAIGrading}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2
          bg-navy text-white font-bold text-[14px] py-3 rounded-xl
          hover:bg-navy/90 transition disabled:opacity-60 cursor-pointer border-none">
        {loading ? (
          <><Loader2 size={15} className="animate-spin" />Analyzing…</>
        ) : alreadyGraded ? (
          <><RefreshCw size={15} />Re-run AI grade</>
        ) : (
          <><Sparkles size={15} />Start AI grading</>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200
          text-red-600 text-[13px] font-semibold px-4 py-3 rounded-xl">
          <AlertCircle size={14} /> {error}
        </div>
      )}
    </div>
  )
}