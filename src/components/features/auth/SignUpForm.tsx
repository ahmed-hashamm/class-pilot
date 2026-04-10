'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignUpSchema, type SignUpInput } from '@/lib/validations/auth'
import { signUpAction } from '@/actions/AuthActions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FeatureButton } from '@/components/ui/FeatureButton'
import { PasswordRequirements } from './PasswordRequirements'
import { toast } from 'sonner'

export function SignUpForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
  })

  const passwordValue = watch('password', '')

  const onSubmit = async (data: SignUpInput) => {
    setLoading(true)
    try {
      const result = await signUpAction(data)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Account created! Please check your email to confirm.')
        // In dev with auto-confirm, you might redirect to login or dashboard
        // For now, let's keep it simple as per the email verification flow
      }
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="John Doe"
          {...register('fullName')}
          className={errors.fullName ? 'border-red-500' : ''}
        />
        {errors.fullName && (
          <p className="text-xs text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
        <PasswordRequirements password={passwordValue} />
      </div>

      <FeatureButton
        type="submit"
        variant='primary'
        className="w-full text-base font-semibold"
        loading={loading}
        label="Create Account"
      />

      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 font-medium hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  )
}
