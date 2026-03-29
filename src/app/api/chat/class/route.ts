import { NextResponse } from 'next/server'
import { retrieveContext } from '@/lib/chat/retrieve-context'
import { buildPrompt } from '@/lib/chat/build-prompt'
import { chatComplete } from '@/lib/chat/chat-complete'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { question, classId, history } = await req.json()

  if (!question || !classId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Build a search query that combines the current question with recent context
  const recentContext = (history || [])
    .slice(-4)
    .filter((m: any) => m.role === 'user')
    .map((m: any) => m.content)
    .join(' ')

  const searchQuery = recentContext
    ? `${recentContext} ${question}`
    : question

  // 1️⃣ Retrieve relevant chunks using enriched query
  const contextChunks = await retrieveContext(searchQuery, classId)

  // 2️⃣ Build prompt with conversation history
  const prompt = buildPrompt([contextChunks], question, history || [])

  // 3️⃣ Get AI answer
  const { content: answer, usage } = await chatComplete(prompt)

  // 4️⃣ Log usage (Background)
  if (usage) {
    const adminClient = createAdminClient()
    adminClient.from('ai_usage_logs').insert({
      user_id: user.id,
      action_type: 'class_assistant',
      model: 'gpt-4o-mini',
      input_tokens: usage.prompt_tokens,
      output_tokens: usage.completion_tokens,
    }).then(({ error }) => {
      if (error) console.error('Failed to log AI usage:', error)
    })
  }

  return NextResponse.json({ answer })
}
