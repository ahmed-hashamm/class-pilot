import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { 
            key: 'Permissions-Policy', 
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' 
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "img-src 'self' blob: data: *.googleusercontent.com *.supabase.co",
              "font-src 'self' data: fonts.gstatic.com",
              "connect-src 'self' *.supabase.co *.openai.com",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          }
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
