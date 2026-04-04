import { z } from 'zod'

/* ── Discussion Topics ── */
export const DISCUSSION_TOPICS = ['assignments', 'materials', 'groups'] as const
export type DiscussionTopic = typeof DISCUSSION_TOPICS[number]

/* ── Send Message ── */
export const sendDiscussionMessageSchema = z.object({
  classId: z.string().uuid('Invalid class ID'),
  topic: z.enum(DISCUSSION_TOPICS),
  content: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
})

/* ── Delete Message ── */
export const deleteDiscussionMessageSchema = z.object({
  messageId: z.string().uuid('Invalid message ID'),
  classId: z.string().uuid('Invalid class ID'),
})

/* ── Fetch Messages ── */
export const getDiscussionMessagesSchema = z.object({
  classId: z.string().uuid('Invalid class ID'),
  topic: z.enum(DISCUSSION_TOPICS),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
})

export const getDiscussionMessageSchema = z.object({
  messageId: z.string().uuid('Invalid message ID'),
})
