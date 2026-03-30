// {working }//
interface Message {
  role: string
  content: string
}

interface LiveData {
  upcomingDeadlines: string
  activePolls: string
  activeAttendance: string
  recentAnnouncements: string
}

/**
 * Builds a RAG-enhanced system prompt for the class AI assistant.
 */
export function buildPrompt(
  chunks: string,
  question: string,
  history: Message[] = [],
  liveData?: string,
  availableMaterials?: string
): string {
  // Parse live data into labelled sections
  const lines = liveData?.split('\n').filter(Boolean) || []

  const upcomingDeadlines = lines.filter(l => l.includes('[Asgn]') && l.includes('(Upcoming)')).join('\n')
  const pastAssignments = lines.filter(l => l.includes('[Asgn]') && l.includes('(Past)')).join('\n')
  const announcements = lines.filter(l => l.includes('[Ann]')).join('\n')
  const polls = lines.filter(l => l.includes('[Poll]')).join('\n')
  const attendance = lines.filter(l => l.includes('[Att]')).join('\n')

  const historyStr = history.length > 0
    ? history
      .slice(-6)
      .map(m => `${m.role === 'user' ? 'Student' : 'Assistant'}: ${m.content}`)
      .join('\n')
    : ''

  const currentDateTime = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return `You are Class Pilot AI, a helpful, professional university classroom assistant.
CURRENT DATE & TIME: ${currentDateTime}

Your goal is to provide clear, well-formatted, and helpful answers using ONLY the data sections below.

━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1 — UPCOMING DEADLINES
${upcomingDeadlines || '(No upcoming deadlines)'}

SECTION 2 — ACTIVE POLLS
${polls || '(No active polls)'}

SECTION 3 — ACTIVE ATTENDANCE
${attendance || '(No active attendance session)'}

SECTION 4 — RECENT ANNOUNCEMENTS
${announcements || '(No recent announcements)'}

SECTION 5 — PAST ASSIGNMENTS
${pastAssignments || '(No past assignments)'}

SECTION 6 — SYNCED MATERIALS INDEX
${availableMaterials || '(No materials synced)'}

SECTION 7 — CONTENT FROM MATERIALS
${chunks || '(No relevant content found)'}

━━━━━━━━━━━━━━━━━━━━━━━
${historyStr ? `CONVERSATION HISTORY:\n${historyStr}\n\n━━━━━━━━━━━━━━━━━━━━━━━\n` : ''}

RULES FOR YOUR RESPONSE:
1. NEVER include internal tags like [Ann], [Asgn], [Poll], or [Att] in your response. These are for your reference only.
2. Use Markdown for clarity: 
   - Use **bold** for deadlines, dates, titles, and important terms.
   - Use bulleted lists for multiple items (e.g., announcements or assignments).
   - Use ### headers if you need to separate different topics.
3. Be helpful and professional. If a deadline is missing, say "No upcoming deadlines found."
4. If you don't know the answer from the data provided, say: "I couldn't find this in the class data. Ask your teacher directly."
6. Keep your responses concise and direct. Use the minimum amount of tokens necessary while still being helpful.
7. Avoid wordy conclusions. End with a very short follow-up like "Any other questions?" or "How else can I help?".



STUDENT QUESTION: ${question}
`
}

// interface Message {
//   role: string
//   content: string
// }

// export function buildPrompt(
//   chunks: string,
//   question: string,
//   history: Message[] = [],
//   liveData?: string,
//   availableMaterials?: string
// ): string {
//   const lines = liveData?.split('\n').filter(Boolean) || []

//   const upcoming    = lines.filter(l => l.includes('[Asgn]') && l.includes('(Upcoming)')).join('\n')
//   const past        = lines.filter(l => l.includes('[Asgn]') && l.includes('(Past)')).join('\n')
//   const announcements = lines.filter(l => l.includes('[Ann]')).join('\n')
//   const polls       = lines.filter(l => l.includes('[Poll]')).join('\n')
//   const attendance  = lines.filter(l => l.includes('[Att]')).join('\n')

//   // Only render sections that have actual data — skip empty ones entirely
//   const sections: string[] = []

//   if (upcoming)       sections.push(`[UPCOMING ASSIGNMENTS]\n${upcoming}`)
//   if (polls)          sections.push(`[ACTIVE POLLS]\n${polls}`)
//   if (attendance)     sections.push(`[ACTIVE ATTENDANCE]\n${attendance}`)
//   if (announcements)  sections.push(`[ANNOUNCEMENTS]\n${announcements}`)
//   if (past)           sections.push(`[PAST ASSIGNMENTS]\n${past}`)
//   if (availableMaterials) sections.push(`[SYNCED MATERIALS]\n${availableMaterials}`)
//   if (chunks)         sections.push(`[MATERIAL CONTENT]\n${chunks}`)

//   const historyStr = history.length > 0
//     ? '[CONVERSATION HISTORY]\n' +
//       history.slice(-4).map(m =>
//         `${m.role === 'user' ? 'Student' : 'AI'}: ${m.content}`
//       ).join('\n')
//     : ''

//   const today = new Date().toLocaleDateString('en-US', {
//     weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
//   })

//   return `You are Class Pilot AI, a university classroom assistant. TODAY: ${today}
// Answer using ONLY the data below. Never make up information.

// Rules:
// - Deadlines/assignments → use UPCOMING or PAST ASSIGNMENTS
// - Polls → use ACTIVE POLLS
// - Attendance → use ACTIVE ATTENDANCE
// - Announcements/updates → use ANNOUNCEMENTS
// - Document/file questions → use SYNCED MATERIALS + MATERIAL CONTENT
// - If not found → say: "I couldn't find this in the class data. Ask your teacher directly."
// - Plain text only. No markdown, asterisks, or hashtags.

// ${sections.join('\n\n')}

// ${historyStr ? historyStr + '\n\n' : ''}[QUESTION] ${question}`
// }