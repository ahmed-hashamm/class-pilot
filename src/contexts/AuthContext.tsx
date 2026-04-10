'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  avatar_url: string | null
}

interface AuthContextType {
  isAuthenticated: boolean
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  const checkAuth = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Essential: Set authenticated true immediately since we have a valid Supabase user
        setIsAuthenticated(true)
        
        // Get fallback info from user metadata (Google/OAuth or Signup)
        const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || null
        
        // Fetch or create user profile
        let profileData = null
        try {
          const { data: existingProfile, error: fetchError } = await supabase
            .from('users')
            .select('full_name, email, avatar_url')
            .eq('id', user.id)
            .maybeSingle()

          if (fetchError) {
            console.error('Error fetching profile, using metadata fallback:', fetchError)
          }

          if (existingProfile) {
            profileData = existingProfile
            // Update avatar if it's different in metadata (e.g. Google updated)
            if (avatarUrl && (existingProfile as any).avatar_url !== avatarUrl) {
              const { data: updatedProfile } = await (supabase as any)
                .from('users')
                .update({ avatar_url: avatarUrl } as any)
                .eq('id', user.id)
                .select()
                .maybeSingle()
              if (updatedProfile) {
                profileData = updatedProfile
              }
            }
          } else {
            // Create profile if missing
            const { data: newProfile, error: insertError } = await (supabase as any)
              .from('users')
              .insert({
                id: user.id,
                email: user.email!,
                full_name: fullName || user.email?.split('@')[0] || 'User',
                avatar_url: avatarUrl,
              } as any)
              .select()
              .maybeSingle()
            
            if (insertError) {
              console.error('Failed to create profile, using metadata fallback:', insertError)
            } else if (newProfile) {
              profileData = newProfile
            }
          }
        } catch (err) {
          console.error('Profile sync logic failed:', err)
        }

        // Apply profile data with full metadata fallback
        setProfile({
          id: user.id,
          name: (profileData as any)?.full_name || fullName || user.email?.split('@')[0] || 'User',
          email: (profileData as any)?.email || user.email || '',
          role: 'user',
          avatar_url: (profileData as any)?.avatar_url || avatarUrl,
        })
      } else {
        setIsAuthenticated(false)
        setProfile(null)
      }
    } catch (error) {
      console.error('Auth check main error:', error)
      // Only set to false if we explicitly failed to get a user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsAuthenticated(false)
        setProfile(null)
      }
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Force a refresh when user signs in
        await checkAuth()
      } else {
        setIsAuthenticated(false)
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [checkAuth, supabase])

  const signOut = useCallback(async () => {
    try {
      // 1. Immediately clear local state for instant UI feedback
      setIsAuthenticated(false)
      setProfile(null)
      setLoading(false)

      // 2. Clear global session
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      // 3. Force a complete page reload to a clean state on the login page
      // Use window.location for the most reliable "panic" redirect
      window.location.href = '/login'
    }
  }, [supabase])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        profile,
        loading,
        signOut,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

