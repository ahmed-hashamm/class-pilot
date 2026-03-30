// import { NextResponse } from 'next/server'
// import { retrieveContext } from '@/lib/chat/retrieve-context'
// import { buildPrompt } from '@/lib/chat/build-prompt'
// import { chatComplete } from '@/lib/chat/chat-complete'
// import { createClient } from '@/lib/supabase/server'
// import { createAdminClient } from '@/lib/supabase/admin'
// import { getStreamFeed } from '@/lib/db_data_fetching/stream'

// export const dynamic = 'force-dynamic'

// const ENRICH_PROMPT = (q: string) => `
// You are a context-enriching expert for a classroom AI.
// Your goal is to transform the user's question into a highly effective search query for a vector database.

// Rules:
// 1. Preserve Document Names: If the user mentions a specific material, file, or report (e.g., "Internship Report", "testing auto sync"), YOU MUST keep those exact names in the query.
// 2. Focus on Content: Identify the core information requested (e.g., "project title", "summary", "main points").
// 3. Format: Return ONLY the enriched search query. No preamble.

// Example Input: "can u tell me the title of the project in the Internship Report"
// Example Output: "Internship Report project title"

// User Question: "${q}"
// `

// export async function POST(req: Request) {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()

//   if (!user) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   const { question, classId, history } = await req.json()

//   if (!question || !classId) {
//     return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
//   }

//   // 1️⃣ Fetch live class data for context
//   const feed = await getStreamFeed(classId)
//   const now = new Date()

//   const recentAssignments = feed
//     .filter(item => item.type === 'assignment')
//     .map(a => a as any)
//     .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
//     .slice(0, 8)
//     .map(a => {
//       const isPast = a.due_date && new Date(a.due_date) < now
//       const status = isPast ? '(Past)' : '(Upcoming)'
//       const dateStr = a.due_date ? new Date(a.due_date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }) : 'No date'
//       return `[Asgn] ${status} ${a.title} (Due: ${dateStr})`
//     })
//     .join('\n')

//   const recentAnnouncements = feed
//     .filter(item => item.type === 'announcement')
//     .slice(0, 2)
//     .map(a => {
//       const ann = a as any
//       return `[Ann] ${ann.title}: ${ann.content?.slice(0, 60)}...`
//     })
//     .join('\n')

//   const activePolls = feed
//     .filter(item => item.type === 'poll')
//     .map(p => p as any)
//     .filter(p => !p.closed_at)
//     .slice(0, 2)
//     .map(p => `[Poll] ${p.question} (Ends: ${p.deadline ? new Date(p.deadline).toLocaleDateString() : 'No deadline'})`)
//     .join('\n')

//   const activeAttendance = feed
//     .filter(item => item.type === 'attendance')
//     .map(a => a as any)
//     .filter(a => !a.closed_at)
//     .slice(0, 1)
//     .map(a => `[Att] ${a.title || 'Attendance Session'} (Started: ${new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`)
//     .join('\n')

//   const liveData = [
//     recentAssignments,
//     recentAnnouncements,
//     activePolls,
//     activeAttendance
//   ].filter(Boolean).join('\n')

//   // Save student message to persistence (Background)
//   const adminClient = createAdminClient() as any
//   adminClient.from('chat_history').insert({
//     user_id: user.id,
//     class_id: classId,
//     role: 'user',
//     content: question
//   }).then(({ error }: any) => { if (error) console.error('Failed to save user message:', error) })

//   // 2️⃣ Refined search query construction
//   const recentUserMessages = (history || [])
//     .slice(-3)
//     .filter((m: any) => m.role === 'user')
//     .map((m: any) => m.content)
//     .join('\n')

//   const enrichmentInput = recentUserMessages 
//     ? `Context:\n${recentUserMessages}\n\nQuestion: ${question}`
//     : question

//   const searchQuery = question.length > 20
//     ? (await chatComplete(ENRICH_PROMPT(enrichmentInput))).content
//     : question

//   // 3️⃣ Retrieve relevant chunks using enriched query
//   const { chunks, availableMaterials } = await retrieveContext(searchQuery || question, classId)

//   // 4️⃣ Build the final system prompt with RAG context
//   const prompt = buildPrompt(chunks, question, history || [], liveData, availableMaterials)

//   // 5️⃣ Get AI answer
//   const { content: answer, usage } = await chatComplete(prompt)

//   // Save assistant response to persistence (Background)
//   adminClient.from('chat_history').insert({
//     user_id: user.id,
//     class_id: classId,
//     role: 'assistant',
//     content: answer || 'No response'
//   }).then(({ error }: any) => { if (error) console.error('Failed to save assistant message:', error) })

//   // 4️⃣ Log usage (Background)
//   if (usage) {
//     const adminClient = createAdminClient()
//     adminClient.from('ai_usage_logs').insert({
//       user_id: user.id,
//       action_type: 'class_assistant',
//       model: 'gpt-4o-mini',
//       input_tokens: usage.prompt_tokens,
//       output_tokens: usage.completion_tokens,
//     }).then(({ error }) => {
//       if (error) console.error('Failed to log AI usage:', error)
//     })
//   }

//   return NextResponse.json({ answer })
// }
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

Context: tell me about SQA Assignment 4
Question: what is the cyclomatic complexity?
Output: SQA Assignment 4 cyclomatic complexity calculation

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
    .slice(0, 3)
    .map(item => {
      const a = item as any
      return `[Ann] ${a.title}: ${a.content?.slice(0, 100) ?? ''}...`
    })
    .join('\n')

  const activePolls = feed
    .filter(item => item.type === 'poll')
    .map(item => item as any)
    .filter(p => !p.closed_at)
    .slice(0, 3)
    .map(p => {
      const deadline = p.deadline
        ? new Date(p.deadline).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
        : 'No deadline'
      return `[Poll] ${p.question} (Ends: ${deadline})`
    })
    .join('\n')

  const activeAttendance = feed
    .filter(item => item.type === 'attendance')
    .map(item => item as any)
    .filter(a => !a.closed_at)
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
  console.log('=== RAG DEBUG ===')
  console.log('Search query:', searchQuery)
  console.log('Chunks found:', chunks?.length > 0 ? chunks.slice(0, 200) : 'EMPTY')
  console.log('Materials:', availableMaterials)
  console.log('=================')
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