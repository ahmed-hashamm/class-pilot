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
    <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Password Requirements
      </p>
      <div className="grid grid-cols-1 gap-1.5">
        {requirements.map((req, index) => {
          const isMet = req.test(password)
          return (
            <div key={index} className="flex items-center gap-2">
              <div className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center transition-colors",
                isMet ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"
              )}>
                {isMet ? <Check size={10} strokeWidth={3} /> : <X size={10} strokeWidth={3} />}
              </div>
              <span className={cn(
                "text-xs transition-colors",
                isMet ? "text-green-700 font-medium" : "text-gray-500"
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
