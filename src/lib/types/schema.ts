import { Database } from '@/types/database'

export type BaseUser = {
  full_name: string | null
  avatar_url: string | null
  email?: string | null
}

export type Material = any & {
  id: string
  title: string
  description: string | null
  created_at: string
  ai_synced?: boolean | null
  file_url?: string | null
  attachment_paths?: string[] | null
  users: BaseUser | null
}

export type Assignment = any & {
  id: string
  title: string
  description: string | null
  due_date: string | null
  points: number
  pinned: boolean | null
  submission_count?: number
  has_submitted?: boolean
  is_group_project?: boolean | null
  users: BaseUser | null
}

export type Group = any & {
  id: string
  title: string
  project_members: (any & {
    users: BaseUser | null
  })[] | null
}

export type SubmissionStatus = 'pending' | 'submitted' | 'missing' | 'graded' | 'late'
