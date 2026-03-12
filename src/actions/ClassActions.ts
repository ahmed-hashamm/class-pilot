// "use server"

// import { createClient } from "@/lib/supabase/server"
// import { revalidatePath } from "next/cache"

// /* ---------------- TYPES ---------------- */
// export interface Note {
//   id: string
//   content: string
//   created_at: string
// }

// /* ---------------- GET NOTES ---------------- */
// export async function getStickyNotes(classId: string): Promise<Note[]> {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()
//   if (!user) return []

//   const { data } = await supabase
//     .from("class_notes")
//     .select("id, content, created_at")
//     .eq("class_id", classId)
//     .eq("user_id", user.id)
//     .order("created_at", { ascending: false })

//   return data ?? []
// }

// /* ---------------- ADD NOTE ---------------- */
// export async function addStickyNote(classId: string, content: string) {
//   if (!content.trim()) return

//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()
//   if (!user) return

//   await supabase.from("class_notes").insert({
//     class_id: classId,
//     user_id: user.id,
//     content,
//   } as any)
// }

// /* ---------------- CLEAR NOTES ---------------- */
// export async function clearStickyNotes(classId: string) {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()
//   if (!user) return

//   await supabase
//     .from("class_notes")
//     .delete()
//     .eq("class_id", classId)
//     .eq("user_id", user.id)
// }
// /* ---------------- HELPER: UPLOAD FILES ---------------- */

// //Internal helper to handle multiple file uploads to a specific bucket

// async function uploadFiles(files: File[], classId: string, bucket: string) {
//   const supabase = await createClient()
//   const paths: string[] = []

//   for (const file of files) {
//     if (file.size > 0) {
//       // Clean filename: remove special chars but keep the name readable
//       const safeName = file.name.replace(/[^a-z0-9.]/gi, '_');
//       const fileName = `${Date.now()}-${safeName}`;

//       const { data, error: uploadError } = await supabase.storage
//         .from(bucket)
//         .upload(`${classId}/${fileName}`, file)

//       if (uploadError) throw new Error(`Upload to ${bucket} failed: ${uploadError.message}`)
//       paths.push(data.path)
//     }
//   }
//   return paths
// }

// /* ---------------- CREATE ANNOUNCEMENT ---------------- */
// export async function createAnnouncement(formData: FormData) {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()
//   if (!user) throw new Error("Unauthorized")

//   const classId = formData.get('classId') as string
//   const files = formData.getAll('files') as File[]

//   const attachmentPaths = await uploadFiles(files, classId, 'announcements-files')

//   const { error: dbError } = await supabase
//     .from('announcements')
//     .insert({
//       title: formData.get('title') || 'Class Update',
//       content: formData.get('content'),
//       class_id: classId,
//       created_by: user.id,
//       attachment_paths: attachmentPaths,
//       pinned: formData.get('pinned') === 'true',
//       deadline: formData.get('deadline') || null
//     } as any)

//   if (dbError) throw new Error(`Announcement failed: ${dbError.message}`)

//   revalidatePath(`/dashboard/classes/${classId}`)
//   return { success: true }
// }




// const ALLOWED_FILE_TYPES = ['pdf', 'docx', 'ppt', 'pptx']

// export async function createMaterial(formData: FormData) {
//   const supabase = await createClient()
//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   if (!user) throw new Error('Unauthorized')

//   const classId = formData.get('classId') as string
//   if (!classId) throw new Error('Missing classId')

//   const files = formData.getAll('files') as File[]
//   if (!files.length) throw new Error('No files provided')

//   // 🔹 Extract & validate file types
//   const fileTypes = files.map((file) => {
//     const ext = file.name.split('.').pop()?.toLowerCase()
//     if (!ext || !ALLOWED_FILE_TYPES.includes(ext)) {
//       throw new Error(`Unsupported file type: ${file.name}`)
//     }
//     return ext
//   })

//   // 🔹 Upload files (existing logic)
//   const attachmentPaths = await uploadFiles(files, classId, 'materials')

//   // 🔹 Insert into DB
//   const { error } = await supabase.from('materials').insert({
//     title: formData.get('title') || 'Class Material',
//     description: formData.get('description'),
//     class_id: classId,
//     created_by: user.id,
//     attachment_paths: attachmentPaths,
//     file_types: fileTypes, // ✅ NEW
//   } as any)

