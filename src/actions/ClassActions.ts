

"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import {
  getStickyNotesSchema,
  addStickyNoteSchema,
  clearStickyNotesSchema,
  createAnnouncementSchema,
  updateAnnouncementSchema,
  deleteAnnouncementSchema,
  createMaterialSchema,
  updateMaterialSchema,
  deleteMaterialSchema,
  createAssignmentSchema,
  updateAssignmentSchema,
  deleteAssignmentSchema,
  submitAssignmentSchema,
  saveGroupSchema,
  removeGroupMemberSchema,
  deleteGroupSchema,
  getClassNameSchema,
  deleteClassSchema,
  updateClassSettingsSchema,
  ALLOWED_FILE_TYPES,
} from "@/lib/validations/class"
import { ClassService, Note } from "@/lib/services/class.service"

// ... existing code ...

/* ---------------- DELETE CLASS ---------------- */

export async function deleteClass(classId: string) {
  const parsed = deleteClassSchema.safeParse({ classId })
  if (!parsed.success) return { data: null, error: "Invalid input" }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: "Unauthorized" }

  try {
    await ClassService.deleteClass(parsed.data.classId, user.id)
    revalidatePath('/dashboard')
    return { data: { success: true }, error: null }
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to delete class" }
  }
}

export async function updateClassSettings(payload: any) {
  const parsed = updateClassSettingsSchema.safeParse(payload)
  if (!parsed.success) return { data: null, error: "Invalid input" }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: "Unauthorized" }

  try {
    await ClassService.updateClassSettings({
      ...parsed.data,
      description: parsed.data.description ?? '',
      userId: user.id
    })
    revalidatePath(`/classes/${parsed.data.classId}`)
    revalidatePath('/dashboard')
    return { data: { success: true }, error: null }
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to update settings" }
  }
}



/* ---------------- GET NOTES ---------------- */

export async function getStickyNotes(classId: string): Promise<Note[]> {
  const parsed = getStickyNotesSchema.safeParse({ classId })
  if (!parsed.success) return []

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  return await ClassService.getStickyNotes(parsed.data.classId, user.id)
}

/* ---------------- ADD NOTE ---------------- */

export async function addStickyNote(classId: string, content: string) {
  if (!content.trim()) return

  const parsed = addStickyNoteSchema.safeParse({ classId, content })
  if (!parsed.success) return { data: null, error: "Invalid input" }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: "Unauthorized" }

  await ClassService.addStickyNote(parsed.data.classId, user.id, parsed.data.content)
}

/* ---------------- CLEAR NOTES ---------------- */

export async function clearStickyNotes(classId: string) {
  const parsed = clearStickyNotesSchema.safeParse({ classId })
  if (!parsed.success) return { data: null, error: "Invalid input" }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: "Unauthorized" }

  await ClassService.clearStickyNotes(parsed.data.classId, user.id)
}



/* ---------------- CREATE ANNOUNCEMENT ---------------- */

export async function createAnnouncement(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const classId = formData.get('classId') as string
  const title = formData.get('title') as string || 'Class Update'
  const content = formData.get('content') as string
  const pinned = formData.get('pinned') === 'true'
  const deadline = formData.get('deadline') as string || null

  const parsed = createAnnouncementSchema.safeParse({ classId, title, content, pinned, deadline })
  if (!parsed.success) throw new Error("Invalid input")

  const files = formData.getAll('files') as File[]
  const attachmentPaths = await ClassService.uploadFiles(files, parsed.data.classId, 'announcements-files')

  await ClassService.createAnnouncement({
    title: parsed.data.title,
    content: parsed.data.content,
    classId: parsed.data.classId,
    userId: user.id,
    attachmentPaths,
    pinned: parsed.data.pinned,
    deadline: parsed.data.deadline,
  })

  revalidatePath(`/classes/${parsed.data.classId}`)
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

  const parsed = updateAnnouncementSchema.safeParse({ id, classId, title, content, pinned })
  if (!parsed.success) throw new Error("Invalid input")

  // Upload new files
  const newFiles = formData.getAll('files') as File[]
  const newPaths = await ClassService.uploadFiles(newFiles, parsed.data.classId, 'announcements-files')

  // Merge with kept existing paths
  let existingPaths: string[] = []
  const existingAttachmentsRaw = formData.get('existingAttachments') as string
  if (existingAttachmentsRaw) {
    try {
      const p = JSON.parse(existingAttachmentsRaw)
      if (Array.isArray(p)) {
        existingPaths = p.map((a: any) => {
          if (typeof a === 'string') return a
          return a?.url || a?.path || null
        }).filter(Boolean) as string[]
      }
    } catch (e) {
      // ignore
    }
  }
  const allPaths: string[] = [...existingPaths, ...newPaths]

  await ClassService.updateAnnouncement({
    id: parsed.data.id,
    classId: parsed.data.classId,
    title: parsed.data.title,
    content: parsed.data.content,
    userId: user.id,
    allPaths,
    pinned: parsed.data.pinned,
  })

  revalidatePath(`/classes/${parsed.data.classId}`)
  return { success: true }
}

