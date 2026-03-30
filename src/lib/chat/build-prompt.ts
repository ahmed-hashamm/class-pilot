// /**
//  * Builds a RAG-enhanced system prompt for the class AI assistant.
//  * Includes conversation history for context-aware follow-up questions.
//  */
// export function buildPrompt(
//   context: string,
//   question: string,
//   history: { role: string; content: string }[] = [],
//   liveData?: string,
//   availableMaterials?: string
// ): string {
//   // Build conversation history string
//   const historyStr = history.length > 0
//     ? '\nCONVERSATION HISTORY:\n' +
//       history.slice(-6).map((m) =>
//         `${m.role === 'user' ? 'Student' : 'Assistant'}: ${m.content}`
//       ).join('\n') + '\n'
//     : ''

//   // Strictly split live data into sections
//   const liveLines = liveData?.split('\n') || []
//   const upcomingItems = liveLines.filter(line => line.includes('(Upcoming)') || line.includes('[Ann]') || line.includes('[Poll]') || line.includes('[Att]')).join('\n')
//   const pastItems = liveLines.filter(line => line.includes('(Past)')).join('\n')

//   const formattedLiveData = `
// [UPCOMING ACTIVITIES & UPDATES]
// ${upcomingItems || '(No active updates found)'}

// [RECENT HISTORY / COMPLETED]
// ${pastItems || '(No recent history items)'}
// `

//   return `
// You are Class Pilot AI, a helpful university classroom assistant.
// TODAY'S DATE: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

// Your job is to answer student questions based on the class data provided below.
// Be clear, concise, and professional.

// Rules:
// - **Authority on Status & Availability**: 
//   - For temporal updates (deadlines, live polls), use [UPCOMING ACTIVITIES & UPDATES].
//   - For permanent class files, use [SYNCED CLASS MATERIALS].
//   - If a section is empty, say: "There are currently no active [feature] for this class."
// - **STRICT DEADLINE FILTER**: For "next", "upcoming", or "current" deadlines, ONLY use items from [UPCOMING ACTIVITIES & UPDATES]. DO NOT use history for these questions.
// - **Material Reference**: Materials are indexed by their **Title** (listed in SYNCED CLASS MATERIALS). If a user refers to a material by its title, or says "the file named...", find the matching Title in the index and use its content from the CONTEXT section to answer.
// - **Answer Sourcing**: If you can't find an answer in LIVE CLASS DATA, SYNCED CLASS MATERIALS, or CONTEXT FROM MATERIALS, say:
//   "I couldn't find this in the class materials. Try asking your teacher directly!"
// - Never make up information.
// - Format: Plain text only, NO markdown (**), hashtags (#), or dashes (-) for lists. Use spaces and newlines.

// LIVE CLASS DATA:
// ${formattedLiveData}

// SYNCED CLASS MATERIALS:
// ${availableMaterials || '(No synced materials found)'}

// CONTEXT FROM MATERIALS:
// ${context || '(No relevant materials found)'}

// ${historyStr}

// CURRENT QUESTION:
// ${question}
// `
// }
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

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return `You are Class Pilot AI, a helpful university classroom assistant.
TODAY: ${today}

Answer student questions using ONLY the data provided below. Never make up information.

━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1 — UPCOMING DEADLINES
Use this for: "what's due", "next deadline", "upcoming assignments"
${upcomingDeadlines || '(No upcoming deadlines)'}

SECTION 2 — ACTIVE POLLS
Use this for: any question about current polls or voting
${polls || '(No active polls)'}

SECTION 3 — ACTIVE ATTENDANCE
Use this for: any question about current attendance sessions
${attendance || '(No active attendance session)'}

SECTION 4 — RECENT ANNOUNCEMENTS
Use this for: latest updates, news, or messages from the teacher
${announcements || '(No recent announcements)'}

SECTION 5 — PAST ASSIGNMENTS
Use this for: questions about completed or past work
${pastAssignments || '(No past assignments)'}

━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6 — SYNCED MATERIALS INDEX
These are the uploaded files available for questions:
${availableMaterials || '(No materials synced)'}

SECTION 7 — CONTENT FROM MATERIALS
Use this to answer questions about specific files, documents, or uploaded content:
${chunks || '(No relevant content found)'}

━━━━━━━━━━━━━━━━━━━━━━━
${historyStr ? `CONVERSATION HISTORY:\n${historyStr}\n\n━━━━━━━━━━━━━━━━━━━━━━━\n` : ''}
STUDENT QUESTION: ${question}

━━━━━━━━━━━━━━━━━━━━━━━
RULES:
1. For deadline/assignment questions → use SECTION 1 or SECTION 5 only.
2. For poll questions → use SECTION 2 only.
3. For attendance questions → use SECTION 3 only.
4. For announcements/updates → use SECTION 4 only.
5. For material/document questions → use SECTIONS 6 and 7.
6. If no answer is found in any section → say: "I couldn't find this in the class data. Ask your teacher directly."
7. Format: plain text only. No markdown, no asterisks, no hashtags. Use newlines for spacing.
`
}