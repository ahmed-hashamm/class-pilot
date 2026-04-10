'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, type LoginInput } from '@/lib/validations/auth'
import { signInAction } from '@/actions/AuthActions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FeatureButton } from '@/components/ui/FeatureButton'
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>

        </div>
        <Input
          id="password"
          type="password"
          {...register('password')}
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
        <Link
          href="/forgot-password"
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          Forgot password?
        </Link>
      </div>

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
