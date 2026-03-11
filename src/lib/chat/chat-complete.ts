import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function chatComplete(prompt: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful teaching assistant.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
  })

  return response.choices[0].message.content
}
