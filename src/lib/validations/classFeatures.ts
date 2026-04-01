import { z } from 'zod'

/* ── Attendance ── */
export const createAttendanceSchema = z.object({
  classId: z.string().min(1),
  date: z.string().min(1),
  title: z.string().min(1),
  deadline: z.string().optional(),
  pinned: z.boolean().default(false),
})
export const markAttendancePresentSchema = z.object({
  attendanceId: z.string().min(1),
})
export const closeAttendanceSchema = z.object({
  attendanceId: z.string().min(1),
})

/* ── Polls ── */
export const createPollSchema = z.object({
  classId: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string()).min(1),
  deadline: z.string().optional(),
  pinned: z.boolean().default(false),
})
export const submitPollResponseSchema = z.object({
  pollId: z.string().min(1),
  selectedOptionIndex: z.number().min(0),
})
export const closePollSchema = z.object({
  pollId: z.string().min(1),
})

export const deleteAttendanceSchema = z.object({
  id: z.string().min(1),
  classId: z.string().min(1),
})

export const deletePollSchema = z.object({
  id: z.string().min(1),
  classId: z.string().min(1),
})

/* ── AI Grading ── */
export const generateRubricSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
})

export const saveRubricSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  criteria: z.array(z.object({
    id: z.string(),
    name: z.string().min(1),
    description: z.string().optional(),
    points: z.number().min(0),
  })).min(1, 'At least one criterion is required'),
  total_points: z.number().min(0),
  created_by: z.string().min(1),
})


