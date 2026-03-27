'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isPast, isFuture } from 'date-fns'

/**
 * Fetches all assignments categorized into done/missing/assigned for the current user.
 */
export async function getTodoPageData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: classMembersData } = await supabase
    .from('class_members').select('class_id').eq('user_id', user.id)

  const { data: groupMembersData } = await supabase
    .from('project_members').select('project_id').eq('user_id', user.id)

  const classIds = classMembersData?.map((cm: { class_id: string }) => cm.class_id) || []
  const myGroupIds = groupMembersData?.map((gm: { project_id: string }) => gm.project_id) || []

  const { data: assignmentsData } = classIds.length > 0
    ? await supabase
        .from('assignments')
        .select(`
          id, title, due_date, points, is_group_project,
          classes(name),
          submissions!left(status, final_grade, user_id, group_id)
        `)
        .in('class_id', classIds)
        .order('due_date', { ascending: true })
    : { data: [] }

  const allAssignments = assignmentsData || []

  const done = allAssignments.filter((a: any) => {
    if (!a.submissions?.length) return false
    return a.submissions.some((sub: any) =>
      a.is_group_project ? myGroupIds.includes(sub.group_id) : sub.user_id === user.id
    )
  })

  const notDone  = allAssignments.filter((a: any) => !done.find((d: any) => d.id === a.id))
  const missing  = notDone.filter((a: any) => isPast(new Date(a.due_date)))
  const assigned = notDone.filter((a: any) => isFuture(new Date(a.due_date)))

  return { user, done, missing, assigned, myGroupIds }
}
