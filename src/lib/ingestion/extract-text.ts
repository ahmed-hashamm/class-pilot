import { createClient } from '@/lib/supabase/server'

export interface FileAttachment {
  path: string
  type: string
}

export async function extractTextFromBuffer(buffer: Buffer, fileType: string): Promise<string> {
  const type = fileType.toLowerCase()

  switch (type) {
    case 'pdf':
      return await extractPdf(buffer)

    case 'docx':
    case 'doc':
      return await extractDocx(buffer)

    case 'ppt':
    case 'pptx':
      return await extractPptx(buffer)

    case 'txt':
    case 'md':
      return buffer.toString('utf-8')

    default:
      console.warn(`[extract-text] Unsupported file type: ${type}`)
      return ''
  }
}

export async function extractTextFromMaterial(material: {
  id: string
  class_id: string
  attachment_paths?: string[]
  file_types?: string[]
}): Promise<string> {
  const supabase = await createClient()
  const paths = material.attachment_paths ?? []
  const types = material.file_types ?? []

  if (paths.length === 0) {
    return ''
  }

  const attachments: FileAttachment[] = paths.map((path, i) => ({
    path,
    type: types[i] ?? '',
  }))

  return await extractTextFromFiles(supabase, attachments, 'materials')
}

export async function extractTextFromSubmission(
  supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never,
  attachments: FileAttachment[]
): Promise<string> {
  return await extractTextFromFiles(supabase, attachments, 'assignments')
}

async function extractTextFromFiles(
  supabase: Awaited<ReturnType<typeof createClient>>,
  attachments: FileAttachment[],
  bucket: string
): Promise<string> {
  if (attachments.length === 0) {
    return ''
  }

  const downloadPromises = attachments.map(async (attachment) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(attachment.path)

    if (error || !data) {
      console.error(`[extract-text] Failed to download ${attachment.path}:`, error)
      return ''
    }

    const buffer = Buffer.from(await data.arrayBuffer())
    return extractTextFromBuffer(buffer, attachment.type)
  })

  const texts = await Promise.all(downloadPromises)
  return texts.filter(Boolean).join('\n\n').trim()
}

async function extractPdf(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = (await import('pdf-parse')) as any
    const result = await pdfParse(buffer)
    return result.text + '\n'
  } catch (err) {
    console.error('[extract-text] PDF extraction failed:', err)
    return ''
  }
}

async function extractDocx(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    return result.value + '\n'
  } catch (err) {
    console.error('[extract-text] DOCX extraction failed:', err)
    return ''
  }
}

async function extractPptx(buffer: Buffer): Promise<string> {
  try {
    const JSZip = (await import('jszip')).default
    const zip = await JSZip.loadAsync(buffer)

    const slideTexts: string[] = []

    const slideFiles = Object.keys(zip.files)
      .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
      .sort((a, b) => {
        const numA = parseInt(a.match(/slide(\d+)/)?.[1] || '0')
        const numB = parseInt(b.match(/slide(\d+)/)?.[1] || '0')
        return numA - numB
      })

    for (const slidePath of slideFiles) {
      const xml = await zip.files[slidePath].async('text')

      const textMatches = xml.match(/<a:t[^>]*>([^<]*)<\/a:t>/g)
      if (textMatches) {
        const slideText = textMatches
          .map((match) => match.replace(/<[^>]+>/g, '').trim())
          .filter(Boolean)
          .join(' ')

        if (slideText) {
          slideTexts.push(slideText)
        }
      }
    }

    return slideTexts.join('\n\n') + '\n'
  } catch (err) {
    console.error('[extract-text] PPTX extraction failed:', err)
    return ''
  }
}