//   if (error) throw error

//   revalidatePath(`/dashboard/classes/${classId}`)
//   return { success: true }
// }

// /* ---------------- CREATE ASSIGNMENT ---------------- */
// export async function createAssignment(formData: FormData) {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()
//   if (!user) throw new Error("Unauthorized")

//   const classId = formData.get('classId') as string
//   const files = formData.getAll('files') as File[]

//   // Custom helper for uploads (reusing your existing logic)
//   const attachmentPaths = await uploadFiles(files, classId, 'assignments')

//   const { data, error: dbError } = await supabase
//     .from('assignments')
//     .insert({
//       title: formData.get('title') as string,
//       description: formData.get('description') as string || null,
//       due_date: formData.get('dueDate') as string || null,
//       points: parseFloat(formData.get('points') as string) || 0,
//       class_id: classId,
//       created_by: user.id,
//       submission_type: formData.get('submissionType') as string || 'file',
//       attachment_paths: attachmentPaths,
//       is_group_project: formData.get('isGroupProject') === 'true',
//     } as any)
//     .select()
//     .single()

//   if (dbError) throw dbError

//   revalidatePath(`/dashboard/classes/${classId}`)
//   return { success: true, id: (data as any).id }
// }
// //* ---------------- Submit Assignment ---------------- */
// interface SubmitAssignmentProps {
//   assignmentId: string;
//   userId: string;
//   groupId?: string | null; // Optional for individual projects
//   content?: string;
//   files?: any[];
//   isGroupProject: boolean;
// }

// export async function submitAssignment({
//   assignmentId,
//   userId,
//   groupId,
//   content,
//   files,
//   isGroupProject
// }: SubmitAssignmentProps) {
//   const supabase = await createClient();

//   // 1. Prepare the data object for insertion
//   const submissionData: any = {
//     assignment_id: assignmentId,
//     content: content,
//     files: files,
//     status: 'submitted', // Default status
//     submitted_at: new Date().toISOString(),
//   };

//   // 2. Determine ownership based on project type
//   if (isGroupProject && groupId) {
//     submissionData.group_id = groupId;
//     // We still record the userId of the person who actually uploaded it for history
//     submissionData.user_id = userId;
//   } else {
//     submissionData.user_id = userId;
//     submissionData.group_id = null; // Explicitly null for individual projects
//   }

//   // 3. Use upsert to allow students to update their submission
//   // Note: Ensure your DB has a unique constraint on (assignment_id, user_id) 
//   // OR (assignment_id, group_id) to prevent duplicate rows.
//   const { data, error } = await supabase
//     .from('submissions')
//     .upsert(submissionData, {
//       onConflict: isGroupProject ? 'assignment_id,group_id' : 'assignment_id,user_id'
//     })
//     .select()
//     .single();

//   if (error) {
//     console.error("Submission Error:", error);
//     throw new Error(error.message);
//   }

//   // 4. Refresh the page data
//   revalidatePath('/todo');
//   return data;
// }


// export async function saveGroup(
//   classId: string,
//   title: string,
//   groupId?: string | null,
//   studentIds: string[] = []
// ) {
//   const supabase = await createClient();
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) throw new Error('Unauthorized');

//   let projectId: string;

//   const projectTable = supabase.from('group_projects') as any;

//   if (groupId) {
//     const { error } = await projectTable
//       .update({ title })
//       .eq('id', groupId);

//     if (error) throw error;
//     projectId = groupId;
//   } else {
//     const { data, error } = await projectTable
//       .insert({
//         title,
//         class_id: classId,
//         created_by: user.id,
//       })
//       .select('id')
//       .single();

//     if (error) throw error;
//     projectId = data.id;
//   }

//   // Handle Project Members
//   if (projectId && studentIds.length > 0) {
//     const membersTable = supabase.from('project_members') as any;

//     // Clean up existing members if updating
//     if (groupId) {
//       await membersTable.delete().eq('project_id', projectId);
//     }

//     const inserts = studentIds.map(uId => ({
//       project_id: projectId,
//       user_id: uId,
//       role: 'member'
//     }));

//     const { error: memError } = await membersTable.insert(inserts);
//     if (memError) throw memError;
//   }

