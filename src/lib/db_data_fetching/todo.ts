'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isPast, isFuture } from 'date-fns'

/**
 * Fetches all assignments categorized into done/missing/assigned for student classes,
 * and active/ended for teacher-owned classes.
 */
interface TodoSubmission {
  status: string;
  final_grade: number | null;
  user_id: string;
  group_id: string | null;
}

export interface TodoAssignment {
  id: string;
  title: string;
  due_date: string;
  points: number;
  is_group_project: boolean;
  classes: { id: string; name: string } | null;
  submissions?: TodoSubmission[];
}

export async function getTodoPageData() {
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
          classes(id, name),
          submissions!left(status, final_grade, user_id, group_id)
        `)
        .in('class_id', studentClassIds)
        .order('due_date', { ascending: true })
    : { data: [] }

  // Fetch teacher assignments (with all submissions for counts)
  const { data: teacherAssignmentsData } = teacherClassIds.length > 0
    ? await supabase
        .from('assignments')
        .select(`
          id, title, due_date, points, is_group_project,
          classes(id, name),
          submissions!left(status, final_grade, user_id, group_id)
        `)
        .in('class_id', teacherClassIds)
        .order('due_date', { ascending: true })
    : { data: [] }

  const studentAssignments: TodoAssignment[] = (studentAssignmentsData || []).map((a: any) => ({
    ...a,
    classes: Array.isArray(a.classes) ? a.classes[0] : a.classes
  }))

  const teacherAssignments: TodoAssignment[] = (teacherAssignmentsData || []).map((a: any) => ({
    ...a,
    classes: Array.isArray(a.classes) ? a.classes[0] : a.classes
  }))

  const done = studentAssignments.filter((a) => {
    if (!a.submissions?.length) return false
    return a.submissions.some((sub) =>
      a.is_group_project ? myGroupIds.includes(sub.group_id as string) : sub.user_id === user.id
    )
  })

  const notDone  = studentAssignments.filter((a) => !done.find((d) => d.id === a.id))
  const missing  = notDone.filter((a) => isPast(new Date(a.due_date)))
  const assigned = notDone.filter((a) => isFuture(new Date(a.due_date)))

  // Teacher assignments: active vs ended
  const teacherActive = teacherAssignments.filter((a) => !a.due_date || isFuture(new Date(a.due_date)))
  const teacherEnded = teacherAssignments.filter((a) => a.due_date && isPast(new Date(a.due_date)))

  return { user, done, missing, assigned, myGroupIds, teacherActive, teacherEnded, hasTeacherClasses: teacherClassIds.length > 0 }
}
