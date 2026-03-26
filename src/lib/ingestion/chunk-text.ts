/**
 * Splits text into overlapping chunks for vector embedding.
 * Uses word-based splitting with configurable size and overlap.
 */
export function chunkText(
  text: string,
  chunkSize = 400,
  overlap = 50
): string[] {
  const words = text.split(/\s+/).filter(Boolean)

  if (words.length === 0) return []
  if (words.length <= chunkSize) return [words.join(' ')]

  const chunks: string[] = []
  const step = Math.max(1, chunkSize - overlap)

  for (let i = 0; i < words.length; i += step) {
    const chunk = words.slice(i, i + chunkSize).join(' ')
    if (chunk.trim()) chunks.push(chunk)
    if (i + chunkSize >= words.length) break
  }

  return chunks
}