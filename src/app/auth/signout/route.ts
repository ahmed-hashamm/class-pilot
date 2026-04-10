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
  
  return response
}
