'use server'

import { createClient } from '@/lib/supabase/server'

export async function getGroupsWithMembers(classId: string) {
  const supabase = await createClient()

  // First verify user is authenticated and part of this class
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { groups: null, error: 'Unauthorized' }

  // Check enrollment
  const { data: enrollment } = await supabase
    .from('class_members')
    .select('role')
    .eq('class_id', classId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!enrollment) return { groups: null, error: 'Not enrolled in this class' }

  const { data, error } = await supabase
    .from('group_projects')
    .select('id, title, project_members(user_id, profiles:user_id(full_name))')
    .eq('class_id', classId)
    .order('created_at', { ascending: false })

  if (error) return { groups: null, error: error.message }
  return { groups: data, error: null }
}

export async function getAllClassMembers(classId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { members: null, error: 'Unauthorized' }

  const { data: enrollment } = await supabase
    .from('class_members')
    .select('role')
    .eq('class_id', classId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!enrollment) return { members: null, error: 'Not enrolled in this class' }

  const { data, error } = await supabase
    .from('class_members')
    .select('user_id, profiles:user_id(full_name)')
    .eq('class_id', classId)

  if (error) return { members: null, error: error.message }
  return { members: data, error: null }
}

export async function getProjects(classId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { projects: null, error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('group_projects')
    .select('id, title, class_id, created_at, created_by')
    .eq('class_id', classId)
    .order('created_at', { ascending: false })

  if (error) return { projects: null, error: error.message }
  return { projects: data, error: null }
}

export async function getProjectMembers(projectIds: string[]) {
  if (!projectIds || !projectIds.length) return { projectMembers: [], error: null }

  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('project_members')
    .select('project_id, user_id, role, users(full_name, email, avatar_url)')
    .in('project_id', projectIds)

  if (error) return { projectMembers: null, error: error.message }
  return { projectMembers: data, error: null }
}
