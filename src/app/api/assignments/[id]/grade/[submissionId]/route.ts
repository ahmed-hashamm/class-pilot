import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { gradeSubmission, RubricCriterion } from '@/lib/ai/grading'
import { extractTextFromSubmission } from '@/lib/ingestion/extract-text'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; submissionId: string }> }
) {
  const supabase = await createClient()

  try {
    const { id: assignmentId, submissionId } = await params

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: submission, error: submissionError } = await (supabase)
      .from('submissions')
      .select(`
        *,
        assignments (
          id,
          class_id,
          description,
          title,
          rubrics (id, name, criteria, total_points)
        )
      `)
      .eq('id', submissionId)
      .eq('assignment_id', assignmentId)
      .maybeSingle()

    if (submissionError || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    const assignment = submission.assignments
    const rubric = assignment?.rubrics

    if (!rubric) {
      return NextResponse.json({ error: 'No rubric attached to assignment' }, { status: 400 })
    }

    const { data: member } = await (supabase as any)
      .from('class_members')
      .select('role')
      .eq('class_id', assignment.class_id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!member || member.role !== 'teacher') {
      return NextResponse.json({ error: 'Forbidden: Teacher access required' }, { status: 403 })
    }

    const submissionContent = {
      text: typeof submission.content === 'string' ? submission.content : undefined,
      files: (Array.isArray(submission.files) ? submission.files : []) as any[],
    }

    // Extract text from uploaded files if any
    let extractedText = ''
    if (submissionContent.files && submissionContent.files.length > 0) {
      try {
        // Map submission files to FileAttachment interface
        const attachments = submissionContent.files.map((f: any) => ({
          path: f.path || f.name, // Use path or name depending on schema
          type: f.type || (f.path?.split('.').pop() || ''),
        }))

        extractedText = await extractTextFromSubmission(supabase, attachments)
      } catch (err) {
        //continue with just the typed text if extraction fails
      }
    }

    const fullContent = {
      text: `${submissionContent.text || ''}\n\n${extractedText}`.trim(),
      files: submissionContent.files,
    }

    const gradingResult = await gradeSubmission(
      fullContent,
      assignment.description || assignment.title,
      {
        id: rubric.id,
        name: rubric.name,
        criteria: (rubric.criteria as unknown) as RubricCriterion[],
        total_points: rubric.total_points,
      },
      user.id,
      submissionId,
      assignmentId
    )

    const { error: updateError } = await (supabase)
      .from('submissions')
      .update({
        ai_grade: gradingResult.total_score,
        ai_feedback: gradingResult.overall_feedback,
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', submissionId)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      grade: gradingResult.total_score,
      feedback: gradingResult.overall_feedback,
      scores: gradingResult.scores,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to grade submission' },
      { status: 500 }
    )
  }
}
