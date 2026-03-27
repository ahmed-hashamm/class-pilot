import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Please fill in all required fields.'),
  email: z.string().email('Please enter a valid email address.'),
  type: z.string(),
  subject: z.string().optional(),
  body: z.string().min(1, 'Please fill in all required fields.'),
})
