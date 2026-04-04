// // {working }//
// interface Message {
//   role: string
//   content: string
// }

// /**
//  * Builds a RAG-enhanced system prompt for the class AI assistant.
//  */
// export function buildPrompt(
//   chunks: string,
//   question: string,
//   history: Message[] = [],
//   liveData?: string,
//   availableMaterials?: string
// ): string {
//   const lines = liveData?.split('\n').filter(Boolean) || []

//   const upcomingDeadlines = lines.filter(l => l.includes('[Asgn]') && l.includes('(Upcoming)')).join('\n')
//   const pastAssignments = lines.filter(l => l.includes('[Asgn]') && l.includes('(Past)')).join('\n')
//   const announcements = lines.filter(l => l.includes('[Ann]')).join('\n')
//   const polls = lines.filter(l => l.includes('[Poll]')).join('\n')
//   const attendance = lines.filter(l => l.includes('[Att]')).join('\n')

//   const historyStr = history.length > 0
//     ? history
//       .slice(-6)
//       .map(m => `${m.role === 'user' ? 'Student' : 'Assistant'}: ${m.content}`)
//       .join('\n')
//     : ''

//   const currentDateTime = new Date().toLocaleDateString('en-US', {
//     weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
//   })

//   return `Class Pilot AI Assistant. Date: ${currentDateTime}
// Use ONLY these sections. Never hallucinate.

// [DEADLINES]
// ${upcomingDeadlines || 'None'}

// [POLLS]
// ${polls || 'None'}

// [ATTENDANCE]
// ${attendance || 'None'}

// [ANNOUNCEMENTS]
// ${announcements || 'None'}

// [PAST ASSIGNMENTS]
// ${pastAssignments || 'None'}

// [SYNCED MATERIALS]
// ${availableMaterials || 'None'}

// [MATERIAL CONTENT]
// ${chunks || 'None'}

// ${historyStr ? `[HISTORY]\n${historyStr}\n` : ''}

// RULES:
// 1. No [Ann], [Asgn], [Poll], or [Att] tags in output.
// 2. Use **bold** for dates/titles/announcement titles and bullets for lists.
// 3. Concise answers only. End with: "Any other questions?" or "How else can I help?".
// 4. If missing/unknown -> "Information not found. Ask your teacher."
// 5. Refer to files by exact name from [SYNCED MATERIALS].
// 6. Empty categories: respond conversationally — "No active polls right now!" not "No data found."
// 7. Casual or indirect questions ("Am I following along?", "Any pending work?") → answer in matching tone using the same data — "You're all caught up!" or "You have 2 upcoming assignments due soon."

// [STUDENT QUESTION]: ${question}
// `
// }

interface Message {
  role: string
  content: string
}

export function buildPrompt(
  chunks: string,
  question: string,
  history: Message[] = [],
  liveData?: string,
  availableMaterials?: string
): string {
  const lines = liveData?.split('\n').filter(Boolean) || []

  const upcoming = lines.filter(l => l.includes('[Asgn]') && l.includes('(Upcoming - Not Submitted)')).join('\n')
  const pastNotSubmitted = lines.filter(l => l.includes('[Asgn]') && l.includes('(Past Due - Not Submitted)')).join('\n')
  const submitted = lines.filter(l => l.includes('[Asgn]') && l.includes('(Submitted)')).join('\n')
  const announcements = lines.filter(l => l.includes('[Ann]')).join('\n')
  const polls = lines.filter(l => l.includes('[Poll]')).join('\n')
  const attendance = lines.filter(l => l.includes('[Att]')).join('\n')

  // Live data sections always included so model can answer conversationally when empty
  // Material sections only included when there's actual data (saves tokens)
  const sections: string[] = [
    `[UPCOMING ASSIGNMENTS (Not Yet Submitted)]\n${upcoming || 'none'}`,
    `[OVERDUE ASSIGNMENTS (Not Submitted)]\n${pastNotSubmitted || 'none'}`,
    `[SUBMITTED ASSIGNMENTS]\n${submitted || 'none'}`,
    `[ACTIVE POLLS]\n${polls || 'none'}`,
    `[ACTIVE ATTENDANCE]\n${attendance || 'none'}`,
    `[ANNOUNCEMENTS]\n${announcements || 'none'}`,
  ]

  if (availableMaterials) sections.push(`[SYNCED MATERIALS]\n${availableMaterials}`)
  if (chunks) sections.push(`[MATERIAL CONTENT]\n${chunks}`)

  const historyStr = history.length > 0
    ? '[CONVERSATION HISTORY]\n' +
    history.slice(-4).map(m =>
      `${m.role === 'user' ? 'Student' : 'AI'}: ${m.content}`
    ).join('\n')
    : ''

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return `You are Class Pilot AI, a university classroom assistant. TODAY: ${today}
Answer using ONLY the data below. Never make up information.

Rules:
- No [Ann], [Asgn], [Poll], or [Att] tags in output.
- Use **bold** for dates/titles/announcement and material titles/important info and bullets for lists.
- Deadlines/upcoming → use UPCOMING ASSIGNMENTS (Not Yet Submitted). Do NOT include submitted assignments.
- Overdue → use OVERDUE ASSIGNMENTS (Not Submitted)
- Submitted work → use SUBMITTED ASSIGNMENTS
- Polls → use ACTIVE POLLS
- Attendance → use ACTIVE ATTENDANCE
- Announcements/updates → use ANNOUNCEMENTS
- Document/file questions → use SYNCED MATERIALS + MATERIAL CONTENT
- If a live data section shows "none", respond conversationally: "No active polls right now!" not "Information not found."
- "Information not found. Ask your teacher." is ONLY for document/material questions with no relevant content.
- Casual questions ("Am I following along?", "Any pending work?") → check UPCOMING and OVERDUE sections first. Only say "You're all caught up!" if BOTH show "none". If there ARE pending assignments, list them — never say "all caught up" while also listing work.

${sections.join('\n\n')}

${historyStr ? historyStr + '\n\n' : ''}[QUESTION] ${question}`
}