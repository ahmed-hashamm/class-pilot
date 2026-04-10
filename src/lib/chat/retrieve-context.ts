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
        return { chunks: '', availableMaterials: '' }
    }

    const { data: materials, error: matError } = await supabase
        .from('materials')
        .select('title, description, attachment_paths')
        .eq('class_id', classId)
        .eq('ai_synced', true)
        .order('created_at', { ascending: false })
        .limit(50)

    if (matError) { /* Silent failure */ }

    const getFriendlyFilename = (path: string) => {
        try {
            const rawName = decodeURIComponent(path).split('/').pop() || 'Unknown File'
            // Strip leading timestamp (e.g., "174242132142-") added during upload
            return rawName.replace(/^\d+-/, '')
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


