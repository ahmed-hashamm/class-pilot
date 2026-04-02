"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface StudentAvatarProps {
  name: string
  src?: string | null
  initial?: string
  size?: string
  className?: string
  role?: "teacher" | "student"
}

export function StudentAvatar({ 
  name, 
  src, 
  initial, 
  size = "size-10", 
  className,
  role = "student"
}: StudentAvatarProps) {
  const [imgError, setImgError] = useState(false)
  const displayInitial = initial || name?.charAt(0).toUpperCase() || "?"

  return (
    <div className={cn(
      "shrink-0 rounded-xl overflow-hidden border flex items-center justify-center font-black relative transition-all",
      size,
      role === "teacher" 
        ? "bg-navy text-yellow border-navy/20" 
        : "bg-secondary text-navy border-border",
      className
    )}>
      {src && !imgError ? (
        <Image 
          src={src} 
          alt={name} 
          className="object-cover" 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgError(true)} 
        />
      ) : (
        <span className="text-[inherit]">{displayInitial}</span>
      )}
    </div>
  )
}
