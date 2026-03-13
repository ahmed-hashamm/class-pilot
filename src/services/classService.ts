import { createClient } from '@/lib/supabase/client'
import { ensureAuth } from '@/hooks/useRealtime'

export const classService = {
  /**
   * Fetches all group projects for a specific class
   */
  getProjects: async (classId: string) => {
    const supabase = createClient()
    const isAuthed = await ensureAuth(supabase)
    if (!isAuthed) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('group_projects')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  /**
   * Fetches all project members across group projects in a class
   * used in the GroupsTab to see who is assigned to what project
   */
  getProjectMembers: async (projectIds: string[]) => {
    if (!projectIds.length) return []

    const supabase = createClient()
    const isAuthed = await ensureAuth(supabase)
    if (!isAuthed) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('project_members')
      .select('*, users(full_name, email, avatar_url)')
      .in('project_id', projectIds)

    if (error) throw error
    return data
  },

  /**
   * Fetches all group projects for a specific class including members
   */
  getGroupsWithMembers: async (classId: string) => {
    const supabase = createClient()
    const isAuthed = await ensureAuth(supabase)
    if (!isAuthed) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('group_projects')
      .select('id, title, project_members(user_id, profiles:user_id(full_name))')
      .eq('class_id', classId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  /**
   * Fetches all members of a class
   */
  getAllClassMembers: async (classId: string) => {
    const supabase = createClient()
    const isAuthed = await ensureAuth(supabase)
    if (!isAuthed) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('class_members')
      .select('user_id, profiles:user_id(full_name)')
      .eq('class_id', classId)

    if (error) throw error
    return data
  }
}
