'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center group mb-2">
            <div className="relative w-24 h-24 transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Class Pilot Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            {title}
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  )
}