//   revalidatePath(`/dashboard/classes/${classId}`);
//   return { success: true };
// }
// /* ---------------- REMOVE MEMBER ---------------- */
// export async function removeGroupMember(
//   projectId: string,
//   studentId: string,
//   classId: string
// ) {
//   const supabase = await createClient()

//   const { error } = await supabase
//     .from('project_members')
//     .delete()
//     .eq('project_id', projectId)
//     .eq('user_id', studentId)

//   if (error) throw error
//   revalidatePath(`/dashboard/classes/${classId}`)
// }

// /* ---------------- DELETE GROUP ---------------- */
// export async function deleteGroup(groupId: string, classId: string) {
//   const supabase = await createClient()

//   const { error } = await supabase
//     .from('group_projects')
//     .delete()
//     .eq('id', groupId)

//   if (error) throw error
//   revalidatePath(`/dashboard/classes/${classId}`)
// }
// export async function getClassName(classId: string) {
//   const supabase = await createClient()

//   const { data, error } = await supabase
//     .from('classes' as any)
//     .select('name')
//     .eq('id', classId)
//     .single()

//   if (error) return 'Class'

//   return (data as any).name || 'Class'
// }

"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/* ---------------- TYPES ---------------- */
export interface Note {
  id: string
  content: string
  created_at: string
}

/* ---------------- GET NOTES ---------------- */
export async function getStickyNotes(classId: string): Promise<Note[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("class_notes")
    .select("id, content, created_at")
    .eq("class_id", classId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return data ?? []
}

/* ---------------- ADD NOTE ---------------- */
export async function addStickyNote(classId: string, content: string) {
  if (!content.trim()) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from("class_notes").insert({
    class_id: classId,
    user_id: user.id,
    content,
  } as any)
}

/* ---------------- CLEAR NOTES ---------------- */
export async function clearStickyNotes(classId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from("class_notes")
    .delete()
    .eq("class_id", classId)
    .eq("user_id", user.id)
}

/* ---------------- HELPER: UPLOAD FILES ---------------- */
async function uploadFiles(files: File[], classId: string, bucket: string) {
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
}

/* ---------------- CREATE ANNOUNCEMENT ---------------- */
export async function createAnnouncement(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const classId = formData.get('classId') as string
  const files = formData.getAll('files') as File[]
  const attachmentPaths = await uploadFiles(files, classId, 'announcements-files')

  const { error: dbError } = await supabase
    .from('announcements')
    .insert({
      title: formData.get('title') || 'Class Update',
      content: formData.get('content'),
      class_id: classId,
      created_by: user.id,
      attachment_paths: attachmentPaths,
      pinned: formData.get('pinned') === 'true',
      deadline: formData.get('deadline') || null,
    } as any)

  if (dbError) throw new Error(`Announcement failed: ${dbError.message}`)
  revalidatePath(`/dashboard/classes/${classId}`)
  return { success: true }
}

/* ---------------- UPDATE ANNOUNCEMENT ---------------- */
export async function updateAnnouncement(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const id = formData.get('id') as string
  const classId = formData.get('classId') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const pinned = formData.get('pinned') === 'true'

  // Upload new files
  const newFiles = formData.getAll('files') as File[]
  const newPaths = await uploadFiles(newFiles, classId, 'materials')

  // Merge with kept existing paths
  let existingPaths: string[] = []
  const existingAttachmentsRaw = formData.get('existingAttachments') as string
  if (existingAttachmentsRaw) {
    try {
      const parsed = JSON.parse(existingAttachmentsRaw)
      if (Array.isArray(parsed)) {
        existingPaths = parsed.map((a: any) => {
          if (typeof a === 'string') return a
          return a?.url || a?.path || null
        }).filter(Boolean) as string[]
      }
    } catch (e) {
      // ignore
    }
  }
  const allPaths: string[] = [...existingPaths, ...newPaths]

  const { error } = await (supabase.from('announcements') as any)
    .update({ title, content, pinned, attachment_paths: allPaths })
    .eq('id', id)
    .eq('created_by', user.id)

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/classes/${classId}`)
}

/* ---------------- DELETE ANNOUNCEMENT ---------------- */
export async function deleteAnnouncement(id: string, classId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await (supabase.from('announcements') as any)
    .delete()
    .eq('id', id)
    .eq('created_by', user.id)

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/classes/${classId}`)
}

