import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { Database } from "@/types/database"
import { SupabaseClient } from "@supabase/supabase-js"

type Announcement = Database['public']['Tables']['announcements']['Row']
type Material = Database['public']['Tables']['materials']['Row']
type Assignment = Database['public']['Tables']['assignments']['Row']
type Submission = Database['public']['Tables']['submissions']['Row']

export interface Note {
  id: string
  content: string
  created_at: string
}

export const ClassService = {
  async getStickyNotes(classId: string, userId: string): Promise<Note[]> {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data } = await supabase
      .from("class_notes")
      .select("id, content, created_at")
      .eq("class_id", classId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    
    return (data as any) ?? []
  },

  async addStickyNote(classId: string, userId: string, content: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { error } = await supabase.from("class_notes").insert({
      class_id: classId,
      user_id: userId,
      content,
    } as any)
    if (error) throw error
  },

  async clearStickyNotes(classId: string, userId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { error } = await supabase
      .from("class_notes")
      .delete()
      .eq("class_id", classId)
      .eq("user_id", userId)
    if (error) throw error
  },

  async uploadFiles(files: File[], classId: string, bucket: string): Promise<string[]> {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const paths: string[] = []

    for (const file of files) {
      if (file.size > 0) {
        const safeName = file.name.replace(/[^a-z0-9.]/gi, '_')
        const fileName = `${Date.now()}-${safeName}`

        const { data, error: uploadError } = await (supabase.storage
          .from(bucket) as any)
          .upload(`${classId}/${fileName}`, file)

        if (uploadError) throw new Error(`Upload to ${bucket} failed: ${uploadError.message}`)
        paths.push(data.path)
      }
    }
    return paths
  },

  async createAnnouncement(data: {
    title: string
    content: string
    classId: string
    userId: string
    attachmentPaths: string[]
    pinned: boolean
    deadline: string | null
  }) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { error: dbError } = await supabase
      .from('announcements')
      .insert({
        title: data.title,
        content: data.content,
        class_id: data.classId,
        created_by: data.userId,
        attachment_paths: data.attachmentPaths as any,
        pinned: data.pinned,
        deadline: data.deadline,
      } as any)

    if (dbError) throw new Error(`Announcement failed: ${dbError.message}`)
  },

  async updateAnnouncement(data: {
    id: string
    classId: string
    title: string
    content: string
    userId: string
    allPaths: string[]
    pinned: boolean
  }) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>

    const role = await this.getUserRole(data.classId, data.userId)
    const isAuthorized = role === 'teacher'

    let query = supabase.from('announcements')
      .update({ 
        title: data.title, 
        content: data.content, 
        pinned: data.pinned, 
        attachment_paths: data.allPaths as any,
        updated_at: new Date().toISOString() 
      } as any)
      .eq('id', data.id)
      .eq('class_id', data.classId) 

    if (!isAuthorized) {
      query = query.eq('created_by', data.userId)
    }

    const { error } = await query
    if (error) throw new Error(error.message)
  },

  async deleteAnnouncement(id: string, userId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data: announcement } = await supabase
      .from('announcements')
      .select('class_id, created_by')
      .eq('id', id)
      .maybeSingle()

    if (!announcement) throw new Error("Announcement not found")

    const role = await this.getUserRole((announcement as any).class_id, userId)
    const isAuthorized = ((announcement as any).created_by === userId) || (role === 'teacher')

    if (!isAuthorized) throw new Error("Unauthorized")

    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (error) throw error
    return (announcement as any).class_id
  },

  async createMaterial(data: { title: string; description: string | null; classId: string; userId: string; attachmentPaths: string[]; fileTypes: string[]; pinned: boolean }) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data: inserted, error } = await supabase.from('materials').insert({
      title: data.title,
      description: data.description,
      class_id: data.classId,
      created_by: data.userId,
      attachment_paths: data.attachmentPaths as any,
      file_types: data.fileTypes as any,
      pinned: data.pinned
    } as any).select().maybeSingle()
    if (error) throw error
    return inserted
  },

  async updateMaterial(data: { id: string; classId: string; title: string; description: string | null; attachmentPaths: string[]; fileTypes: string[]; pinned: boolean; userId: string }) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data: inserted, error } = await supabase.from('materials').update({
      title: data.title,
      description: data.description,
      attachment_paths: data.attachmentPaths as any,
      file_types: data.fileTypes as any,
      pinned: data.pinned
    } as any).eq('id', data.id).eq('class_id', data.classId).select().maybeSingle()
    if (error) throw error
    return inserted
  },

  async deleteMaterial(id: string, userId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data: material } = await supabase.from('materials').select('class_id, created_by').eq('id', id).maybeSingle()
    if (!material) throw new Error("Material not found")
    const { error } = await supabase.from('materials').delete().eq('id', id)
    if (error) throw error
    return (material as any).class_id
  },

  async createAssignment(data: { title: string; description: string | null; dueDate: string | null; points: number; classId: string; userId: string; submissionType: string; rubricId: string | null; attachmentPaths: string[]; isGroupProject: boolean; pinned: boolean }) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data: inserted, error } = await supabase.from('assignments').insert({
      title: data.title,
      description: data.description,
      due_date: data.dueDate,
      points: data.points,
      class_id: data.classId,
      created_by: data.userId,
      submission_type: data.submissionType,
      rubric_id: data.rubricId,
      attachment_paths: data.attachmentPaths as any,
      is_group_project: data.isGroupProject,
      pinned: data.pinned
    } as any).select().maybeSingle()
    if (error) throw error
    return inserted
  },

  async updateAssignment(data: { assignmentId: string; classId: string; title: string; description: string | null; dueDate: string | null; points: number; submissionType: string; rubricId: string | null; isGroupProject: boolean; allPaths: string[]; pinned: boolean }) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data: inserted, error } = await supabase.from('assignments').update({
      title: data.title,
      description: data.description,
      due_date: data.dueDate,
      points: data.points,
      submission_type: data.submissionType,
      rubric_id: data.rubricId,
      is_group_project: data.isGroupProject,
      attachment_paths: data.allPaths as any,
      pinned: data.pinned
    } as any).eq('id', data.assignmentId).eq('class_id', data.classId).select().maybeSingle()
    if (error) throw error
    return inserted
  },

  async deleteAssignment(id: string, userId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data: assignment } = await supabase.from('assignments').select('class_id').eq('id', id).maybeSingle()
    if (!assignment) throw new Error("Not found")
    const { error } = await supabase.from('assignments').delete().eq('id', id)
    if (error) throw error
    return (assignment as any).class_id
  },

  async submitAssignment(data: { assignmentId: string; userId: string; groupId?: string | null; content?: string; files?: any; isGroupProject: boolean }) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data: inserted, error } = await supabase.from('submissions').insert({
      assignment_id: data.assignmentId,
      user_id: data.userId,
      group_id: data.groupId,
      content: data.content,
      files: data.files,
      status: 'submitted',
      submitted_at: new Date().toISOString()
    } as any).select().maybeSingle()
    if (error) throw error
    return inserted
  },

  async saveGroup(classId: string, title: string, groupId: string | null | undefined, studentIds: string[], userId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    if (groupId) {
      const { error } = await supabase.from('group_projects').update({ title }).eq('id', groupId)
      if (error) throw error
      await supabase.from('project_members').delete().eq('project_id', groupId)
      const members = studentIds.map(sid => ({ project_id: groupId, user_id: sid, role: 'member' }))
      await supabase.from('project_members').insert(members as any)
    } else {
      const { data: project, error } = await supabase.from('group_projects').insert({ class_id: classId, title, created_by: userId } as any).select().maybeSingle()
      if (error) throw error
      if (!project) throw new Error("Failed to create group project")
      const members = studentIds.map(sid => ({ project_id: project.id, user_id: sid, role: 'member' }))
      await supabase.from('project_members').insert(members as any)
    }
  },

  async removeGroupMember(projectId: string, studentId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    await supabase.from('project_members').delete().eq('project_id', projectId).eq('user_id', studentId)
  },

  async deleteGroup(groupId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    await supabase.from('group_projects').delete().eq('id', groupId)
  },

  async deleteClass(classId: string, userId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    
    // 1. Perform deletion with exact count check
    const { error, count } = await supabase
      .from('classes')
      .delete({ count: 'exact' })
      .eq('id', classId)
      .eq('created_by', userId)
    
    if (error) throw error
    
    // 2. If 0 rows were affected, it means the class doesn't exist OR the user is not the creator
    if (count === 0) {
      throw new Error("Class not found or you don't have permission to delete it.")
    }

    // 3. Invalidate Redis cache so the dashboard updates immediately
    const { redisSafe } = await import('@/lib/redis')
    await redisSafe.invalidateClassCache(classId)
    // Also invalidate the class name cache if it exists
    await redisSafe.del(`class:name:${classId}`)
  },

  async updateClassSettings(data: { classId: string; name: string; description: string; settings: any; userId: string }) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { error } = await supabase.from('classes').update({
      name: data.name,
      description: data.description,
      settings: data.settings
    } as any).eq('id', data.classId).eq('created_by', data.userId)
    
    if (error) throw error

    // Invalidate cache
    const { redisSafe } = await import('@/lib/redis')
    await redisSafe.invalidateClassCache(data.classId)
  },

  async getClassName(classId: string) {
    const { redisSafe } = await import('@/lib/redis')
    const cacheKey = `class:name:${classId}`
    
    const cached = await redisSafe.get<string>(cacheKey)
    if (cached) return cached

    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data } = await supabase.from('classes').select('name').eq('id', classId).maybeSingle()
    const name = (data as any)?.name || 'Class'
    
    if (data) {
      await redisSafe.set(cacheKey, name, { ex: 1800 }) // 30 mins
    }
    
    return name
  },

  async getUserRole(classId: string, userId: string): Promise<'teacher' | 'student' | null> {
    const { redisSafe } = await import('@/lib/redis')
    const cacheKey = `role:class:${classId}:user:${userId}`

    const cached = await redisSafe.get<'teacher' | 'student'>(cacheKey)
    if (cached) return cached

    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    
    // 1. Check if owner (teacher by default)
    const { data: classData } = await supabase
      .from('classes')
      .select('created_by')
      .eq('id', classId)
      .maybeSingle()
    
    if (classData?.created_by === userId) {
      await redisSafe.set(cacheKey, 'teacher', { ex: 600 }) // 10 mins
      return 'teacher'
    }

    // 2. Check class_members table
    const { data: member } = await supabase
      .from('class_members')
      .select('role')
      .eq('class_id', classId)
      .eq('user_id', userId)
      .maybeSingle()

    const role = (member as any)?.role || null
    
    if (role) {
      await redisSafe.set(cacheKey, role, { ex: 600 }) // 10 mins
    }

    return role
  },

  async togglePin(data: { type: string; id: string; pinned: boolean; userId: string }) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { error } = await supabase.from(data.type as any).update({ pinned: data.pinned } as any).eq('id', data.id)
    if (error) throw error
  }
}
