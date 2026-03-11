import { NextResponse } from 'next/server'
import { retrieveContext } from '@/lib/chat/retrieve-context'
import { buildPrompt } from '@/lib/chat/build-prompt'
import { chatComplete } from '@/lib/chat/chat-complete'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { question, classId } = await req.json()

  if (!question || !classId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // 1️⃣ Retrieve relevant chunks
  const contextChunks = await retrieveContext(question, classId)

  // 2️⃣ Build prompt
  const prompt = buildPrompt(contextChunks, question)

  // 3️⃣ Get AI answer
  const answer = await chatComplete(prompt)

  return NextResponse.json({ answer })
}
