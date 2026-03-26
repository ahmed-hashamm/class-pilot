import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractTextFromMaterial } from '@/lib/ingestion/extract-text'
import { chunkText } from '@/lib/ingestion/chunk-text'
import { embedText } from '@/lib/ingestion/embed-text'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { materialId } = await req.json()

  if (!materialId) {
    return NextResponse.json({ error: 'materialId required' }, { status: 400 })
  }

  // 1️⃣ Fetch material
  const { data: material, error } = await supabase
    .from('materials')
    .select('id, class_id')
    .eq('id', materialId)
    .single()

  if (error || !material) {
    return NextResponse.json({ error: 'Material not found' }, { status: 404 })
  }

  // 2️⃣ Extract text
  const text = await extractTextFromMaterial(material)

  // 3️⃣ Chunk text
  const chunks = chunkText(text)

  // 4️⃣ Generate embeddings & store
  const insertPayload = []
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await embedText(chunks[i])
    insertPayload.push({
      material_id: (material as any).id,
      class_id: (material as any).class_id,
      content: chunks[i],
      embedding,
      chunk_index: i,
    })
  }

  if (insertPayload.length > 0) {
    const { error: insertError } = await supabase.from('material_chunks').insert(insertPayload as any)
    if (insertError) {
      return NextResponse.json({ error: 'Failed to insert chunks' }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true, chunks: chunks.length })
}
