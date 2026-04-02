"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SubmissionHeader } from "./SubmissionHeader"
import { SubmissionContent } from "./SubmissionContent"
import { GradingSidebar } from "./GradingSidebar"
import { publishAIGrade, setFinalGradeAction } from "@/actions/ClassFeaturesActions"

export interface GradingSubmissionProps {
  id: string
  assignment_id: string
  content: string | null
  files: { name: string; url: string }[] | null
  final_grade: number | null
  ai_grade: number | null
  manual_grade: number | null
  ai_feedback: string | null
  teacher_feedback: string | null
  status: string
  submitted_at: string | null
  created_at: string | null
  users: { full_name: string; avatar_url: string | null } | null
  assignments: { title: string; points: number; rubrics?: Record<string, unknown> } | null
}

export default function GradeSubmission({
  submission, classId,
}: {
  submission: GradingSubmissionProps
  classId: string
}) {
  const [gradingMode, setGradingMode] = useState<"ai" | "manual" | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const router = useRouter()

  const assignment = submission.assignments
  const hasAI = submission.ai_grade !== null
  const hasManual = submission.manual_grade !== null
  const isDraft = hasAI && submission.final_grade === null

  const handleSetFinalGrade = async (type: "ai" | "manual") => {
    setIsUpdating(true)
    const score = type === "ai" ? submission.ai_grade : submission.manual_grade
    if (score === null) {
      setIsUpdating(false)
      return
    }

    try {
      const result = await setFinalGradeAction({
        submissionId: submission.id,
        score: score
      })
      if (result.error) throw new Error(result.error)
      router.refresh()
    } catch (err) {
      console.error("Update failed:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePublishAIGrade = async () => {
    setIsPublishing(true)
    try {
      const result = await publishAIGrade(submission.id)
      if (result.success) {
        router.refresh()
      } else {
        console.error("Failed to publish AI grade:", result.error)
      }
    } catch (err) {
      console.error("Error publishing AI grade:", err)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 flex flex-col gap-6 min-h-screen">
      <SubmissionHeader 
        isDraft={isDraft} 
        finalGrade={submission.final_grade} 
        totalPoints={assignment?.points}
      />

      <div className="w-full flex flex-col lg:flex-row gap-8 items-start flex-1">
        <SubmissionContent 
          studentName={submission.users?.full_name}
          assignmentTitle={assignment?.title}
          submittedAt={submission.submitted_at}
          createdAt={submission.created_at}
          content={submission.content}
          files={submission.files || []}
        />

        <GradingSidebar 
          submission={submission}
          assignment={assignment}
          hasAI={hasAI}
          hasManual={hasManual}
          isDraft={isDraft}
          isUpdating={isUpdating}
          isPublishing={isPublishing}
          gradingMode={gradingMode}
          setGradingMode={setGradingMode}
          handleSetFinalGrade={handleSetFinalGrade}
          handlePublishAIGrade={handlePublishAIGrade}
          onGradingComplete={() => { setGradingMode(null); router.refresh(); }}
        />
      </div>
    </div>
  )
}
