'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignUpSchema, type SignUpInput } from '@/lib/validations/auth'
import { signUpAction } from '@/actions/AuthActions'
import { Input, PasswordInput, FeatureButton, FormSection } from '@/components/ui'
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
      }
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSection
        label="Full Name"
        error={errors.fullName?.message}
      >
        <Input
          id="fullName"
          type="text"
          placeholder="John Doe"
          {...register('fullName')}
          className={errors.fullName ? 'border-red-500' : ''}
        />
      </FormSection>

      <FormSection
        label="Email"
        error={errors.email?.message}
      >
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
      </FormSection>

      <FormSection
        label="Password"
        error={errors.password?.message}
      >
        <PasswordInput
          id="password"
          {...register('password')}
          error={!!errors.password}
        />
      </FormSection>

      <PasswordRequirements password={passwordValue} />

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
