import { z } from 'zod'

/* ── Sticky Notes ── */
export const getStickyNotesSchema = z.object({ classId: z.string().min(1) })
export const addStickyNoteSchema = z.object({
  classId: z.string().min(1),
  content: z.string().min(1),
})
export const clearStickyNotesSchema = z.object({ classId: z.string().min(1) })

/* ── Announcements ── */
export const createAnnouncementSchema = z.object({
  classId: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  pinned: z.boolean(),
  deadline: z.string().nullable(),
})
export const updateAnnouncementSchema = z.object({
  id: z.string().min(1),
  classId: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  pinned: z.boolean(),
})
export const deleteAnnouncementSchema = z.object({
  id: z.string().min(1),
  classId: z.string().min(1),
})

/* ── Materials ── */
export const ALLOWED_FILE_TYPES = ['pdf', 'docx', 'ppt', 'pptx']
export const createMaterialSchema = z.object({
  classId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  pinned: z.boolean().default(false),
})
export const updateMaterialSchema = z.object({
  materialId: z.string().min(1),
  classId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  pinned: z.boolean().default(false),
})
export const deleteMaterialSchema = z.object({
  id: z.string().min(1),
  classId: z.string().min(1),
})

/* ── Assignments ── */
export const createAssignmentSchema = z.object({
  classId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  points: z.number().default(0),
  submissionType: z.string().default('file'),
  rubricId: z.string().nullable().optional(),
  isGroupProject: z.boolean().default(false),
  pinned: z.boolean().default(false),
})

export const updateAssignmentSchema = z.object({
  assignmentId: z.string().min(1),
  classId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  points: z.number().default(0),
  submissionType: z.string().default('file'),
  rubricId: z.string().nullable().optional(),
  isGroupProject: z.boolean().default(false),
  pinned: z.boolean().default(false),
})

export const deleteAssignmentSchema = z.object({
  id: z.string().min(1),
  classId: z.string().min(1),
})

export const submitAssignmentSchema = z.object({
  assignmentId: z.string().min(1),
  classId: z.string().min(1),
  userId: z.string().min(1),
  groupId: z.string().nullable().optional(),
  content: z.string().optional(),
  isGroupProject: z.boolean(),
})

/* ── Groups ── */
export const saveGroupSchema = z.object({
  classId: z.string().min(1),
  title: z.string().min(1),
  groupId: z.string().nullable().optional(),
  studentIds: z.array(z.string()).default([]),
})

export const removeGroupMemberSchema = z.object({
  projectId: z.string().min(1),
  studentId: z.string().min(1),
  classId: z.string().min(1),
})

export const deleteGroupSchema = z.object({
  groupId: z.string().min(1),
  classId: z.string().min(1),
})

export const getClassNameSchema = z.object({
  classId: z.string().min(1),
})

export const deleteClassSchema = z.object({
  classId: z.string().min(1),
})

export const updateClassSettingsSchema = z.object({
  classId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  settings: z.record(z.any()),
})

export const togglePinSchema = z.object({
  id: z.string().min(1),
  classId: z.string().min(1),
  pinned: z.boolean(),
  type: z.enum(['announcements', 'materials', 'assignments', 'polls', 'attendances']),
})

export const leaveClassSchema = z.object({
  classId: z.string().min(1),
})

export const toggleClassPinSchema = z.object({
  classId: z.string().min(1),
  pinned: z.boolean(),
})
