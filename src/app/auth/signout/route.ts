import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  
  // Sign out from Supabase (clears server-side session)
  await supabase.auth.signOut()
  
  const origin = new URL(request.url).origin
  
  // Redirect to login page and ensure cookies are cleared by adding a cache-busting param
  const response = NextResponse.redirect(`${origin}/login?signed_out=true`, {
    status: 302,
  })
  
  // Explicitly clear cache and ensure the browser knows the session is gone
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  
  return response
}
