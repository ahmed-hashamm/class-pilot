'use server'

import { UserService } from '@/lib/services/user.service'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

const getProfileSchema = z.object({
  userId: z.string().uuid()
})

export async function getUserProfile(payload: unknown) {
  const parsed = getProfileSchema.safeParse(payload)
  if (!parsed.success) return { data: null, error: 'Invalid input' }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    const profile = await UserService.getProfile(parsed.data.userId)
    return { data: profile, error: null }
  } catch (err) {
    return { data: null, error: 'Failed to fetch profile' }
  }
}
