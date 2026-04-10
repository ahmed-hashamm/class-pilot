'use server'

import { createServerClient } from '@/lib/supabase/server'
import { ForgotPasswordSchema, UpdatePasswordSchema, SignUpSchema, LoginSchema } from '@/lib/validations/auth'
import { AuthService } from '@/lib/services/auth.service'
import { revalidatePath } from 'next/cache'

export async function requestPasswordReset(payload: unknown) {
  const parsed = ForgotPasswordSchema.safeParse(payload)
  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0].message }
  }

  const supabase = await createServerClient()
  const authService = new AuthService(supabase)

  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const redirectTo = `${origin}/auth/callback?next=/update-password`
    
    await authService.requestPasswordReset(parsed.data.email, redirectTo)
    return { data: 'Password reset link sent to your email', error: null }
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to request password reset' }
  }
}

export async function updatePassword(payload: unknown) {
  const parsed = UpdatePasswordSchema.safeParse(payload)
  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0].message }
  }

  const supabase = await createServerClient()
  
  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: null, error: 'Unauthorized. Please use the link from your email.' }
  }

  const authService = new AuthService(supabase)

  try {
    await authService.updatePassword(parsed.data.password)
    revalidatePath('/', 'layout')
    return { data: 'Password updated successfully', error: null }
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to update password' }
  }
}

export async function signInAction(payload: unknown) {
  const parsed = LoginSchema.safeParse(payload)
  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0].message }
  }

  const supabase = await createServerClient()
  const authService = new AuthService(supabase)

  try {
    const { data } = await authService.signIn(parsed.data.email, parsed.data.password)
    revalidatePath('/', 'layout')
    return { data: data.user, error: null }
  } catch (error: any) {
    return { data: null, error: error.message || 'Invalid email or password' }
  }
}

export async function signUpAction(payload: unknown) {
  const parsed = SignUpSchema.safeParse(payload)
  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0].message }
  }

  const supabase = await createServerClient()
  const authService = new AuthService(supabase)

  try {
    const { data } = await authService.signUp(parsed.data.email, parsed.data.password, parsed.data.fullName)
    revalidatePath('/', 'layout')
    return { data: data.user, error: null }
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to create account' }
  }
}
