export function buildPrompt(
  contextChunks: string[],
  question: string
) {
  const context = contextChunks.join('\n\n---\n\n')

  return `
You are a university classroom assistant.

Answer the student's question using ONLY the provided context.
If the answer is not in the context, say:
"I cannot find this information in the provided class materials."

CONTEXT:
${context}

QUESTION:
${question}
`
}