/* ---------------- DELETE ANNOUNCEMENT ---------------- */

export async function deleteAnnouncement(id: string, classId: string) {
  const parsed = deleteAnnouncementSchema.safeParse({ id, classId })
  if (!parsed.success) throw new Error("Invalid input")

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  await ClassService.deleteAnnouncement(parsed.data.id, user.id)
  revalidatePath(`/classes/${parsed.data.classId}`)
  revalidatePath('/dashboard')
}

/* ---------------- CREATE MATERIAL ---------------- */

export async function createMaterial(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const classId = formData.get('classId') as string
  const title = formData.get('title') as string || 'Class Material'
  const description = formData.get('description') as string || null

  const parsed = createMaterialSchema.safeParse({ classId, title, description })
  if (!parsed.success) throw new Error("Invalid input")

  const files = formData.getAll('files') as File[]
  if (!files.length) throw new Error('No files provided')

  const fileTypes = files.map((file) => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !ALLOWED_FILE_TYPES.includes(ext))
      throw new Error(`Unsupported file type: ${file.name}`)
    return ext
  })

  const attachmentPaths = await ClassService.uploadFiles(files, parsed.data.classId, 'materials')

  const result = await ClassService.createMaterial({
    title: parsed.data.title || 'Class Material',
    description: parsed.data.description ?? null,
    classId: parsed.data.classId,
    userId: user.id,
    attachmentPaths,
    fileTypes,
  })

  revalidatePath(`/classes/${parsed.data.classId}`)
  return { success: true, materialId: result.materialId }
}

/* ---------------- UPDATE MATERIAL ---------------- */