/* ---------------- CREATE MATERIAL ---------------- */
const ALLOWED_FILE_TYPES = ['pdf', 'docx', 'ppt', 'pptx']

export async function createMaterial(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const classId = formData.get('classId') as string
  if (!classId) throw new Error('Missing classId')

  const files = formData.getAll('files') as File[]
  if (!files.length) throw new Error('No files provided')

  const fileTypes = files.map((file) => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !ALLOWED_FILE_TYPES.includes(ext))
      throw new Error(`Unsupported file type: ${file.name}`)
    return ext
  })

  const attachmentPaths = await uploadFiles(files, classId, 'materials')

  const { error } = await supabase.from('materials').insert({
    title: formData.get('title') || 'Class Material',
    description: formData.get('description'),
    class_id: classId,
    created_by: user.id,
    attachment_paths: attachmentPaths,
    file_types: fileTypes,
  } as any)

  if (error) throw error
  revalidatePath(`/dashboard/classes/${classId}`)
  return { success: true }
}

/* ---------------- UPDATE MATERIAL ---------------- */
export async function updateMaterial(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const materialId = formData.get('materialId') as string
  const classId = formData.get('classId') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string

  // Upload any newly added files
  const newFiles = formData.getAll('files') as File[]
  const newPaths = await uploadFiles(newFiles, classId, 'materials')

  // Merge with kept existing files
  let existingPaths: string[] = []
  const existingFilesRaw = formData.get('existingFiles') as string || formData.get('existingPaths') as string
  if (existingFilesRaw) {
    try {
      const parsed = JSON.parse(existingFilesRaw)
      if (Array.isArray(parsed)) {
        existingPaths = parsed.map((f: any) => {
          if (typeof f === 'string') return f
          return f?.url || f?.path || null
        }).filter(Boolean) as string[]
      }
    } catch (e) {
      // ignore
    }
  }
  const allPaths: string[] = [...existingPaths, ...newPaths]

  // Re-derive file_types from path extensions
  const fileTypes = allPaths.map((p) => p.split('.').pop()?.toLowerCase() ?? 'file')

  const { error } = await (supabase.from('materials') as any)
    .update({ title, description, attachment_paths: allPaths, file_types: fileTypes })
    .eq('id', materialId)
    .eq('class_id', classId)

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/classes/${classId}`)
}

/* ---------------- DELETE MATERIAL ---------------- */
export async function deleteMaterial(id: string, classId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await (supabase.from('materials') as any)
    .delete()
    .eq('id', id)
    .eq('class_id', classId)

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/classes/${classId}`)
}

/* ---------------- CREATE ASSIGNMENT ---------------- */
export async function createAssignment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const classId = formData.get('classId') as string
  const files = formData.getAll('files') as File[]
  const attachmentPaths = await uploadFiles(files, classId, 'assignments')

  const { data, error: dbError } = await supabase
    .from('assignments')
    .insert({
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || null,
      due_date: (formData.get('dueDate') as string) || null,
      points: parseFloat(formData.get('points') as string) || 0,
      class_id: classId,
      created_by: user.id,
      submission_type: (formData.get('submissionType') as string) || 'file',
      rubric_id: (formData.get('rubricId') as string) || null,
      attachment_paths: attachmentPaths,
      is_group_project: formData.get('isGroupProject') === 'true',
    } as any)
    .select()
    .single()

  if (dbError) throw dbError
  revalidatePath(`/dashboard/classes/${classId}`)
  return { success: true, id: (data as any).id }
}

