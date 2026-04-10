'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import { useAuth } from '@/contexts/AuthContext'

type UserRow = Database['public']['Tables']['users']['Row']
type UserUpdate = Database['public']['Tables']['users']['Update']

interface ProfileState {
  loading: boolean
  uploading: boolean
  initialLoading: boolean
  userId: string | null
  fullName: string
  avatarUrl: string | null
  file: File | null
  preview: string | null
  // Password updates
  newPassword?: string
  confirmPassword?: string
  status: { type: 'success' | 'error'; message: string } | null
}

/**
 * Custom hook that manages all profile page logic.
 */
export function useProfile() {
  const supabase = createClient()
  const router = useRouter()
  const { profile: authProfile, loading: authLoading, checkAuth } = useAuth()

  const [state, setState] = useState<ProfileState>({
    loading: false,
    uploading: false,
    initialLoading: true,
    userId: null,
    fullName: '',
    avatarUrl: null,
    file: null,
    preview: null,
    newPassword: '',
    confirmPassword: '',
    status: null,
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
    setState((s) => ({ ...s, fullName: name, status: null }))

  const setFile = (file: File | null) =>
    setState((s) => ({ ...s, file, status: null }))

  const clearFile = () =>
    setState((s) => ({ ...s, file: null, preview: null }))

  const handleAvatarUpload = async () => {
    if (!state.file || !state.userId) return
    setState((s) => ({ ...s, uploading: true, status: null }))
    try {
      const fileExt = state.file.name.split('.').pop()
      const filePath = `${state.userId}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, state.file, { upsert: true })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const { error: updateError } = await (supabase
        .from('users') as any)
        .update({ avatar_url: data.publicUrl } as UserUpdate)
        .eq('id', state.userId)
      if (updateError) throw updateError

      await checkAuth() // Refresh global state

      setState((s) => ({
        ...s,
        avatarUrl: data.publicUrl,
        file: null,
        preview: null,
        status: { type: 'success', message: 'Profile photo updated.' },
      }))
    } catch {
      setState((s) => ({ ...s, status: { type: 'error', message: 'Failed to upload image.' } }))
    } finally {
      setState((s) => ({ ...s, uploading: false }))
    }
  }

  const handleSaveProfile = async () => {
    if (!state.userId) return
    setState((s) => ({ ...s, loading: true, status: null }))
    try {
      const { error } = await (supabase
        .from('users') as any)
        .update({ full_name: state.fullName } as UserUpdate)
        .eq('id', state.userId)
      if (error) throw error

      await checkAuth() // Refresh global state

      setState((s) => ({
        ...s,
        loading: false,
        status: { type: 'success', message: 'Profile updated successfully!' },
      }))
    } catch {
      setState((s) => ({
        ...s,
        loading: false,
        status: { type: 'error', message: 'Could not save changes.' },
      }))
    }
  }

  const handleUpdatePassword = async (password: string) => {
    setState(s => ({ ...s, loading: true, status: null }))
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error

      setState(s => ({
        ...s,
        loading: false,
        status: { type: 'success', message: 'Password updated successfully!' }
      }))
      return { error: null }
    } catch (err: any) {
      const msg = err.message || 'Failed to update password.'
      setState(s => ({ ...s, loading: false, status: { type: 'error', message: msg } }))
      return { error: msg }
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
