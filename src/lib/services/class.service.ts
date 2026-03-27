import { createClient } from "@/lib/supabase/server"
import { Database } from "@/types/database.utf8"

type Announcement = Database['public']['Tables']['announcements']['Row']
type Material = Database['public']['Tables']['materials']['Row']
type Assignment = Database['public']['Tables']['assignments']['Row']
type Submission = Database['public']['Tables']['submissions']['Row']
type GroupProject = Database['public']['Tables']['group_projects']['Row']
type ProjectMember = Database['public']['Tables']['project_members']['Row']

export interface Note {
  id: string
  content: string
  created_at: string
}

export const ClassService = {
  async getStickyNotes(classId: string, userId: string): Promise<Note[]> {
    const supabase = await createClient()
    const { data } = await supabase
      .from("class_notes")
      .select("id, content, created_at")
      .eq("class_id", classId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    
    return data ?? []
  },

  async addStickyNote(classId: string, userId: string, content: string) {
    const supabase = await createClient()
    const { error } = await (supabase.from("class_notes") as any).insert({
      class_id: classId,
      user_id: userId,
      content,
    } as Database['public']['Tables']['class_notes']['Insert'])
    if (error) throw error
  },

  async clearStickyNotes(classId: string, userId: string) {
    const supabase = await createClient()
    const { error } = await supabase
      .from("class_notes")
      .delete()
      .eq("class_id", classId)
      .eq("user_id", userId)
    if (error) throw error
  },

  async uploadFiles(files: File[], classId: string, bucket: string): Promise<string[]> {
    const supabase = await createClient()
    const paths: string[] = []

    for (const file of files) {
      if (file.size > 0) {
        const safeName = file.name.replace(/[^a-z0-9.]/gi, '_')
        const fileName = `${Date.now()}-${safeName}`

        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
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
    const supabase = await createClient()
    const { error: dbError } = await (supabase
      .from('announcements') as any)
      .insert({
        title: data.title,
        content: data.content,
        class_id: data.classId,
        created_by: data.userId,
        attachment_paths: data.attachmentPaths,
        pinned: data.pinned,
        deadline: data.deadline,
      } as Database['public']['Tables']['announcements']['Insert'])

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
    const supabase = await createClient()
    const { data: dbData, error } = await (supabase.from('announcements') as any)
      .update({ 
        title: data.title, 
        content: data.content, 
        pinned: data.pinned, 
        attachment_paths: data.allPaths,
        updated_at: new Date().toISOString() 
      } as Database['public']['Tables']['announcements']['Update'])
      .eq('id', data.id)
      .eq('created_by', data.userId)
      .select()

    if (error) throw new Error(error.message)
    if (!dbData || dbData.length === 0) {
      throw new Error("Update failed. You might not have permission to edit this announcement.")
    }
  },

  async deleteAnnouncement(id: string, userId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('announcements')
      .delete()
      .eq('id', id)
      .eq('created_by', userId)

    if (error) throw new Error(error.message)
  },

  async createMaterial(data: {
    title: string
    description: string | null
    classId: string
    userId: string
    attachmentPaths: string[]
    fileTypes: string[]
  }) {
    const supabase = await createClient()
    const { data: inserted, error } = await (supabase.from('materials') as any).insert({
      title: data.title,
      description: data.description,
      class_id: data.classId,
      created_by: data.userId,
      attachment_paths: data.attachmentPaths,
      file_types: data.fileTypes,
    } as Database['public']['Tables']['materials']['Insert']).select('id').maybeSingle()

    if (error) throw error
    return { materialId: inserted?.id }
  },

  async updateMaterial(data: {
    materialId: string
    classId: string
    title: string
    description: string | null
    allPaths: string[]
    fileTypes: string[]
  }) {
    const supabase = await createClient()
    const { error } = await (supabase.from('materials') as any)
      .update({ 
        title: data.title, 
        description: data.description, 
        attachment_paths: data.allPaths, 
        file_types: data.fileTypes 
      } as Database['public']['Tables']['materials']['Update'])
      .eq('id', data.materialId)
      .eq('class_id', data.classId)

    if (error) throw new Error(error.message)
  },

  async deleteMaterial(id: string, classId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('materials')
      .delete()
      .eq('id', id)
      .eq('class_id', classId)

    if (error) throw new Error(error.message)
  },

  async createAssignment(data: {
    title: string
    description: string | null
    dueDate: string | null
    points: number
    classId: string
    userId: string
    submissionType: string
    rubricId: string | null
    attachmentPaths: string[]
    isGroupProject: boolean
  }) {
    const supabase = await createClient()
    const { data: inserted, error: dbError } = await (supabase
      .from('assignments') as any)
      .insert({
        title: data.title,
        description: data.description,
        due_date: data.dueDate,
        points: data.points,
        class_id: data.classId,
        created_by: data.userId,
        submission_type: data.submissionType,
        rubric_id: data.rubricId,
        attachment_paths: data.attachmentPaths,
        is_group_project: data.isGroupProject,
      } as Database['public']['Tables']['assignments']['Insert'])
      .select()
      .maybeSingle()

    if (dbError) throw dbError
    return { id: inserted?.id }
  },

  async updateAssignment(data: {
    assignmentId: string
    classId: string
    title: string
    description: string | null
    dueDate: string | null
    points: number
    submissionType: string
    rubricId: string | null
    isGroupProject: boolean
    allPaths: string[]
  }) {
    const supabase = await createClient()
    const { data: updated, error } = await (supabase.from('assignments') as any)
      .update({
        title: data.title,
        description: data.description,
        due_date: data.dueDate,
        points: data.points,
        submission_type: data.submissionType,
        rubric_id: data.rubricId,
        is_group_project: data.isGroupProject,
        attachment_paths: data.allPaths,
      } as Database['public']['Tables']['assignments']['Update'])
      .eq('id', data.assignmentId)
      .eq('class_id', data.classId)
      .select()

    if (error) throw new Error(error.message)
    if (!updated || updated.length === 0) {
      throw new Error("Update failed. You might not have permission to edit this assignment.")
    }
    return { id: updated[0].id }
  },

  async deleteAssignment(id: string, classId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('assignments')
      .delete()
      .eq('id', id)
      .eq('class_id', classId)

    if (error) throw new Error(error.message)
  },

  async submitAssignment(data: {
    assignmentId: string
    userId: string
    groupId: string | null | undefined
    content: string | undefined
    files: any[] | undefined
    isGroupProject: boolean
  }) {
    const supabase = await createClient()
    const submissionData: Database['public']['Tables']['submissions']['Insert'] = {
      assignment_id: data.assignmentId,
      content: data.content,
      files: data.files as any,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      user_id: data.userId,
      group_id: (data.isGroupProject && data.groupId) ? data.groupId : null
    }

    const { data: result, error } = await (supabase
      .from('submissions') as any)
      .upsert(submissionData, {
        onConflict: data.isGroupProject ? 'assignment_id,group_id' : 'assignment_id,user_id',
      })
      .select()
      .maybeSingle()

    if (error) throw new Error(error.message)
    return result as Submission
  },

  async saveGroup(classId: string, title: string, groupId: string | null | undefined, studentIds: string[], userId: string) {
    const supabase = await createClient()
    let projectId: string
    const projectTable = supabase.from('group_projects')

    if (groupId) {
      const { error } = await (projectTable as any).update({ title } as Database['public']['Tables']['group_projects']['Update']).eq('id', groupId)
      if (error) throw error
      projectId = groupId
    } else {
      const { data, error } = await (projectTable as any)
        .insert({ title, class_id: classId, created_by: userId } as Database['public']['Tables']['group_projects']['Insert'])
        .select('id')
        .maybeSingle()
      if (error) throw error
      if (!data) throw new Error('Failed to create group project')
      projectId = (data as any).id
    }

    if (projectId && studentIds.length > 0) {
      const membersTable = supabase.from('project_members')
      if (groupId) await (membersTable as any).delete().eq('project_id', projectId)
      const inserts: Database['public']['Tables']['project_members']['Insert'][] = studentIds.map((uId: string) => ({
        project_id: projectId,
        user_id: uId,
        role: 'member',
      }))
      const { error: memError } = await (membersTable as any).insert(inserts)
      if (memError) throw memError
    }
  },

  async removeGroupMember(projectId: string, studentId: string) {
    const supabase = await createClient()
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', studentId)
    if (error) throw error
  },

  async deleteGroup(groupId: string) {
    const supabase = await createClient()
    const { error } = await supabase
      .from('group_projects')
      .delete()
      .eq('id', groupId)
    if (error) throw error
  },

  async getClassName(classId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('classes')
      .select('name')
      .eq('id', classId)
      .maybeSingle()

    if (error || !data) return 'Class'
    return (data as any).name
  }
}
