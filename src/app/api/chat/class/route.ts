// {working}//
import { NextResponse } from 'next/server'
import { retrieveContext } from '@/lib/chat/retrieve-context'
import { buildPrompt } from '@/lib/chat/build-prompt'
import { chatComplete } from '@/lib/chat/chat-complete'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStreamFeed } from '@/lib/db_data_fetching/stream'

export const dynamic = 'force-dynamic'

// Enrich short/vague questions into better vector search queries
const ENRICH_PROMPT = (q: string) => `
You are a search query optimizer for a classroom AI assistant.
Transform the user's question into a concise vector search query.

Rules:
- If the question is a follow-up (pronouns like "they", "it", "their", or vague references 
  like "the members", "the deadline"), resolve what it refers to using the context above 
  and include the full reference in the search query.
- Preserve exact document or file names if mentioned.
- Focus on the core information being requested.
- Return ONLY the search query, nothing else.

Examples:
Context: what is the project title in the Internship Final Report
Question: who are the members?
Output: Internship Final Report project members team

${q}
`


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

  const now = new Date()
  const adminClient = createAdminClient()

  // 1. Fetch live class feed (assignments, announcements, polls, attendance)
  const feed = await getStreamFeed(classId)

  const recentAssignments = feed
    .filter(item => item.type === 'assignment')
    .sort((a, b) => new Date((b as any).created_at).getTime() - new Date((a as any).created_at).getTime())
    .slice(0, 8)
    .map(item => {
      const a = item as any
      const isPast = a.due_date && new Date(a.due_date) < now
      const status = isPast ? '(Past)' : '(Upcoming)'
      const dateStr = a.due_date
        ? new Date(a.due_date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
        : 'No date'
      return `[Asgn] ${status} ${a.title} (Due: ${dateStr})`
    })
    .join('\n')

  const recentAnnouncements = feed
    .filter(item => item.type === 'announcement')
    .slice(0, 5)
    .map(item => {
      const a = item as any
      const safeTitle = (a.title || 'Class Update').replace(/\n/g, ' ')
      const safeContent = (a.content || '').replace(/\n/g, ' ').slice(0, 100)
      return `[Ann] ${safeTitle}: ${safeContent}...`
    })
    .join('\n')

  const activePolls = feed
    .filter(item => item.type === 'poll')
    .map(item => item as any)
    .filter(p => !p.closed_at && (!p.deadline || new Date(p.deadline) > now))
    .slice(0, 3)
    .map(p => {
      const deadline = p.deadline
        ? new Date(p.deadline).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : 'No deadline'
      return `[Poll] ${p.question} (Ends: ${deadline})`
    })
    .join('\n')

  const activeAttendance = feed
    .filter(item => item.type === 'attendance')
    .map(item => item as any)
    .filter(a => !a.closed_at && (!a.deadline || new Date(a.deadline) > now))
    .slice(0, 1)
    .map(a => {
      const started = new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      return `[Att] ${a.title || 'Attendance Session'} (Started: ${started})`
    })
    .join('\n')

  const liveData = [recentAssignments, recentAnnouncements, activePolls, activeAttendance]
    .filter(Boolean)
    .join('\n')

    // 2. Save user message (fire and forget)
    ; (adminClient as any)
      .from('chat_history')
      .insert({ user_id: user.id, class_id: classId, role: 'user', content: question })
      .then(({ error }: any) => { if (error) console.error('Failed to save user message:', error) })

  // 3. Build enriched search query for vector retrieval
  const recentUserContext = (history || [])
    .slice(-3)
    .filter((m: any) => m.role === 'user')
    .map((m: any) => m.content)
    .join('\n')

  const enrichInput = recentUserContext
    ? `Context:\n${recentUserContext}\n\nQuestion: ${question}`
    : question

  // Only enrich if the question is long enough to benefit from it
  const searchQuery = (await chatComplete(ENRICH_PROMPT(enrichInput))).content ?? question

  // 4. Retrieve vector chunks + materials list
  const { chunks, availableMaterials } = await retrieveContext(searchQuery, classId)

  // 5. Build prompt and get answer
  const prompt = buildPrompt(chunks, question, history || [], liveData, availableMaterials)
  const { content: answer, usage } = await chatComplete(prompt)

    // 6. Save assistant response (fire and forget)
    ; (adminClient as any)
      .from('chat_history')
      .insert({ user_id: user.id, class_id: classId, role: 'assistant', content: answer || 'No response' })
      .then(({ error }: any) => { if (error) console.error('Failed to save assistant message:', error) })

  // 7. Log token usage (fire and forget)
  if (usage) {
    adminClient.from('ai_usage_logs').insert({
      user_id: user.id,
      action_type: 'class_assistant',
      model: 'gpt-4o-mini',
      input_tokens: usage.prompt_tokens,
      output_tokens: usage.completion_tokens,
    }).then(({ error }) => { if (error) console.error('Failed to log AI usage:', error) })
  }

  return NextResponse.json({ answer })
}