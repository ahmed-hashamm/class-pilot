import { createClient } from '@/lib/supabase/server'

export async function extractTextFromMaterial(material: any) {
  const supabase = await createClient()
  let fullText = ''

  for (let i = 0; i < material.attachment_paths.length; i++) {
    const path = material.attachment_paths[i]
    const type = material.file_types[i]

    const { data } = await supabase.storage
      .from('materials')
      .download(path)

    if (!data) continue

    const buffer = Buffer.from(await data.arrayBuffer())

    switch (type) {
      case 'pdf':
        fullText += await extractPdf(buffer)
        break

      case 'docx':
        fullText += await extractDocx(buffer)
        break

      case 'ppt':
      case 'pptx':
        fullText += await extractPpt(buffer)
        break
    }
  }

  return fullText
}

/* ---------- helpers (use libraries later) ---------- */

async function extractPdf(buffer: Buffer): Promise<string> {
  // pdf-parse
  return '[PDF TEXT]'
}

async function extractDocx(buffer: Buffer): Promise<string> {
  // mammoth
  return '[DOCX TEXT]'
}

async function extractPpt(buffer: Buffer): Promise<string> {
  // pptx-parser
  return '[PPT TEXT]'
}
