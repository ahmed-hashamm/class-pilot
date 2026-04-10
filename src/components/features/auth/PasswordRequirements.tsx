'use client'

import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RequirementProps {
  label: string
  met: boolean
}

function Requirement({ label, met }: RequirementProps) {
  return (
    <div className="flex items-center gap-2 text-sm transition-colors duration-200">
      {met ? (
        <Check size={14} className="text-green-500" />
      ) : (
        <X size={14} className="text-gray-300" />
      )}
      <span className={cn(
        "transition-colors duration-200",
        met ? "text-green-700" : "text-gray-500"
      )}>
        {label}
      </span>
    </div>
  )
}

interface PasswordRequirementsProps {
  password: string
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
    { label: 'Special character', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password) },
  ]

  return (
    <div className="space-y-1.5 p-3 rounded-lg bg-gray-50 border border-gray-100 mt-2">
      <p className="text-xs font-semibold text-navy/70 uppercase tracking-wider mb-2">
        Password Requirements
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
        {requirements.map((req, index) => (
          <Requirement key={index} label={req.label} met={req.met} />
        ))}
      </div>
    </div>
  )
}
