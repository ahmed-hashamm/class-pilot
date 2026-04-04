import { SupabaseClient } from '@supabase/supabase-js'
import { submitAssignment } from '@/actions/ClassActions'

export const SubmissionService = {
  /**
   * Handles the coordination of file uploads and assignment submission.
   */
  async handleSubmission(params: {
    supabase: any
    assignment: any
    classId?: string
    userId: string
    content?: string
    files: File[]
  }) {
    const { supabase, assignment, classId, userId, content, files } = params

    // 1. Group check
    let groupId = null
    if (assignment.is_group_project) {
      const { data: memberData } = await supabase
        .from('project_members')
        .select('project_id')
        .eq('user_id', userId)
        .maybeSingle()
      
      if (!memberData) throw new Error('No team association found for group project.')
      groupId = (memberData as any).project_id
    }

    // 2. File Uploads
    const uploadedFiles = []
    for (const file of files) {
      const filePath = `submissions/${assignment.id}/${userId}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('assignments')
        .upload(filePath, file)
      
      if (uploadError) throw new Error(`File upload failed: ${uploadError.message}`)
      
      const { data: { publicUrl } } = supabase.storage
        .from('assignments')
        .getPublicUrl(filePath)
      
      uploadedFiles.push({ name: file.name, url: publicUrl, path: filePath })
    }

    // 3. Server Action Call
    const result = await submitAssignment({
      assignmentId: assignment.id,
      classId: classId || assignment.class_id,
      userId: userId,
      groupId,
      content: assignment.submission_type !== 'file' ? content : undefined,
      files: uploadedFiles,
      isGroupProject: assignment.is_group_project,
    })

    return result
  }
}
