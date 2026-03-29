import { createClient } from '@/lib/supabase/server'
import { embedText } from '@/lib/ingestion/embed-text'
import { Database } from '@/types/database'

export async function retrieveContext(
    question: string,
    classId: string,
    matchCount: number = 5
) {
    const supabase = await createClient()
    const embedding = await embedText(question)

    const { data: chunks, error } = await supabase.rpc('match_material_chunks', {
        query_embedding: embedding,
        match_count: matchCount,
        class_id: classId
    } as any)

    if (error) {
        console.error('Context retrieval failed:', error)
        return ''
    }

    // Fetch latest class activity for context
    const results = await Promise.all([
        supabase.from('announcements').select('title, content').eq('class_id', classId).order('created_at', { ascending: false }).limit(3),
        supabase.from('assignments').select('title, description, due_date').eq('class_id', classId).order('created_at', { ascending: false }).limit(3),
        supabase.from('polls').select('question, options').eq('class_id', classId).order('created_at', { ascending: false }).limit(2),
        supabase.from('materials').select('title, description').eq('class_id', classId).order('created_at', { ascending: false }).limit(3)
    ])

    const announcements = results[0].data as any[] | null
    const assignments = results[1].data as any[] | null
    const polls = results[2].data as any[] | null
    const materials = results[3].data as any[] | null

    const contextParts = [
        ...((chunks as any) || []).map((c: any) => `Document Chunk: ${c.content}`),
        ...(announcements || []).map(a => `Announcement: ${a.title} - ${a.content}`),
        ...(assignments || []).map(a => `Assignment: ${a.title} (Due: ${a.due_date}) - ${a.description}`),
        ...(polls || []).map(p => `Poll: ${p.question}`),
        ...(materials || []).map(m => `Material: ${m.title} - ${m.description}`)
    ]

    return contextParts.join('\n\n')
}
