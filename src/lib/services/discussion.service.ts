import { createClient } from '@/lib/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { DiscussionTopic } from '@/lib/validations/discussion'

export interface DiscussionMessage {
  id: string
  content: string
  created_at: string
  user_id: string
  class_id?: string
  users: {
    full_name: string | null
    avatar_url: string | null
  }
}

export const DiscussionService = {
  async getMessages(classId: string, topic: DiscussionTopic, limit = 50, offset = 0) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>

    // 1. Fetch Teacher ID to identify authoritative messages
    const { data: classData } = await supabase
      .from('classes')
      .select('created_by')
      .eq('id', classId)
      .maybeSingle()

    const teacherId = classData?.created_by

    // 2. Fetch Messages
    const { data, error } = await supabase
      .from('discussion_messages')
      .select('id, content, created_at, user_id, users(full_name, avatar_url)')
      .eq('class_id', classId)
      .eq('topic', topic)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) throw error

    // 3. Map messages with is_author_teacher flag
    return ((data as unknown as DiscussionMessage[]) || []).map(msg => ({
      ...msg,
      is_author_teacher: msg.user_id === teacherId
    }))
  },

  async sendMessage(classId: string, topic: DiscussionTopic, content: string, userId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>

    // Fetch Teacher ID
    const { data: classData } = await supabase
      .from('classes')
      .select('created_by')
      .eq('id', classId)
      .maybeSingle()

    const { data, error } = await supabase
      .from('discussion_messages')
      .insert({
        class_id: classId,
        topic,
        content,
        user_id: userId,
      } as any)
      .select('id, content, created_at, user_id, users(full_name, avatar_url)')
      .maybeSingle()

    if (error) throw error
    if (!data) throw new Error('Failed to create discussion message')

    const message = data as unknown as DiscussionMessage

    return {
      ...message,
      is_author_teacher: message.user_id === classData?.created_by
    }
  },

  async deleteMessage(messageId: string, userId: string, isTeacher: boolean) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { error } = await supabase
      .from('discussion_messages')
      .delete()
      .eq('id', messageId)

    if (error) throw error
  },

  async getMessage(messageId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>

    const { data, error } = await supabase
      .from('discussion_messages')
      .select('id, content, created_at, user_id, class_id, users(full_name, avatar_url)')
      .eq('id', messageId)
      .maybeSingle()

    if (error) throw error
    if (!data) return null

    const message = data as unknown as DiscussionMessage

    const { data: classData } = await supabase
      .from('classes')
      .select('created_by')
      .eq('id', message.class_id!)
      .maybeSingle()

    return {
      ...message,
      is_author_teacher: message.user_id === classData?.created_by
    }
  },
}


