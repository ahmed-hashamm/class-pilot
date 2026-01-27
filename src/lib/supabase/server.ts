// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'
// import { Database } from '@/types/database'

// export async function createClient() {
//   const cookieStore = await cookies()

//   // Use the new single-object signature
//   return createServerClient<Database>(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       db: { schema: 'public' },
//       cookies: {
//         getAll() {
//           return cookieStore.getAll()
//         },
//         setAll(cookiesToSet) {
//           try {
//             cookiesToSet.forEach(({ name, value, options }) =>
//               cookieStore.set(name, value, options)
//             )
//           } catch {
//             // This can be ignored if you have middleware handling session refreshes
//           }
//         },
//       },
//     }
//   )
// }
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle server component cookie setting limitation
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle server component cookie setting limitation
          }
        },
      },
    }
  )
}
// lib/supabase/server.ts
// import { createServerClient, type CookieOptions } from '@supabase/ssr'
// import { cookies } from 'next/headers'
// import { Database } from '@/types/database'

// export async function createClient() {
//   const cookieStore = await cookies()

//   return createServerClient<Database, "public">(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       db: { schema: 'public' },
//       cookies: {
//         getAll() {
//           return cookieStore.getAll()
//         },
//         // Explicitly typing the arguments to stop the "never" / "any" errors
//         setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
//           try {
//             cookiesToSet.forEach(({ name, value, options }) =>
//               cookieStore.set(name, value, options)
//             )
//           } catch {
//             // Ignore for Server Actions
//           }
//         },
//       },
//     }
//   )
// }
// import { createServerClient } from '@supabase/ssr'
// import { Database } from '@/types/database'

// export async function createClient() {
//   return createServerClient<Database>(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.SUPABASE_SERVICE_ROLE_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return []
//         },
//         setAll() {},
//       },
//     }
//   )
// }
