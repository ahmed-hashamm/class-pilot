import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import DashboardNavbarClient from '@/components/layout/DashboardNavbarClient'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Ensure user profile exists in public.users table
  const { data: existingProfile } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (!existingProfile) {
    // Create user profile if it doesn't exist
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || null

    const { error: profileError } = await supabase.from('users').insert({
      id: user.id,
      email: user.email!,
      full_name: fullName || user.email?.split('@')[0] || 'User',
      avatar_url: avatarUrl,
    } as any)

    if (profileError) {
      console.error('Failed to create user profile in layout:', profileError)
      // Still render the page, but log the error
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="h-16 border-b border-gray-200 bg-white" />}>
        <DashboardNavbarClient />
      </Suspense>
      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}

