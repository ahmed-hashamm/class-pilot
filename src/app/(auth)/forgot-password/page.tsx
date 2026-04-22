'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FeatureButton } from '@/components/ui'
import { requestPasswordReset } from '@/actions/AuthActions'
import { AuthLayout } from '@/components/features/auth/AuthLayout'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const result = await requestPasswordReset({ email })

    if (result.error) {
      setError(result.error)
    } else {
      setMessage(result.data)
      setEmail('')
    }
    setLoading(false)
  }

  return (
    <AuthLayout
      title="Forgot Password?"
      description="Enter your email address to receive a secure password reset link."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-navy/40 ml-1">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl border-slate-200 focus:ring-navy/5 focus:border-navy"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl bg-green-50 border border-green-100 p-3 text-sm text-green-600 font-medium">
            {message}
          </div>
        )}

        <FeatureButton
          type="submit"
          variant="primary"
          className="w-full text-base font-semibold"
          loading={loading}
          label="Send Reset Link"
        />

        <div className="text-center text-sm text-slate-600">
          Remembered your password?{' '}
          <Link href="/login" className="text-navy font-bold hover:underline underline-offset-4">
            Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
