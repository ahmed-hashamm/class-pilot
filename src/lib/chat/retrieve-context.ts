import { createClient } from '@/lib/supabase/server'
import { embedText } from '@/lib/ingestion/embed-text'

export async function retrieveContext(
    question: string,
    classId: string,
    topK = 5
): Promise<string[]> {
    const supabase = await createClient()

    // 1️⃣ Embed the question
    const embedding = await embedText(question)

    // 2️⃣ Call vector search function
    const { data, error } = await supabase.rpc(
        'match_material_chunks',
        {
            query_embedding: embedding,
            match_count: topK,
            class_id: classId,
        }
    )

    if (error) {
        console.error(error)
        return []
    }

    return data.map((row: any) => row.content)
}
