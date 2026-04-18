import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export async function middleware(request: NextRequest) {
  // 1. Rate Limiting for sensitive routes (Cloudflare/Vercel standard)
  const ip = request.headers.get("x-forwarded-for")?.split(',')[0] ?? "127.0.0.1";
  const path = request.nextUrl.pathname;
  
  if (path.startsWith('/login') || path.startsWith('/signup') || path.startsWith('/api')) {
    try {
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return new NextResponse("Too many requests", { status: 429 });
      }
    } catch (e) {
      // Fail open if Redis is down
    }
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from login page
  if (request.nextUrl.pathname.startsWith('/login') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

