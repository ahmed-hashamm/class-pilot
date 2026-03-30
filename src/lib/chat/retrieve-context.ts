// import { createClient } from '@/lib/supabase/server'
// import { embedText } from '@/lib/ingestion/embed-text'
// import { Database } from '@/types/database'

// export async function retrieveContext(
//     question: string,
//     classId: string,
//     matchCount: number = 5
// ) {
//     const supabase = await createClient()
//     const embedding = await embedText(question)

//     const { data: chunks, error } = await supabase.rpc('match_material_chunks', {
//         query_embedding: embedding,
//         match_count: matchCount,
//         class_id: classId
//     } as any)

//     if (error) {
//         console.error('Context retrieval failed:', error)
//         return { chunks: '', availableMaterials: '' }
//     }

//     // Fetch latest class activity for context
//     const results = await Promise.all([
//         supabase.from('announcements').select('title, content').eq('class_id', classId).order('created_at', { ascending: false }).limit(3),
//         supabase.from('assignments').select('title, description, due_date').eq('class_id', classId).order('due_date', { ascending: false }).limit(5),
//         supabase.from('polls').select('question, options, closed_at').eq('class_id', classId).order('created_at', { ascending: false }).limit(2),
//         supabase.from('materials').select('title, description, file_url').eq('class_id', classId).eq('ai_synced', true).order('created_at', { ascending: false }).limit(50)
//     ])

//     const announcements = results[0].data as any[] | null
//     const assignments = results[1].data as any[] | null
//     const polls = results[2].data as any[] | null
//     const materials = (results[3].data as any[] | null) || []

//     const now = new Date()
//     const contextParts = [
//         ...((chunks as any) || []).map((c: any) => `Document Chunk: ${c.content}`),
//         ...(announcements || []).map(a => `Announcement: ${a.title} - ${a.content}`),
//         ...(assignments || []).map(a => {
//             const isPast = a.due_date && new Date(a.due_date) < now
//             const statusLabel = isPast ? '(Past)' : '(Upcoming)'
//             return `Assignment: ${statusLabel} ${a.title} (Due: ${a.due_date}) - ${a.description}`
//         }),
//         ...(polls || []).map(p => `Poll: ${p.question}`),
//         ...materials.map(m => `Material: ${m.title} - ${m.description}`)
//     ]

//     // Helper to get a friendly filename from Supabase storage URL
//     const getFriendlyFilename = (url: string) => {
//         try {
//             const decoded = decodeURIComponent(url)
//             return decoded.split('/').pop() || 'Unknown File'
//         } catch {
//             return 'File'
//         }
//     }

//     return {
//         chunks: contextParts.join('\n\n'),
//         availableMaterials: materials.map(m => 
//             `${m.title} (File: ${getFriendlyFilename(m.file_url)})`
//         ).join(', ')
//     }
// }

import { createClient } from '@/lib/supabase/server'
import { embedText } from '@/lib/ingestion/embed-text'

export async function retrieveContext(question: string, classId: string, matchCount: number = 8) {
    const supabase = await createClient()
    const embedding = await embedText(question)

    const { data: chunks, error } = await supabase.rpc('match_material_chunks', {
        query_embedding: embedding,
        match_count: matchCount,
        class_id: classId,
    } as any)

    if (error) {
        console.error('Context retrieval failed:', error)
        return { chunks: '', availableMaterials: '' }
    }

    const { data: materials, error: matError } = await supabase
        .from('materials')
        .select('title, description, attachment_paths')
        .eq('class_id', classId)
        .eq('ai_synced', true)
        .order('created_at', { ascending: false })
        .limit(50)

    if (matError) console.error('Materials fetch failed:', matError)

    const getFriendlyFilename = (path: string) => {
        try {
            return decodeURIComponent(path).split('/').pop() || 'Unknown File'
        } catch {
            return 'File'
        }
    }

    const chunkText = ((chunks as any[]) || [])
        .map((c: any) => `[${c.material_title || 'Document'}]\n${c.content}`)
        .join('\n\n---\n\n')

    const availableMaterials = (materials || [])
        .map((m: any) => {
            const paths = Array.isArray(m.attachment_paths)
                ? m.attachment_paths
                : [m.attachment_paths].filter(Boolean)
            const filenames = paths.map((p: string) => getFriendlyFilename(p)).join(', ')
            return `- ${m.title} (${filenames || 'No files'})`
        })
        .join('\n')

    return { chunks: chunkText, availableMaterials }
}