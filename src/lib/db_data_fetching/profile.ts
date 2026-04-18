'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

type UserUpdate = Database['public']['Tables']['users']['Update']

interface ProfileState {
  loading: boolean
  passwordLoading: boolean
  uploading: boolean
  initialLoading: boolean
  userId: string | null
  fullName: string
  avatarUrl: string | null
  file: File | null
  preview: string | null
}

/**
 * Custom hook that manages all profile page logic.
 * Dedicated states for each async operation prevent cross-contamination.
 */
export function useProfile() {
  const supabase = createClient()
  const router = useRouter()
  const { profile: authProfile, loading: authLoading, checkAuth } = useAuth()

  const [state, setState] = useState<ProfileState>({
    loading: false,
    passwordLoading: false,
    uploading: false,
    initialLoading: true,
    userId: null,
    fullName: '',
    avatarUrl: null,
    file: null,
    preview: null,
  })

  // Sync with AuthContext on mount or when authProfile changes
  useEffect(() => {
    if (!authLoading) {
      if (authProfile) {
        setState((s) => ({
          ...s,
          userId: authProfile.id,
          fullName: s.fullName || authProfile.name || '',
          avatarUrl: authProfile.avatar_url,
          initialLoading: false,
        }))
      } else {
        setState((s) => ({ ...s, initialLoading: false }))
      }
    }
  }, [authProfile, authLoading])

  // File preview
  useEffect(() => {
    if (!state.file) { setState((s) => ({ ...s, preview: null })); return }
    const url = URL.createObjectURL(state.file)
    setState((s) => ({ ...s, preview: url }))
    return () => URL.revokeObjectURL(url)
  }, [state.file])

  const setFullName = (name: string) =>
    setState((s) => ({ ...s, fullName: name }))

  const setFile = (file: File | null) =>
    setState((s) => ({ ...s, file }))

  const clearFile = () =>
    setState((s) => ({ ...s, file: null, preview: null }))

  const handleAvatarUpload = async () => {
    if (!state.file || !state.userId) return
    setState((s) => ({ ...s, uploading: true }))
    try {
      const fileExt = state.file.name.split('.').pop()
      const filePath = `${state.userId}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, state.file, { upsert: true })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const { error: updateError } = await (supabase.from('users') as any)
        .update({ avatar_url: data.publicUrl } as UserUpdate)
        .eq('id', state.userId)
      if (updateError) throw updateError

      // Show toast immediately before background refresh
      toast.success('Profile photo updated.')
      setState((s) => ({
        ...s,
        avatarUrl: data.publicUrl,
        file: null,
        preview: null,
      }))

      checkAuth() // fire-and-forget background refresh
    } catch {
      toast.error('Failed to upload image.')
    } finally {
      setState((s) => ({ ...s, uploading: false }))
    }
  }

  const handleSaveProfile = async () => {
    if (!state.userId) return
    setState((s) => ({ ...s, loading: true }))
    try {
      const { error } = await (supabase.from('users') as any)
        .update({ full_name: state.fullName } as UserUpdate)
        .eq('id', state.userId)
      if (error) throw error

      // Show toast immediately before background refresh
      toast.success('Profile updated successfully!')
      checkAuth() // fire-and-forget background refresh
    } catch {
      toast.error('Could not save changes.')
    } finally {
      setState((s) => ({ ...s, loading: false }))
    }
  }

  /**
   * Dedicated password update — uses its own isolated passwordLoading state
   * so it never interferes with the save profile loading state.
   */
  const handleUpdatePassword = async (password: string): Promise<{ error: string | null }> => {
    setState((s) => ({ ...s, passwordLoading: true }))
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error

      // Fire toast immediately — don't await anything after this
      toast.success('Password updated successfully!')
      return { error: null }
    } catch (err: any) {
      const msg = err.message || 'Failed to update password.'
      toast.error(msg)
      return { error: msg }
    } finally {
      setState((s) => ({ ...s, passwordLoading: false }))
    }
  }

  const displayAvatar = state.preview || state.avatarUrl
  const initials = state.fullName?.[0]?.toUpperCase() || 'U'

  return {
    ...state,
    displayAvatar,
    initials,
    setFullName,
    setFile,
    clearFile,
    handleAvatarUpload,
    handleSaveProfile,
    handleUpdatePassword,
    goBack: () => router.push('/dashboard'),
  }
}
