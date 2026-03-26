import { NextResponse } from 'next/server'
import { retrieveContext } from '@/lib/chat/retrieve-context'
import { buildPrompt } from '@/lib/chat/build-prompt'
import { chatComplete } from '@/lib/chat/chat-complete'
import { createClient } from '@/lib/supabase/server'

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
  // This helps the vector search find relevant chunks for follow-up questions
  const recentContext = (history || [])
    .slice(-4) // last 2 exchanges (user + assistant)
    .filter((m: any) => m.role === 'user')
    .map((m: any) => m.content)
    .join(' ')

  const searchQuery = recentContext
    ? `${recentContext} ${question}`
    : question

  // 1️⃣ Retrieve relevant chunks using enriched query
  const contextChunks = await retrieveContext(searchQuery, classId)

  // 2️⃣ Build prompt with conversation history
  const prompt = buildPrompt(contextChunks, question, history || [])

  // 3️⃣ Get AI answer
  const answer = await chatComplete(prompt)

  return NextResponse.json({ answer })
}
