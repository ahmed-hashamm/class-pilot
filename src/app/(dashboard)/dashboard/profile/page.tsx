'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle2, AlertCircle, Camera, ArrowLeft } from 'lucide-react'

export default function SettingsPage() {
  const supabase = createClient()
  const router   = useRouter()

  const [loading,        setLoading]        = useState(false)
  const [uploading,      setUploading]      = useState(false)
  const [userId,         setUserId]         = useState<string | null>(null)
  const [fullName,       setFullName]       = useState('')
  const [avatarUrl,      setAvatarUrl]      = useState<string | null>(null)
  const [file,           setFile]           = useState<File | null>(null)
  const [preview,        setPreview]        = useState<string | null>(null)
  const [status,         setStatus]         = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      setInitialLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setInitialLoading(false); return }
      setUserId(user.id)

      const { data } = await supabase
        .from('users')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single()

      if (data) {
        setFullName((data as any).full_name || '')
        setAvatarUrl((data as any).avatar_url || null)
      }
      setInitialLoading(false)
    }
    loadProfile()
  }, [supabase])

  // Live preview before upload
  useEffect(() => {
    if (!file) { setPreview(null); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  // Upload avatar
  const handleAvatarUpload = async () => {
    if (!file || !userId) return
    setUploading(true)
    setStatus(null)
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `${userId}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: data.publicUrl } as never)
        .eq('id', userId)
      if (updateError) throw updateError

      setAvatarUrl(data.publicUrl)
      setFile(null)
      setPreview(null)
      setStatus({ type: 'success', message: 'Profile photo updated.' })
    } catch {
      setStatus({ type: 'error', message: 'Failed to upload image.' })
    } finally {
      setUploading(false)
    }
  }

  // Save name
  const handleSaveProfile = async () => {
    if (!userId) return
    setLoading(true)
    setStatus(null)
    try {
      const { error } = await supabase
        .from('users')
        .update({ full_name: fullName } as never)
        .eq('id', userId)
      if (error) throw error

      setStatus({ type: 'success', message: 'Changes saved! Redirecting...' })
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch {
      setStatus({ type: 'error', message: 'Could not save changes.' })
      setLoading(false)
    }
  }

  const displayAvatar = preview || avatarUrl
  const initials      = fullName?.[0]?.toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-5">

        {/* Back + title */}
        <div>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-1.5 text-muted-foreground
              hover:text-navy text-[13px] font-semibold mb-5 transition-colors
              cursor-pointer bg-transparent border-none">
            <ArrowLeft size={14} />
            Back to dashboard
          </button>
          <h1 className="font-black text-[24px] tracking-tight">Profile Settings</h1>
          <p className="text-[14px] text-muted-foreground mt-1">
            Update your name and profile photo.
          </p>
        </div>

        {/* Avatar card */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <p className="text-[11px] font-bold tracking-[.18em] uppercase text-navy mb-5">
            Profile photo
          </p>

          <div className="flex items-center gap-6">
            {/* Avatar preview */}
            <div className="relative shrink-0">
              <div className="size-20 rounded-2xl overflow-hidden border-2 border-border
                bg-secondary flex items-center justify-center">
                {displayAvatar ? (
                  <img src={displayAvatar} alt={fullName}
                    className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[26px] font-black text-navy">{initials}</span>
                )}
              </div>
              <label htmlFor="avatar-upload"
                className="absolute -bottom-1.5 -right-1.5 size-7 rounded-full
                  bg-navy border-2 border-white flex items-center justify-center
                  cursor-pointer hover:bg-navy/90 transition-colors">
                <Camera size={12} className="text-white" />
              </label>
            </div>

            <div className="flex-1">
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { setFile(e.target.files?.[0] || null); setStatus(null) }}
              />
              {file ? (
                <div className="flex flex-col gap-2">
                  <p className="text-[13px] font-semibold text-foreground truncate">
                    {file.name}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAvatarUpload}
                      disabled={uploading}
                      className="inline-flex items-center gap-2 bg-navy text-white
                        font-semibold text-[13px] px-4 py-2 rounded-lg
                        hover:bg-navy/90 transition disabled:opacity-60
                        cursor-pointer border-none">
                      {uploading
                        ? <><Loader2 size={13} className="animate-spin" />Uploading...</>
                        : 'Save photo'}
                    </button>
                    <button
                      onClick={() => { setFile(null); setPreview(null) }}
                      className="text-[13px] font-semibold text-muted-foreground
                        hover:text-foreground transition cursor-pointer
                        bg-transparent border-none">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="avatar-upload"
                    className="inline-flex items-center gap-2 bg-secondary border border-border
                      text-foreground font-semibold text-[13px] px-4 py-2 rounded-lg
                      hover:border-navy/30 transition cursor-pointer">
                    <Camera size={13} />
                    Choose photo
                  </label>
                  <p className="text-[12px] text-muted-foreground mt-2">
                    JPG, PNG or GIF · Max 5MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Name card */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <p className="text-[11px] font-bold tracking-[.18em] uppercase text-navy mb-5">
            Personal info
          </p>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="full-name"
              className="text-[13px] font-semibold text-foreground">
              Full name <span className="text-navy">*</span>
            </label>
            <input
              id="full-name"
              type="text"
              value={fullName}
              disabled={initialLoading}
              onChange={(e) => { setFullName(e.target.value); setStatus(null) }}
              placeholder={initialLoading ? 'Loading...' : 'Enter your full name'}
              className="w-full bg-white border border-border rounded-lg px-4 py-3
                text-[14px] text-foreground placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy
                transition disabled:opacity-50"
            />
          </div>
        </div>

        {/* Status message */}
        {status && (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px]
            font-semibold animate-in fade-in slide-in-from-top-1
            ${status.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
            {status.type === 'success'
              ? <CheckCircle2 size={15} />
              : <AlertCircle size={15} />
            }
            {status.message}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveProfile}
            disabled={loading || initialLoading}
            className="flex-1 inline-flex items-center justify-center gap-2
              bg-navy text-white font-semibold text-[14px] px-6 py-3 rounded-lg
              hover:bg-navy/90 hover:-translate-y-0.5 transition-all
              disabled:opacity-60 disabled:translate-y-0 cursor-pointer border-none">
            {loading
              ? <><Loader2 size={14} className="animate-spin" />Saving...</>
              : 'Save changes'
            }
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-secondary border border-border
              text-foreground font-semibold text-[14px] px-6 py-3 rounded-lg
              hover:border-navy/30 transition disabled:opacity-60 cursor-pointer">
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}