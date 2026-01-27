// import { createClient } from '@/lib/supabase/server'
// import { gradeSubmission } from '@/lib/ai/grading'
// import { NextResponse } from 'next/server'

// export async function POST(
//   request: Request,
//   { params }: { params: Promise<{ id: string; submissionId: string }> }
// ) {
//   try {
//     const { id: assignmentId, submissionId } = await params
//     const supabase = await createClient()

//     // Verify user is authenticated and is a teacher
//     const {
//       data: { user },
//     } = await supabase.auth.getUser()

//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     // Get submission with assignment and rubric
//     const { data: submission, error: submissionError } = await supabase
//       .from('submissions')
//       .select('*, assignments(*, rubrics(*))')
//       .eq('id', submissionId)
//       .eq('assignment_id', assignmentId)
//       .single()

//     if (submissionError || !submission) {
//       return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
//     }

//     const assignment = submission.assignments
//     const rubric = assignment?.rubrics

//     if (!rubric) {
//       return NextResponse.json({ error: 'No rubric attached to assignment' }, { status: 400 })
//     }

//     // Verify user is a teacher in the class
//     const { data: member } = await supabase
//       .from('class_members')
//       .select('role')
//       .eq('class_id', assignment.class_id)
//       .eq('user_id', user.id)
//       .single()

//     if (!member || member.role !== 'teacher') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
//     }

//     // Prepare submission content for AI grading
//     const submissionContent = {
//       text: submission.content || undefined,
//       files: submission.files || undefined,
//     }

//     // Call AI grading service
//     const gradingResult = await gradeSubmission(
//       submissionContent,
//       assignment.description || assignment.title,
//       {
//         id: rubric.id,
//         name: rubric.name,
//         criteria: rubric.criteria as any,
//         total_points: rubric.total_points,
//       }
//     )

//     // Calculate total score from criteria scores
//     const totalScore = gradingResult.scores.reduce((sum, score) => sum + score.score, 0)

//     // Update submission with AI grade
//     const { error: updateError } = await supabase
//       .from('submissions')
//       .update({
//         ai_grade: totalScore,
//         ai_feedback: gradingResult.overall_feedback,
//         updated_at: new Date().toISOString(),
//       })
//       .eq('id', submissionId)

//     if (updateError) {
//       console.error('Error updating submission:', updateError)
//       return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 })
//     }

//     // Store individual criterion grades
//     const gradeRecords = gradingResult.scores.map((score) => ({
//       submission_id: submissionId,
//       rubric_criteria_id: score.criterion_id,
//       score: score.score,
//       feedback: score.feedback,
//       graded_by: user.id,
//     }))

//     const { error: gradesError } = await supabase.from('grades').insert(gradeRecords)

//     if (gradesError) {
//       console.error('Error storing grades:', gradesError)
//       // Don't fail the request if grade records fail
//     }

//     return NextResponse.json({
//       success: true,
//       grade: totalScore,
//       feedback: gradingResult.overall_feedback,
//       scores: gradingResult.scores,
//     })
//   } catch (error: any) {
//     console.error('AI Grading Error:', error)
//     return NextResponse.json(
//       { error: error.message || 'Failed to grade submission' },
//       { status: 500 }
//     )
//   }
// }

// import { NextResponse } from 'next/server';
// import { createClient } from '@/lib/supabase/server'; // Ensure this is your server-side client
// import { gradeSubmission } from '@/lib/ai/grading'; // Path to your OpenAI logic

// export async function POST(
//   request: Request,
//   { params }: { params: { assignmentId: string; submissionId: string } }
// ) {
//   const { assignmentId, submissionId } = params;
//   const supabase = createClient();

//   try {
//     // 1. Fetch submission data, assignment description, and rubric
//     // We join the assignments table to get the rubric and description needed for the AI prompt
//     const { data: submission, error: subError } = await supabase
//       .from('submissions')
//       .select(`
//         *,
//         assignments (
//           description,
//           rubrics (
//             id,
//             name,
//             criteria,
//             total_points
//           )
//         ),
//         files (*)
//       `)
//       .eq('id', submissionId)
//       .single();

//     if (subError || !submission) {
//       return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
//     }

//     const assignment = submission.assignments;
//     const rubric = assignment.rubrics;

//     // 2. Prepare the payload for your OpenAI function
//     const submissionContent = {
//       text: submission.content,
//       files: submission.files?.map((f: any) => ({
//         name: f.name,
//         url: f.url,
//         type: f.type
//       }))
//     };

//     // 3. Call the AI Grading Logic
//     const gradingResult = await gradeSubmission(
//       submissionContent,
//       assignment.description,
//       rubric
//     );

//     // 4. Update the submission in Supabase with the AI result
//     const { error: updateError } = await supabase
//       .from('submissions')
//       .update({
//         ai_grade: gradingResult, // Store the full JSON object (scores, feedback, total)
//         updated_at: new Date().toISOString()
//       })
//       .eq('id', submissionId);

//     if (updateError) throw updateError;

//     return NextResponse.json(gradingResult);
//   } catch (error: any) {
//     console.error('AI Grading Route Error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { gradeSubmission } from '@/lib/ai/grading'; // Adjust path to your OpenAI logic

export async function POST(
  request: Request,
  { params }: { params: { assignmentId: string; submissionId: string } }
) {
  const supabase = createClient();

  try {
    const { data: submission, error } = await supabase
      .from('submissions')
      .select(`
        *,
        assignments (
          description,
          rubrics (id, name, criteria, total_points)
        )
      `)
      .eq('id', params.submissionId)
      .single();

    if (error || !submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const result = await gradeSubmission(
      { text: submission.content, files: submission.files },
      submission.assignments.description,
      submission.assignments.rubrics
    );

    // Save strictly to AI columns to avoid overwriting manual data
    const { error: updateError } = await supabase
      .from('submissions')
      .update({
        ai_grade: result.total_score,
        ai_feedback: result.overall_feedback,
        // Optional: store detailed breakdown in a separate JSON column if you have one
      })
      .eq('id', params.submissionId);

    if (updateError) throw updateError;
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}