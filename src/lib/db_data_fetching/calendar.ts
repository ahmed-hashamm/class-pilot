'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import { isPast, isFuture } from 'date-fns'

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

  const { data: classMembersData } = await supabase
    .from('class_members').select('class_id, role').eq('user_id', user.id)

  const { data: groupMembersData } = await supabase
    .from('project_members').select('project_id').eq('user_id', user.id)

  const allClassIds = classMembersData?.map((cm: { class_id: string }) => cm.class_id) || []
  const teacherClassIds = classMembersData
    ?.filter((cm: { role: string }) => cm.role === 'teacher')
    .map((cm: { class_id: string }) => cm.class_id) || []
  const studentClassIds = allClassIds.filter((id) => !teacherClassIds.includes(id))
  const myGroupIds = groupMembersData?.map((gm: { project_id: string }) => gm.project_id) || []

  // Fetch student assignments
  const { data: studentAssignmentsData } = studentClassIds.length > 0
    ? await supabase
        .from('assignments')
        .select(`
          id, title, due_date, points, is_group_project,
          classes(name, id),
          submissions!left(status, user_id, group_id)
        `)
        .in('class_id', studentClassIds)
        .not('due_date', 'is', null)
    : { data: [] }

  // Fetch teacher assignments
  const { data: teacherAssignmentsData } = teacherClassIds.length > 0
    ? await supabase
        .from('assignments')
        .select(`
          id, title, due_date, points, is_group_project,
          classes(name, id),
          submissions!left(status, user_id, group_id)
        `)
        .in('class_id', teacherClassIds)
        .not('due_date', 'is', null)
    : { data: [] }

  const processAssignments = (data: any[]) => (data || []).map((a) => {
    const hasSubmission = a.submissions?.some((s: any) =>
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

  const studentAssignments = processAssignments(studentAssignmentsData || [])
  const teacherAssignments = processAssignments(teacherAssignmentsData || [])

  const done = studentAssignments.filter((a) => a.isDone)
  const notDone = studentAssignments.filter((a) => !a.isDone)
  const missing = notDone.filter((a) => isPast(new Date(a.due_date)))
  const assigned = notDone.filter((a) => isFuture(new Date(a.due_date)))

  const teacherActive = teacherAssignments.filter((a) => isFuture(new Date(a.due_date)))
  const teacherEnded = teacherAssignments.filter((a) => isPast(new Date(a.due_date)))

  return {
    user,
    studentAssignments,
    teacherAssignments,
    done,
    missing,
    assigned,
    teacherActive,
    teacherEnded,
    hasTeacherClasses: teacherClassIds.length > 0
  }
}
