import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

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

export interface AIUsageLogData {
  user_id: string
  action_type: 'grading' | 'rubric_generation'
  model: string
  input_tokens: number
  output_tokens: number
  total_tokens: number
  cost_usd: number
  success: boolean
  error_message?: string
  submission_id?: string
  assignment_id?: string
}

async function logAIUsage(data: AIUsageLogData): Promise<void> {
  try {
    const supabase = createAdminClient()
    const { error } = await (supabase as any).from('ai_usage_logs').insert({
      user_id: data.user_id,
      action_type: data.action_type,
      model: data.model,
      input_tokens: data.input_tokens,
      output_tokens: data.output_tokens,
      created_at: new Date().toISOString(),
    })
    if (error) {
      /* Silent failure */
    }
  } catch (err) {
    /* Silent failure */
  }
}

function calculateCost(inputTokens: number, outputTokens: number): number {
  const INPUT_COST_PER_1K = 0.00015
  const OUTPUT_COST_PER_1K = 0.0006
  return (inputTokens / 1000) * INPUT_COST_PER_1K + (outputTokens / 1000) * OUTPUT_COST_PER_1K
}

export async function generateRubricFromAssignment(
  title: string,
  description: string,
  userId: string
): Promise<RubricCriterion[]> {
  const model = 'gpt-4o-mini'
  
  const prompt = `You are an expert curriculum designer. Generate a professional grading rubric for an assignment based on its title and description.
  
  ASSIGNMENT TITLE: ${title}
  ASSIGNMENT DESCRIPTION: ${description}
  
  Please provide 3-5 distinct grading criteria. For each criterion, provide:
  1. A clear name
  2. A VERY CONCISE description (1-2 lines max) of what constitutes excellence
  3. Maximum points (ensure total points across all criteria add up to 100)
  
  Respond ONLY in JSON format with this structure:
  {
    "criteria": [
      {
        "name": "Criterion Name",
        "description": "Very brief summary",
        "points": 20
      }
    ]
  }`

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an educational consultant. Keep criterion descriptions extremely concise (1-2 lines max) to minimize output size.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' },
    })


    const inputTokens = completion.usage?.prompt_tokens || 0
    const outputTokens = completion.usage?.completion_tokens || 0
    
    await logAIUsage({
      user_id: userId,
      action_type: 'rubric_generation',
      model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      total_tokens: inputTokens + outputTokens,
      cost_usd: calculateCost(inputTokens, outputTokens),
      success: true,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) throw new Error('No content returned from AI')

    const parsed = JSON.parse(content)
    return (parsed.criteria || []).map((c: any, index: number) => ({
      id: `ai_${Date.now()}_${index}`,
      ...c,
    }))
  } catch (error) {
    throw error
  }
}

export async function gradeSubmission(
  submission: SubmissionContent,
  assignmentDescription: string,
  rubric: Rubric,
  userId: string,
  submissionId: string,
  assignmentId: string
): Promise<GradingResult> {
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

  const model = 'gpt-4o-mini'

  try {

    const completion = await openai.chat.completions.create({
      model,
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
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const inputTokens = completion.usage?.prompt_tokens || 0
    const outputTokens = completion.usage?.completion_tokens || 0
    const totalTokens = completion.usage?.total_tokens || 0


    await logAIUsage({
      user_id: userId,
      submission_id: submissionId,
      assignment_id: assignmentId,
      action_type: 'grading',
      model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      total_tokens: totalTokens,
      cost_usd: calculateCost(inputTokens, outputTokens),
      success: true,
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error('No response from AI')
    }

    const result = JSON.parse(responseContent) as GradingResult

    result.scores = result.scores.map((score) => {
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

    const totalMaxScore = rubric.criteria.reduce((sum, c) => sum + c.points, 0)
    const calculatedTotal = result.scores.reduce((sum, s) => sum + s.score, 0)

    if (totalMaxScore !== rubric.total_points) {
      result.total_score = Math.round((calculatedTotal / totalMaxScore) * rubric.total_points * 100) / 100
    } else {
      result.total_score = calculatedTotal
    }

    return result
  } catch (error) {

    await logAIUsage({
      user_id: userId,
      submission_id: submissionId,
      assignment_id: assignmentId,
      action_type: 'grading',
      model,
      input_tokens: 0,
      output_tokens: 0,
      total_tokens: 0,
      cost_usd: 0,
      success: false,
      error_message: error instanceof Error ? error.message : 'Unknown error',
    })

    throw new Error(`Failed to grade submission: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
