'use client'

import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PasswordRequirementsProps {
  password?: string
}

export function PasswordRequirements({ password = '' }: PasswordRequirementsProps) {
  const requirements = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
    { label: 'One special character', test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
  ]

  return (
    <div className="space-y-1 px-2 py-1.5 bg-gray-50/50 rounded-lg border border-gray-100">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
        Requirements
      </p>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
        {requirements.map((req, index) => {
          const isMet = req.test(password)
          return (
            <div key={index} className="flex items-center gap-1.5">
              <div className={cn(
                "w-3 h-3 rounded-full flex items-center justify-center transition-colors",
                isMet ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"
              )}>
                {isMet ? <Check size={8} strokeWidth={4} /> : <X size={8} strokeWidth={4} />}
              </div>
              <span className={cn(
                "text-[10px] transition-colors leading-tight",
                isMet ? "text-green-700 font-bold" : "text-gray-400 font-medium"
              )}>
                {req.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
