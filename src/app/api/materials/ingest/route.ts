import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractTextFromMaterial } from '@/lib/ingestion/extract-text'
import { chunkText } from '@/lib/ingestion/chunk-text'
import { embedText } from '@/lib/ingestion/embed-text'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { materialId } = await req.json()

  if (!materialId) {
    return NextResponse.json({ error: 'materialId required' }, { status: 400 })
  }

  // 1️⃣ Fetch material with attachment info
  const { data: materialRaw, error } = await supabase
    .from('materials')
    .select('id, class_id, attachment_paths, file_types, title')
    .eq('id', materialId)
    .maybeSingle()

  if (error || !materialRaw) {
    return NextResponse.json({ error: 'Material not found' }, { status: 404 })
  }

  const material = materialRaw

  // 2️⃣ Delete existing chunks (re-ingest safe)
  await supabase
    .from('material_chunks')
    .delete()
    .eq('material_id', materialId)

  // 3️⃣ Extract text
  const text = await extractTextFromMaterial({
    id: material.id,
    class_id: material.class_id,
    attachment_paths: material.attachment_paths ?? undefined,
    file_types: material.file_types ?? undefined,
  })

  if (!text.trim()) {
    return NextResponse.json(
      { success: false, message: 'No text could be extracted from this material.' },
      { status: 200 }
    )
  }

  // 4️⃣ Chunk text
  const chunks = chunkText(text)

  // 5️⃣ Generate embeddings & store
  const insertPayload: any[] = [] // Still using any[] here as we are building a dynamic insert, but the insert itself will satisfy the schema
  for (let i = 0; i < chunks.length; i++) {
    try {
      const embedding = await embedText(chunks[i])
      insertPayload.push({
        material_id: material.id,
        class_id: material.class_id,
        content: chunks[i],
        embedding,
        chunk_index: i,
      })
    } catch (err) {
      /* Silent failure */
    }
  }

  if (insertPayload.length > 0) {
    const { error: insertError } = await supabase
      .from('material_chunks')
      .insert(insertPayload)

    if (insertError) {
      return NextResponse.json({ error: 'Failed to store chunks' }, { status: 500 })
    }
  }

  // 6️⃣ Mark material as synced
  await supabase
    .from('materials')
    .update({ ai_synced: true })
    .eq('id', materialId)

  return NextResponse.json({
    success: true,
    chunks: insertPayload.length,
    title: material.title,
  })
}
