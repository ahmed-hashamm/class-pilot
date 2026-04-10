'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import {
  sendDiscussionMessageSchema,
  deleteDiscussionMessageSchema,
  getDiscussionMessagesSchema,
  getDiscussionMessageSchema,
} from '@/lib/validations/discussion'
import { DiscussionService } from '@/lib/services/discussion.service'

export async function getDiscussionMessageById(payload: unknown) {
  const parsed = getDiscussionMessageSchema.safeParse(payload)
  if (!parsed.success) return { data: null, error: 'Invalid input' }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    const message = await DiscussionService.getMessage(parsed.data.messageId)
    return { data: message, error: null }
  } catch (err) {
    return { data: null, error: 'Failed to find message details' }
  }
}

export async function getDiscussionMessages(payload: unknown) {
  const parsed = getDiscussionMessagesSchema.safeParse(payload)
  if (!parsed.success) return { data: null, error: 'Invalid input' }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    const messages = await DiscussionService.getMessages(
      parsed.data.classId,
      parsed.data.topic,
      parsed.data.limit,
      parsed.data.offset
    )
    return { data: messages, error: null }
  } catch (err) {
    return { data: null, error: 'Failed to load messages' }
  }
}

export async function sendDiscussionMessage(payload: unknown) {
  const parsed = sendDiscussionMessageSchema.safeParse(payload)
  if (!parsed.success) return { data: null, error: 'Invalid input' }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    const message = await DiscussionService.sendMessage(
      parsed.data.classId,
      parsed.data.topic,
      parsed.data.content,
      user.id
    )
    return { data: message, error: null }
  } catch (err) {
    return { data: null, error: 'Failed to send message' }
  }
}

export async function deleteDiscussionMessage(payload: unknown) {
  const parsed = deleteDiscussionMessageSchema.safeParse(payload)
  if (!parsed.success) return { data: null, error: 'Invalid input' }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  // Check if user is the teacher of this class
  const { data: classData } = await supabase
    .from('classes')
    .select('created_by')
    .eq('id', parsed.data.classId)
    .maybeSingle()

  const isTeacher = (classData as any)?.created_by === user.id

  try {
    await DiscussionService.deleteMessage(
      parsed.data.messageId,
      user.id,
      isTeacher
    )
    return { data: true, error: null }
  } catch (err) {
    return { data: null, error: 'Failed to delete message' }
  }
}
