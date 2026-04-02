"use client"

import { useState } from "react"

interface MethodButtonProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  variant: "navy-light" | "yellow"
  onClick: () => void
}

export function MethodButton({ icon, title, subtitle, variant, onClick }: MethodButtonProps) {
  const [hovered, setHovered] = useState(false)
  const isNavyLight = variant === "navy-light"

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2
        text-left transition-all cursor-pointer bg-white
        ${hovered
          ? isNavyLight ? "border-navy-light/30 bg-navy-light/8" : "border-yellow/40 bg-yellow/8"
          : "border-border"
        }`}>

      <div className={`size-11 rounded-xl flex items-center justify-center
        shrink-0 transition-colors
        ${hovered
          ? isNavyLight ? "bg-navy-light text-white" : "bg-navy text-yellow"
          : isNavyLight ? "bg-navy-light/12 text-navy-light" : "bg-yellow/15 text-navy"
        }`}>
        {icon}
      </div>

      <div>
        <p className="font-black text-[13px] uppercase text-foreground">{title}</p>
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mt-0.5">
          {subtitle}
        </p>
      </div>
    </button>
  )
}
