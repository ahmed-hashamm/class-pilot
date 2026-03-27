'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'

/**
 * Fetches class detail data including membership status.
 * Redirects to login if not authenticated. Returns notFound if class doesn't exist.
 */
export async function getClassDetail(classId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: rawClass, error: classError } = await supabase
    .from('classes')
    .select('id, name, description, settings, code, created_by')
    .eq('id', classId)
    .maybeSingle()

  if (classError || !rawClass) notFound()

  const { data: rawMember } = await supabase
    .from('class_members')
    .select('role')
    .eq('class_id', classId)
    .eq('user_id', user.id)
    .maybeSingle()

  const isTeacher =
    (rawMember as { role: string } | null)?.role === 'teacher' ||
    (rawClass as { created_by: string }).created_by === user.id

  return {
    user,
    classData: rawClass as any,
    isTeacher,
  }
}
