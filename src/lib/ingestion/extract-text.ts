import { createClient } from '@/lib/supabase/server'

/**
 * Extracts text content from all attachments of a material record.
 * Supports PDF and DOCX file types.
 */
export async function extractTextFromMaterial(material: {
  id: string
  class_id: string
  attachment_paths?: string[]
  file_types?: string[]
}): Promise<string> {
  const supabase = await createClient()
  let fullText = ''

  const paths = material.attachment_paths ?? []
  const types = material.file_types ?? []

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i]
    const type = (types[i] ?? '').toLowerCase()

    const { data, error } = await supabase.storage
      .from('materials')
      .download(path)

    if (error || !data) {
      console.error(`[extract-text] Failed to download ${path}:`, error)
      continue
    }

    const buffer = Buffer.from(await data.arrayBuffer())

    switch (type) {
      case 'pdf':
        fullText += await extractPdf(buffer)
        break

      case 'docx':
      case 'doc':
        fullText += await extractDocx(buffer)
        break

      case 'ppt':
      case 'pptx':
        fullText += await extractPptx(buffer)
        break

      case 'txt':
      case 'md':
        fullText += buffer.toString('utf-8')
        break

      default:
        console.warn(`[extract-text] Unsupported file type: ${type}`)
    }
  }

  return fullText.trim()
}

/* ── PDF extraction using pdf-parse ─────────────────────────────────────── */
async function extractPdf(buffer: Buffer): Promise<string> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse')
    const result = await pdfParse(buffer)
    return result.text + '\n'
  } catch (err) {
    console.error('[extract-text] PDF extraction failed:', err)
    return ''
  }
}

/* ── DOCX extraction using mammoth ──────────────────────────────────────── */
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

/* ── PPTX extraction using JSZip (parses XML slides inside the ZIP) ───── */
async function extractPptx(buffer: Buffer): Promise<string> {
  try {
    const JSZip = (await import('jszip')).default
    const zip = await JSZip.loadAsync(buffer)

    const slideTexts: string[] = []

    // PPTX slides are stored as ppt/slides/slide1.xml, slide2.xml, etc.
    const slideFiles = Object.keys(zip.files)
      .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
      .sort((a, b) => {
        const numA = parseInt(a.match(/slide(\d+)/)?.[1] || '0')
        const numB = parseInt(b.match(/slide(\d+)/)?.[1] || '0')
        return numA - numB
      })

    for (const slidePath of slideFiles) {
      const xml = await zip.files[slidePath].async('text')

      // Extract all text content from <a:t> tags (PowerPoint text runs)
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
