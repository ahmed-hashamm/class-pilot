import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  type UserProfileInsert = {
    id: string
    email: string
    full_name: string
    avatar_url: string | null
  }
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_failed`)
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: existingProfile, error: profileError } = await supabase
        .from('users')
        .select('id, avatar_url')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError) {
        console.error('Profile fetch error:', profileError)
      }

      if (!existingProfile) {
        const avatarUrl =
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          null

        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'User'

        const { error: insertError } = await supabase.from('users').insert([{
            id: user.id,
            email: user.email!,
            full_name: fullName,
            avatar_url: avatarUrl,
          } as any,
        ] as any)

        if (insertError) {
          console.error('Failed to create user profile in callback:', insertError)
        }
      } else if (!(existingProfile as any).avatar_url) {
        const avatarUrl =
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          null

        if (avatarUrl) {
          const { error: updateError } = await supabase
            .from('users')
            .update({ avatar_url: avatarUrl } as never)
            .eq('id', user.id)

          if (updateError) {
            console.error('Failed to update avatar:', updateError)
          }
        }
      }
    }
  }

  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  return NextResponse.redirect(
    `${origin}${next}${next.includes('?') ? '&' : '?'}auth=success&t=${Date.now()}`
  )
}
