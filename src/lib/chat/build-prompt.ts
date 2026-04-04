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