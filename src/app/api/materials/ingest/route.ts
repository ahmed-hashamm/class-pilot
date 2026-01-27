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
    .select('*')
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
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await embedText(chunks[i])

    await supabase.from('material_chunks').insert({
      material_id: (material as any).id,
      class_id: (material as any).class_id,
      content: chunks[i],
      embedding,
      chunk_index: i,
    } as any)
  }

  return NextResponse.json({ success: true, chunks: chunks.length })
}
