import { createServerClient as ssrCreateServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { Database } from '@/types/database'

export async function createServerClient() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()

  return ssrCreateServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set({ name, value, ...options })
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export { createServerClient as createClient }
