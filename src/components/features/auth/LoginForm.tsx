'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, type LoginInput } from '@/lib/validations/auth'
import { signInAction } from '@/actions/AuthActions'
import { Input, PasswordInput, FeatureButton, FormSection } from '@/components/ui'
import { toast } from 'sonner'

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    try {
      const result = await signInAction(data)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Signed in successfully')
        router.push('/dashboard')
        router.refresh()
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
        label="Email"
        error={errors.email?.message}
      >
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          {...register('email')}
          error={!!errors.email}
        />
      </FormSection>

      <FormSection
        label="Password"
        error={errors.password?.message}
        labelAction={
          <Link
            href="/forgot-password"
            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            Forgot password?
          </Link>
        }
      >
        <PasswordInput
          id="password"
          {...register('password')}
          error={!!errors.password}
        />
      </FormSection>

      <FeatureButton
        type="submit"
        variant='primary'
        className="w-full text-base font-semibold"
        loading={loading}
        label="Sign In"
      />

      <div className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/signup" className="text-blue-600 font-medium hover:underline">
          Sign up
        </Link>
      </div>
    </form>
  )
}
