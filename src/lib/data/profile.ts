'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.utf8'

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
  status: { type: 'success' | 'error'; message: string } | null
}

/**
 * Custom hook that manages all profile page logic.
 */
export function useProfile() {
  const supabase = createClient()
  const router = useRouter()

  const [state, setState] = useState<ProfileState>({
    loading: false,
    uploading: false,
    initialLoading: true,
    userId: null,
    fullName: '',
    avatarUrl: null,
    file: null,
    preview: null,
    status: null,
  })

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      setState((s) => ({ ...s, initialLoading: true }))
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setState((s) => ({ ...s, initialLoading: false })); return }

      const { data } = await supabase
        .from('users')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .maybeSingle()

      const userData = data as UserRow | null

      setState((s) => ({
        ...s,
        userId: user.id,
        fullName: userData?.full_name || '',
        avatarUrl: userData?.avatar_url || null,
        initialLoading: false,
      }))
    }
    loadProfile()
  }, [supabase])

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

      setState((s) => ({
        ...s,
        status: { type: 'success', message: 'Changes saved! Redirecting...' },
      }))
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch {
      setState((s) => ({
        ...s,
        loading: false,
        status: { type: 'error', message: 'Could not save changes.' },
      }))
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
    goBack: () => router.push('/dashboard'),
  }
}
