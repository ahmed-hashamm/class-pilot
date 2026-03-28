import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
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

    // 1. Check if user is the creator OR a teacher in this class
    const { data: member } = await supabase
      .from('class_members')
      .select('role')
      .eq('class_id', data.classId)
      .eq('user_id', data.userId)
      .maybeSingle()

    const { data: classData } = await supabase
      .from('classes')
      .select('created_by')
      .eq('id', data.classId)
      .maybeSingle()

    const isAuthorized = 
      member?.role === 'teacher' || 
      classData?.created_by === data.userId

    // 2. Perform the update
    let query = (supabase.from('announcements') as any)
      .update({ 
        title: data.title, 
        content: data.content, 
        pinned: data.pinned, 
        attachment_paths: data.allPaths,
        updated_at: new Date().toISOString() 
      } as Database['public']['Tables']['announcements']['Update'])
      .eq('id', data.id)
      .eq('class_id', data.classId) // Ensure it belongs to the class

    if (!isAuthorized) {
      // If not a teacher/owner, they MUST be the creator
      query = query.eq('created_by', data.userId)
    }

    const { data: dbData, error } = await query.select()

    if (error) throw new Error(error.message)
    if (!dbData || dbData.length === 0) {
      throw new Error("Update failed. You might not have permission to edit this announcement.")
    }
  },

  async deleteAnnouncement(id: string, userId: string) {
    const supabase = await createClient()

    // 1. Get announcement to find its class_id
    const { data: announcement } = await supabase
      .from('announcements')
      .select('class_id, created_by')
      .eq('id', id)
      .maybeSingle()

    if (!announcement) throw new Error("Announcement not found")

    // 2. Check authorization: creator OR teacher/owner of class
    const { data: member } = await supabase
      .from('class_members')
      .select('role')
      .eq('class_id', announcement.class_id)
      .eq('user_id', userId)
      .maybeSingle()

    const { data: classData } = await supabase
      .from('classes')
      .select('created_by')
      .eq('id', announcement.class_id)
      .maybeSingle()

    const isAuthorized = 
      announcement.created_by === userId || 
      member?.role === 'teacher' || 
      classData?.created_by === userId

    if (!isAuthorized) {
      throw new Error("You do not have permission to delete this announcement")
    }

    // 3. Delete
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
  },

  async createMaterial(data: {
    title: string
    description: string | null
    classId: string
    userId: string
    attachmentPaths: string[]
    fileTypes: string[]
    pinned: boolean
  }) {
    const supabase = await createClient()
    const { data: inserted, error } = await (supabase.from('materials') as any).insert({
      title: data.title,
      description: data.description,
      class_id: data.classId,
      created_by: data.userId,
      attachment_paths: data.attachmentPaths,
      file_types: data.fileTypes,
      pinned: data.pinned,
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
    pinned: boolean
  }) {
    const supabase = await createClient()
    const { error } = await (supabase.from('materials') as any)
      .update({ 
        title: data.title, 
        description: data.description, 
        attachment_paths: data.allPaths, 
        file_types: data.fileTypes,
        pinned: data.pinned,
      } as Database['public']['Tables']['materials']['Update'])
      .eq('id', data.materialId)
      .eq('class_id', data.classId)

    if (error) throw new Error(error.message)
  },

  async deleteMaterial(id: string, userId: string) {
    const supabase = await createClient()

    // 1. Get material to find its class_id and creator
    const { data: material } = await supabase
      .from('materials')
      .select('class_id, created_by')
      .eq('id', id)
      .maybeSingle()

    if (!material) throw new Error("Material not found")

    // 2. Check authorization: creator OR teacher/owner of class
    const { data: member } = await supabase
      .from('class_members')
      .select('role')
      .eq('class_id', material.class_id)
      .eq('user_id', userId)
      .maybeSingle()

    const { data: classData } = await supabase
      .from('classes')
      .select('created_by')
      .eq('id', material.class_id)
      .maybeSingle()

    const isAuthorized = 
      material.created_by === userId || 
      member?.role === 'teacher' || 
      classData?.created_by === userId

    if (!isAuthorized) {
      throw new Error("You do not have permission to delete this material")
    }

    // 3. Delete the material (using admin client to bypass RLS, authorized by service layer)
    const admin = createAdminClient()
    const { error, data: deletedItems } = await admin
      .from('materials')
      .delete()
      .eq('id', id)
      .select()

    if (error) throw new Error(error.message)
    if (!deletedItems || deletedItems.length === 0) {
      throw new Error("Deletion failed. The record might still exist due to database constraints.")
    }
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
    pinned: boolean
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
        pinned: data.pinned,
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
    pinned: boolean
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
        pinned: data.pinned,
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

  async deleteAssignment(id: string, userId: string) {
    const supabase = await createClient()

    // 1. Get assignment to find its class_id and creator
    const { data: assignment } = await supabase
      .from('assignments')
      .select('class_id, created_by')
      .eq('id', id)
      .maybeSingle()

    if (!assignment) throw new Error("Assignment not found")

    // 2. Check authorization: creator OR teacher/owner of class
    const { data: member } = await supabase
      .from('class_members')
      .select('role')
      .eq('class_id', assignment.class_id)
      .eq('user_id', userId)
      .maybeSingle()

    const { data: classData } = await supabase
      .from('classes')
      .select('created_by')
      .eq('id', assignment.class_id)
      .maybeSingle()

    const isAuthorized = 
      assignment.created_by === userId || 
      member?.role === 'teacher' || 
      classData?.created_by === userId

    if (!isAuthorized) {
      throw new Error("You do not have permission to delete this assignment")
    }

    // 3. Delete related submissions (using admin client to bypass RLS, authorized by service layer)
    const admin = createAdminClient()
    const { error: subError } = await (admin.from('submissions') as any)
      .delete()
      .eq('assignment_id', id)

    if (subError) throw new Error(`Failed to delete related submissions: ${subError.message}`)

    // 4. Delete the assignment
    const { error, data: deletedItems } = await admin
      .from('assignments')
      .delete()
      .eq('id', id)
      .select()

    if (error) throw new Error(error.message)
    if (!deletedItems || deletedItems.length === 0) {
      throw new Error("Deletion failed. The record might still exist due to database constraints.")
    }
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

    const admin = createAdminClient()
    console.log('[ClassService] Admin client initialized. checking table: submissions')
    
    // 1. Check for existing submission
    let existingQuery = admin.from('submissions').select('id')
      .eq('assignment_id', data.assignmentId)
    
    if (data.isGroupProject && data.groupId) {
      existingQuery = existingQuery.eq('group_id', data.groupId)
    } else {
      existingQuery = existingQuery.eq('user_id', data.userId)
    }
    
    console.log('[ClassService] Fetching existing...')
    const { data: existing, error: findError } = await existingQuery.maybeSingle()
    if (findError) {
      console.error('[ClassService] Find Error:', findError)
      throw findError
    }

    let result
    if (existing) {
      console.log('[ClassService] Found existing. Updating:', existing.id)
      const { data: updated, error: updateError } = await (admin.from('submissions') as any)
        .update({
          content: data.content ?? null,
          files: data.files as any,
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          user_id: data.userId
        })
        .eq('id', existing.id)
        .select()
        .maybeSingle()
      
      if (updateError) {
        console.error('[ClassService] Update Error:', updateError)
        throw updateError
      }
      result = updated
    } else {
      console.log('[ClassService] No existing. Inserting...')
      const { data: inserted, error: insertError } = await (admin.from('submissions') as any)
        .insert(submissionData)
        .select()
        .maybeSingle()
      
      if (insertError) {
        console.error('[ClassService] Insert Error:', insertError)
        throw insertError
      }
      result = inserted
    }

    if (!result) {
      console.warn('[ClassService] DB operation returned no result row (but no error).')
    } else {
      console.log('[ClassService] Operation complete. Result ID:', result.id)
    }

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
  },

  async deleteClass(classId: string, userId: string) {
    const supabase = await createClient()

    // 1. Verify ownership (only the creator can delete)
    const { data: classData, error: fetchError } = await supabase
      .from('classes')
      .select('created_by')
      .eq('id', classId)
      .maybeSingle()

    if (fetchError || !classData) throw new Error("Class not found")
    if (classData.created_by !== userId) {
      throw new Error("You do not have permission to delete this class")
    }

    // 2. Delete the class (CASCADE should handle the rest)
    const { error: deleteError } = await supabase
      .from('classes')
      .delete()
      .eq('id', classId)

    if (deleteError) throw new Error(deleteError.message)
  },

  async updateClassSettings(data: {
    classId: string,
    name: string,
    description: string,
    settings: any,
    userId: string
  }) {
    const supabase = await createClient()
    
    // Ownership check
    const { data: classData } = await supabase
      .from('classes')
      .select('created_by')
      .eq('id', data.classId)
      .maybeSingle()

    if (!classData || classData.created_by !== data.userId) {
      throw new Error("Unauthorized to update class settings")
    }

    const { error } = await (supabase.from('classes') as any)
      .update({
        name: data.name,
        description: data.description,
        settings: data.settings
      })
      .eq('id', data.classId)

    if (error) throw error
  }
}
