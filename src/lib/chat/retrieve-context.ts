import { createClient } from '@/lib/supabase/server'
import { embedText } from '@/lib/ingestion/embed-text'

export async function retrieveContext(
    question: string,
    classId: string,
    topK = 5
): Promise<string[]> {
    const supabase = await createClient()

    // 1️⃣ Embed the question for vector search on materials
    const embedding = await embedText(question)

    // 2️⃣ Fetch vector matches from materials
    const { data: vectorData, error: vectorError } = await supabase.rpc(
        'match_material_chunks',
        {
            query_embedding: embedding,
            match_count: topK,
            p_class_id: classId,
        } as unknown as never
    )

    if (vectorError) {
        console.error('Vector search error:', vectorError)
    }

    const materialChunks = (vectorData as { content: string }[] || []).map((row) => row.content)

    // 3️⃣ Fetch class metadata (Name & Description)
    const { data: classMeta } = await supabase
        .from('classes')
        .select('name, description')
        .eq('id', classId)
        .maybeSingle()

    const classContext = classMeta 
        ? [`Class Name: ${classMeta.name}. Description: ${classMeta.description}`]
        : []

    // 4️⃣ Fetch recent activity (Announcements, Assignments, Polls)
    // Fetch announcements
    const { data: announcements } = await supabase
        .from('announcements')
        .select('title, content, created_at')
        .eq('class_id', classId)
        .order('created_at', { ascending: false })
        .limit(3)

    // Fetch assignments
    const { data: assignments } = await supabase
        .from('assignments')
        .select('title, description, due_date, created_at')
        .eq('class_id', classId)
        .order('created_at', { ascending: false })
        .limit(3)

    // Fetch polls
    const { data: polls } = await supabase
        .from('polls')
        .select('question, options, created_at')
        .eq('class_id', classId)
        .order('created_at', { ascending: false })
        .limit(2)

    // Fetch latest materials metadata (Inventory)
    const { data: latestMaterials } = await supabase
        .from('materials')
        .select('title, description, created_at')
        .eq('class_id', classId)
        .order('created_at', { ascending: false })
        .limit(3)

    // Format metadata strings
    const announcementContext = (announcements || []).map(a => 
        `Announcement: "${a.title}". Content: ${a.content}. Posted on: ${a.created_at}`
    )
    const assignmentContext = (assignments || []).map(a => 
        `Assignment Post (Inventory): "${a.title}". Due Date: ${a.due_date || 'No due date'}. Description: ${a.description || 'No description'}. Posted on: ${a.created_at}`
    )
    const pollContext = (polls || []).map(p => 
        `Poll: "${p.question}". Options: ${JSON.stringify(p.options)}. Posted on: ${p.created_at}`
    )
    const materialMetadataContext = (latestMaterials || []).map(m => 
        `Material Uploaded: "${m.title}". Description: ${m.description || 'No description'}. Uploaded on: ${m.created_at}`
    )

    // Combine all context
    return [
        ...classContext,
        ...announcementContext,
        ...assignmentContext,
        ...pollContext,
        ...materialMetadataContext,
        ...materialChunks
    ]
}
