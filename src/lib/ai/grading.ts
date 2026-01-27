import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface RubricCriterion {
  id: string
  name: string
  description: string
  points: number
  weight?: number
}

export interface Rubric {
  id: string
  name: string
  criteria: RubricCriterion[]
  total_points: number
}

export interface SubmissionContent {
  text?: string
  files?: Array<{ name: string; url: string; type: string }>
}

export interface GradingResult {
  scores: Array<{
    criterion_id: string
    criterion_name: string
    score: number
    max_score: number
    feedback: string
  }>
  total_score: number
  overall_feedback: string
}

export async function gradeSubmission(
  submission: SubmissionContent,
  assignmentDescription: string,
  rubric: Rubric
): Promise<GradingResult> {
  // Build the prompt for AI grading
  const criteriaText = rubric.criteria
    .map(
      (criterion, index) =>
        `${index + 1}. ${criterion.name} (${criterion.points} points)\n   ${criterion.description}`
    )
    .join('\n\n')

  const submissionText = submission.text || 'No text content provided.'
  const filesInfo =
    submission.files && submission.files.length > 0
      ? `\n\nFiles submitted:\n${submission.files.map((f) => `- ${f.name} (${f.type})`).join('\n')}`
      : ''

  const prompt = `You are an expert educator grading a student submission. Please evaluate the submission against the provided rubric criteria.

ASSIGNMENT DESCRIPTION:
${assignmentDescription}

RUBRIC CRITERIA:
${criteriaText}

STUDENT SUBMISSION:
${submissionText}${filesInfo}

Please provide:
1. A score for each criterion (0 to max points for that criterion)
2. Specific feedback for each criterion explaining the score
3. Overall feedback summarizing the submission

Respond in JSON format with this structure:
{
  "scores": [
    {
      "criterion_id": "criterion_1",
      "criterion_name": "Name of criterion",
      "score": 8,
      "max_score": 10,
      "feedback": "Detailed feedback for this criterion"
    }
  ],
  "total_score": 85,
  "overall_feedback": "Overall assessment of the submission"
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert educator providing fair, constructive, and detailed feedback on student assignments. Always provide specific, actionable feedback.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent grading
      response_format: { type: 'json_object' },
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error('No response from AI')
    }

    const result = JSON.parse(responseContent) as GradingResult

    // Validate and normalize the result
    result.scores = result.scores.map((score) => {
      // Ensure scores don't exceed max points
      const criterion = rubric.criteria.find((c) => c.id === score.criterion_id)
      if (criterion) {
        score.max_score = criterion.points
        if (score.score > criterion.points) {
          score.score = criterion.points
        }
        if (score.score < 0) {
          score.score = 0
        }
      }
      return score
    })

    // Recalculate total score based on actual rubric
    const totalMaxScore = rubric.criteria.reduce((sum, c) => sum + c.points, 0)
    const calculatedTotal = result.scores.reduce((sum, s) => sum + s.score, 0)
    
    // Normalize to rubric total_points if different
    if (totalMaxScore !== rubric.total_points) {
      result.total_score = (calculatedTotal / totalMaxScore) * rubric.total_points
    } else {
      result.total_score = calculatedTotal
    }

    return result
  } catch (error) {
    console.error('AI Grading Error:', error)
    throw new Error(`Failed to grade submission: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

