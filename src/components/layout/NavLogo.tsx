'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

/**
 * NavLogo renders the Class Pilot branding with the logo and text.
 */
export function NavLogo() {
  return (
    <Link href="/" className="flex items-center group text-white decoration-0 no-underline">
      <div className="relative w-12 h-12">
        <Image
          src="/logo.png"
          alt="Class Pilot"
          fill
          className="object-contain"
          priority
        />
      </div>
      <p className="text-xl font-bold tracking-tight">
        Class <span className="text-navy-light ml-1">Pilot</span>
      </p>
    </Link>
  )
}
