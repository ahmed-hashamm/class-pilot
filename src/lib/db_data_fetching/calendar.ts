'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Fetches calendar page data — all assignments with submission status.
 */
interface CalendarSubmission {
  status: string;
  user_id: string;
  group_id: string | null;
}

export interface CalendarAssignment {
  id: string;
  title: string;
  due_date: string;
  points: number;
  is_group_project: boolean;
  classes: { name: string; id: string } | null;
  submissions?: CalendarSubmission[];
}

export async function getCalendarPageData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: classMembers } = await supabase
    .from('class_members').select('class_id').eq('user_id', user.id)

  const { data: groupMembers } = await supabase
    .from('project_members').select('project_id').eq('user_id', user.id)

  const classIds = classMembers?.map((cm: { class_id: string }) => cm.class_id) || []
  const myGroupIds = groupMembers?.map((gm: { project_id: string }) => gm.project_id) || []

  const { data: assignments } = classIds.length > 0
    ? await supabase
        .from('assignments')
        .select(`
          id, title, due_date, points, is_group_project,
          classes(name, id),
          submissions!left(status, user_id, group_id)
        `)
        .in('class_id', classIds)
        .not('due_date', 'is', null)
    : { data: [] }

  const assignmentList = (assignments as CalendarAssignment[] || []).map((a) => {
    const hasSubmission = a.submissions?.some((s) =>
      s.user_id === user.id || (a.is_group_project && myGroupIds.includes(s.group_id as string))
    )
    return {
      id:       a.id,
      title:    a.title,
      due_date: a.due_date,
      points:   a.points,
      classes:  a.classes,
      isDone:   !!hasSubmission,
    }
  })

  return { user, assignmentList }
}
