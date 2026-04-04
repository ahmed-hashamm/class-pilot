import { createClient } from '@/lib/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { DiscussionTopic } from '@/lib/validations/discussion'

export const DiscussionService = {
  async getMessages(classId: string, topic: DiscussionTopic, limit = 50, offset = 0) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>

    const { data, error } = await supabase
      .from('discussion_messages' as any)
      .select('id, content, created_at, user_id, users(full_name, avatar_url)')
      .eq('class_id', classId)
      .eq('topic', topic)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return (data as any[]) || []
  },

  async sendMessage(classId: string, topic: DiscussionTopic, content: string, userId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>

    const { data, error } = await supabase
      .from('discussion_messages' as any)
      .insert({
        class_id: classId,
        topic,
        content,
        user_id: userId,
      } as any)
      .select('id, content, created_at, user_id')
      .maybeSingle()

    if (error) throw error
    return data
  },

  async deleteMessage(messageId: string, userId: string, isTeacher: boolean) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>

    // If teacher, delete regardless of ownership (RLS policy handles this)
    // If student, RLS enforces they can only delete their own
    const { error } = await supabase
      .from('discussion_messages' as any)
      .delete()
      .eq('id', messageId)

    if (error) throw error
  },
}
