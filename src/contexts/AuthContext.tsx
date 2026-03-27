'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface UserProfile {
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
        setIsAuthenticated(true)
        
        // Get avatar from user metadata (Google provides this)
        const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || null
        
        // Fetch or create user profile
        let profileData = null
        const { data: existingProfile } = await supabase
          .from('users')
          .select('full_name, email, avatar_url')
          .eq('id', user.id)
          .maybeSingle()

        if (existingProfile) {
          profileData = existingProfile
          // Update avatar if it's from Google and different
          if (avatarUrl && (existingProfile as { avatar_url: string | null }).avatar_url !== avatarUrl) {
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
          // Create new profile for OAuth users
          const { data: newProfile } = await (supabase as any)
            .from('users')
            .insert({
              id: user.id,
              email: user.email!,
              full_name: fullName || user.email?.split('@')[0] || 'User',
              avatar_url: avatarUrl,
            } as any)
            .select()
            .maybeSingle()
          
          if (newProfile) {
            profileData = newProfile
          }
        }

        if (profileData) {
          setProfile({
            name: (profileData as { full_name: string }).full_name || user.email || 'User',
            email: (profileData as { email: string }).email,
            role: 'user',
            avatar_url: (profileData as { avatar_url: string }).avatar_url || avatarUrl,
          })
        } else {
          setProfile({
            name: fullName || user.email || 'User',
            email: user.email || '',
            role: 'user',
            avatar_url: avatarUrl,
          })
        }
      } else {
        setIsAuthenticated(false)
        setProfile(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setIsAuthenticated(false)
      setProfile(null)
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

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setIsAuthenticated(false)
      setProfile(null)
      // Use window.location for a full page reload to clear all state
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
      // Still redirect even if signOut fails
      window.location.href = '/'
    }
  }

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