export async function updateMaterial(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const materialId = formData.get('materialId') as string
  const classId = formData.get('classId') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string || null

  const parsed = updateMaterialSchema.safeParse({ materialId, classId, title, description })
  if (!parsed.success) throw new Error("Invalid input")

  // Upload any newly added files
  const newFiles = formData.getAll('files') as File[]
  const newPaths = await ClassService.uploadFiles(newFiles, parsed.data.classId, 'materials')

  // Merge with kept existing files
  let existingPaths: string[] = []
  const existingFilesRaw = formData.get('existingFiles') as string || formData.get('existingPaths') as string
  if (existingFilesRaw) {
    try {
      const p = JSON.parse(existingFilesRaw)
      if (Array.isArray(p)) {
        existingPaths = p.map((f: any) => {
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

  await ClassService.updateMaterial({
    materialId: parsed.data.materialId,
    classId: parsed.data.classId,
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    allPaths,
    fileTypes,
  })

  revalidatePath(`/classes/${parsed.data.classId}`)
}

/* ---------------- DELETE MATERIAL ---------------- */

export async function deleteMaterial(id: string, classId: string) {
  const parsed = deleteMaterialSchema.safeParse({ id, classId })
  if (!parsed.success) return { data: null, error: "Invalid input" }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: "Unauthorized" }

  try {
    await ClassService.deleteMaterial(parsed.data.id, user.id)
    revalidatePath(`/classes/${parsed.data.classId}`)
    revalidatePath('/dashboard')
    return { data: { success: true }, error: null }
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to delete material" }
  }
}

/* ---------------- CREATE ASSIGNMENT ---------------- */

export async function createAssignment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const classId = formData.get('classId') as string
  const title = formData.get('title') as string
  const description = (formData.get('description') as string) || null
  const dueDate = (formData.get('dueDate') as string) || null
  const points = parseFloat(formData.get('points') as string) || 0
  const submissionType = (formData.get('submissionType') as string) || 'file'
  const rubricId = (formData.get('rubricId') as string) || null
  const isGroupProject = formData.get('isGroupProject') === 'true'

  const parsed = createAssignmentSchema.safeParse({ classId, title, description, dueDate, points, submissionType, rubricId, isGroupProject })
  if (!parsed.success) throw new Error("Invalid input")

  const files = formData.getAll('files') as File[]
  const attachmentPaths = await ClassService.uploadFiles(files, parsed.data.classId, 'assignments')

  try {
    const result = await ClassService.createAssignment({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      dueDate: parsed.data.dueDate ?? null,
      points: parsed.data.points,
      classId: parsed.data.classId,
      userId: user.id,
      submissionType: parsed.data.submissionType,
      rubricId: parsed.data.rubricId ?? null,
      attachmentPaths,
      isGroupProject: parsed.data.isGroupProject,
    })

    revalidatePath(`/classes/${parsed.data.classId}`)
    return { data: { id: result.id, success: true }, error: null }
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to create assignment" }
  }
}

/* ---------------- UPDATE ASSIGNMENT ---------------- */

export async function updateAssignment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: "Unauthorized" }

  const assignmentId = formData.get('assignmentId') as string
  const classId = formData.get('classId') as string
  const title = formData.get('title') as string
  const description = (formData.get('description') as string) || null
  const dueDate = (formData.get('dueDate') as string) || null
  const points = parseFloat(formData.get('points') as string) || 0
  const submissionType = (formData.get('submissionType') as string) || 'file'
  const rubricId = (formData.get('rubricId') as string) || null
  const isGroupProject = formData.get('isGroupProject') === 'true'

  const parsed = updateAssignmentSchema.safeParse({ assignmentId, classId, title, description, dueDate, points, submissionType, rubricId, isGroupProject })
  if (!parsed.success) return { data: null, error: "Invalid input" }

  try {
    // Upload new files
    const newFiles = formData.getAll('files') as File[]
    const newPaths = await ClassService.uploadFiles(newFiles, parsed.data.classId, 'assignments')

    // Merge with kept existing paths
    let existingPaths: string[] = []
    const existingAttachmentsRaw = formData.get('existingAttachments') as string
    if (existingAttachmentsRaw) {
      try {
        const p = JSON.parse(existingAttachmentsRaw)
        if (Array.isArray(p)) {
          existingPaths = p.map((a: any) => {
            if (typeof a === 'string') return a
            return a?.url || a?.path || null
          }).filter(Boolean) as string[]
        }
      } catch (e) {
        // ignore
      }
    }
    const allPaths: string[] = [...existingPaths, ...newPaths]

    const result = await ClassService.updateAssignment({
      assignmentId: parsed.data.assignmentId,
      classId: parsed.data.classId,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      dueDate: parsed.data.dueDate ?? null,
      points: parsed.data.points,
      submissionType: parsed.data.submissionType,
      rubricId: parsed.data.rubricId ?? null,
      isGroupProject: parsed.data.isGroupProject,
      allPaths,
    })

    revalidatePath(`/classes/${parsed.data.classId}`)
    return { data: { id: result.id, success: true }, error: null }
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to update assignment" }
  }
}

/* ---------------- DELETE ASSIGNMENT ---------------- */

export async function deleteAssignment(id: string, classId: string) {
  const parsed = deleteAssignmentSchema.safeParse({ id, classId })
  if (!parsed.success) return { data: null, error: "Invalid input" }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: "Unauthorized" }

  try {
    await ClassService.deleteAssignment(parsed.data.id, user.id)
    revalidatePath(`/classes/${parsed.data.classId}`)
    revalidatePath('/dashboard')
    revalidatePath('/todo')
    return { data: { success: true }, error: null }
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to delete assignment" }
  }
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
  const parsed = submitAssignmentSchema.safeParse({ assignmentId, userId, groupId, content, isGroupProject })
  if (!parsed.success) throw new Error("Invalid input")

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== parsed.data.userId) throw new Error("Unauthorized") // ensures the submitter is the logged in user

  const data = await ClassService.submitAssignment({
    assignmentId: parsed.data.assignmentId,
    userId: parsed.data.userId,
    groupId: parsed.data.groupId,
    content: parsed.data.content,
    files,
    isGroupProject: parsed.data.isGroupProject,
  })

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
  const parsed = saveGroupSchema.safeParse({ classId, title, groupId, studentIds })
  if (!parsed.success) throw new Error("Invalid input")

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await ClassService.saveGroup(
    parsed.data.classId, 
    parsed.data.title, 
    parsed.data.groupId, 
    parsed.data.studentIds, 
    user.id
  )

  revalidatePath(`/dashboard/classes/${parsed.data.classId}`)
  return { success: true }
}

/* ---------------- REMOVE GROUP MEMBER ---------------- */

export async function removeGroupMember(
  projectId: string,
  studentId: string,
  classId: string
) {
  const parsed = removeGroupMemberSchema.safeParse({ projectId, studentId, classId })
  if (!parsed.success) throw new Error("Invalid input")

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  await ClassService.removeGroupMember(parsed.data.projectId, parsed.data.studentId)
  revalidatePath(`/dashboard/classes/${parsed.data.classId}`)
}

/* ---------------- DELETE GROUP ---------------- */

export async function deleteGroup(groupId: string, classId: string) {
  const parsed = deleteGroupSchema.safeParse({ groupId, classId })
  if (!parsed.success) throw new Error("Invalid input")

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  await ClassService.deleteGroup(parsed.data.groupId)
  revalidatePath(`/dashboard/classes/${parsed.data.classId}`)
}

/* ---------------- GET CLASS NAME ---------------- */

export async function getClassName(classId: string) {
  const parsed = getClassNameSchema.safeParse({ classId })
  if (!parsed.success) return 'Class'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'Class'

  return await ClassService.getClassName(parsed.data.classId)
}