/* ---------------- UPDATE ASSIGNMENT ---------------- */
export async function updateAssignment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const assignmentId = formData.get('assignmentId') as string
  const classId = formData.get('classId') as string

  // Upload new files
  const newFiles = formData.getAll('files') as File[]
  const newPaths = await uploadFiles(newFiles, classId, 'assignments')

  // Merge with kept existing paths
  let existingPaths: string[] = []
  const existingAttachmentsRaw = formData.get('existingAttachments') as string
  if (existingAttachmentsRaw) {
    try {
      const parsed = JSON.parse(existingAttachmentsRaw)
      if (Array.isArray(parsed)) {
        existingPaths = parsed.map((a: any) => {
          if (typeof a === 'string') return a
          return a?.url || a?.path || null
        }).filter(Boolean) as string[]
      }
    } catch (e) {
      // ignore
    }
  }
  const allPaths: string[] = [...existingPaths, ...newPaths]

  const { data, error } = await (supabase.from('assignments') as any)
    .update({
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || null,
      due_date: (formData.get('dueDate') as string) || null,
      points: parseFloat(formData.get('points') as string) || 0,
      submission_type: (formData.get('submissionType') as string) || 'file',
      rubric_id: (formData.get('rubricId') as string) || null,
      is_group_project: formData.get('isGroupProject') === 'true',
      attachment_paths: allPaths,
    })
    .eq('id', assignmentId)
    .eq('class_id', classId)
    .select()

  if (error) throw new Error(error.message)

  if (!data || data.length === 0) {
    throw new Error("Update failed. You might not have permission to edit this assignment.")
  }

  revalidatePath(`/dashboard/classes/${classId}`)
  return { success: true, id: (data[0] as any).id }
}

/* ---------------- DELETE ASSIGNMENT ---------------- */
export async function deleteAssignment(id: string, classId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await (supabase.from('assignments') as any)
    .delete()
    .eq('id', id)
    .eq('class_id', classId)

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/classes/${classId}`)
}

/* ---------------- SUBMIT ASSIGNMENT ---------------- */
interface SubmitAssignmentProps {
  assignmentId: string
  userId: string
  groupId?: string | null
  content?: string
  files?: any[]
  isGroupProject: boolean
}

export async function submitAssignment({
  assignmentId,
  userId,
  groupId,
  content,
  files,
  isGroupProject,
}: SubmitAssignmentProps) {
  const supabase = await createClient()

  const submissionData: any = {
    assignment_id: assignmentId,
    content,
    files,
    status: 'submitted',
    submitted_at: new Date().toISOString(),
  }

  if (isGroupProject && groupId) {
    submissionData.group_id = groupId
    submissionData.user_id = userId
  } else {
    submissionData.user_id = userId
    submissionData.group_id = null
  }

  const { data, error } = await supabase
    .from('submissions')
    .upsert(submissionData, {
      onConflict: isGroupProject ? 'assignment_id,group_id' : 'assignment_id,user_id',
    })
    .select()
    .single()

  if (error) {
    console.error("Submission Error:", error)
    throw new Error(error.message)
  }

  revalidatePath('/todo')
  return data
}

/* ---------------- SAVE GROUP ---------------- */
export async function saveGroup(
  classId: string,
  title: string,
  groupId?: string | null,
  studentIds: string[] = []
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  let projectId: string
  const projectTable = supabase.from('group_projects') as any

  if (groupId) {
    const { error } = await projectTable.update({ title }).eq('id', groupId)
    if (error) throw error
    projectId = groupId
  } else {
    const { data, error } = await projectTable
      .insert({ title, class_id: classId, created_by: user.id })
      .select('id')
      .single()
    if (error) throw error
    projectId = data.id
  }

  if (projectId && studentIds.length > 0) {
    const membersTable = supabase.from('project_members') as any
    if (groupId) await membersTable.delete().eq('project_id', projectId)
    const inserts = studentIds.map((uId) => ({
      project_id: projectId,
      user_id: uId,
      role: 'member',
    }))
    const { error: memError } = await membersTable.insert(inserts)
    if (memError) throw memError
  }

  revalidatePath(`/dashboard/classes/${classId}`)
  return { success: true }
}

/* ---------------- REMOVE GROUP MEMBER ---------------- */
export async function removeGroupMember(
  projectId: string,
  studentId: string,
  classId: string
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('project_members')
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', studentId)
  if (error) throw error
  revalidatePath(`/dashboard/classes/${classId}`)
}

/* ---------------- DELETE GROUP ---------------- */
export async function deleteGroup(groupId: string, classId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('group_projects')
    .delete()
    .eq('id', groupId)
  if (error) throw error
  revalidatePath(`/dashboard/classes/${classId}`)
}

/* ---------------- GET CLASS NAME ---------------- */
export async function getClassName(classId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('classes' as any)
    .select('name')
    .eq('id', classId)
    .single()
  if (error) return 'Class'
  return (data as any).name || 'Class'
}
