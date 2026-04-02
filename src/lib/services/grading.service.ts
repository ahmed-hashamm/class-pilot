import { createClient } from '@/lib/supabase/server'
import { gradeSubmission } from '@/lib/ai/grading'
import { extractTextFromSubmission } from '@/lib/ingestion/extract-text'
import { Database } from '@/types/database'
import { SupabaseClient } from '@supabase/supabase-js'

export const GradingService = {
  /**
   * Orchestrates the full AI grading pipeline for a submission.
   * Extraction -> AI Grading -> Persistence
   */
  async performAIGrading(assignmentId: string, submissionId: string, teacherId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>

    // 1. Fetch submission + assignment + rubric
    const { data: submission, error: submissionError } = await (supabase as any)
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
      throw new Error('Submission not found')
    }

    const assignment = submission.assignments
    const rubric = assignment?.rubrics

    if (!rubric) {
      throw new Error('No rubric attached to assignment')
    }

    // 2. Auth check (teacher role)
    const { data: member } = await (supabase as any)
      .from('class_members')
      .select('role')
      .eq('class_id', assignment.class_id)
      .eq('user_id', teacherId)
      .maybeSingle()

    if (!member || member.role !== 'teacher') {
      throw new Error('Forbidden: Teacher access required')
    }

    // 3. Extract text from content and files
    let extractedText = ''
    const files = (submission.files as any[]) || []
    
    if (files.length > 0) {
      try {
        const attachments = files.map((f: any) => {
          let path = f.path;
          
          if (!path && f.url && typeof f.url === 'string') {
            // Attempt to extract the relative path from the public URL
            // Format is usually: .../storage/v1/object/public/[bucket]/[path]
            // or .../storage/v1/object/[bucket]/[path]
            const bucketSegment = '/assignments/';
            const bucketIndex = f.url.indexOf(bucketSegment);
            if (bucketIndex !== -1) {
              path = f.url.substring(bucketIndex + bucketSegment.length);
            }
          }

          const finalPath = path || f.name;
          const extension = (finalPath || '').split('.').pop() || '';

          return {
            path: finalPath,
            type: f.type || extension,
          }
        })
        
        extractedText = await extractTextFromSubmission(supabase as any, attachments)
      } catch (err) {
        console.error('[GradingService] Text extraction failed:', err)
      }
    }

    const fullContent = {
      text: `${submission.content || ''}\n\n${extractedText}`.trim(),
      files: files,
    }

    if (!fullContent.text) {
      throw new Error('Submission has no text or documents to grade')
    }

    // 4. Call AI Grading
    const gradingResult = await gradeSubmission(
      fullContent,
      assignment.description || assignment.title,
      {
        id: rubric.id,
        name: rubric.name,
        criteria: rubric.criteria,
        total_points: rubric.total_points,
      },
      teacherId,
      submissionId,
      assignmentId
    )

    // 5. Persist to DB as a draft
    const { error: updateError } = await (supabase as any)
      .from('submissions')
      .update({
        ai_grade: gradingResult.total_score,
        ai_feedback: gradingResult.overall_feedback,
      })
      .eq('id', submissionId)

    if (updateError) {
      console.error('[GradingService] DB update failed:', updateError)
      throw new Error(`Failed to save AI grade: ${updateError.message}`)
    }

    return gradingResult
  }
}
