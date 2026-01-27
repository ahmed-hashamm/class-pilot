'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const supabase = createClient()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Profile data state
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  // Feedback state
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [initialLoading, setInitialLoading] = useState(true) // Add this to prevent empty placeholders

  useEffect(() => {
    const loadProfile = async () => {
      setInitialLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setInitialLoading(false)
        return
      }
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
      const publicUrl = data.publicUrl

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl } as never)
        .eq('id', userId)

      if (updateError) throw updateError

      setAvatarUrl(publicUrl)
      setFile(null)
      setStatus({ type: 'success', message: 'Avatar updated!' })
    } catch (error: any) {
      setStatus({ type: 'error', message: 'Failed to upload image.' })
    } finally {
      setUploading(false)
    }
  }

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
      
      // Delay to let user see the success state
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error: any) {
      setStatus({ type: 'error', message: 'Could not save changes.' })
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your personal information below.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 p-4 border rounded-lg bg-slate-50/50">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl ?? undefined} className="object-cover" />
              <AvatarFallback className="bg-slate-200">
                {fullName?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2 flex-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Profile Picture</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="bg-white"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleAvatarUpload}
                disabled={!file || uploading}
              >
                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {uploading ? 'Uploading...' : 'Update Photo'}
              </Button>
            </div>
          </div>

          {/* Name Section */}
          <div className="space-y-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              // The value is the current name. If the user clears it, 
              // the placeholder shows what it originally was.
              value={fullName}
              disabled={initialLoading} 
              onChange={(e) => {
                setFullName(e.target.value)
                if (status) setStatus(null)
              }}
              placeholder={initialLoading ? "Loading..." : fullName || "Enter your name"}
            />
          </div>

          {/* Inline Feedback Message */}
          {status && (
            <div className={`flex items-center gap-2 p-3 rounded-md text-sm font-medium animate-in fade-in slide-in-from-top-1 ${
              status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {status.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {status.message}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button 
              className="flex-1" 
              onClick={handleSaveProfile} 
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="ghost" onClick={() => router.push('/dashboard')} disabled={loading}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}