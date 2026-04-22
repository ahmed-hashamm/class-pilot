'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, FeatureButton, FormSection } from '@/components/ui'
import { updatePassword as updatePasswordAction } from '@/actions/AuthActions'
import { UpdatePasswordSchema, type UpdatePasswordInput } from '@/lib/validations/auth'
import { PasswordRequirements } from '@/components/features/auth/PasswordRequirements'
import { AuthLayout } from '@/components/features/auth/AuthLayout'
import { toast } from 'sonner'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    }
  })

  const passwordValue = watch('password', '')

  const onSubmit = async (data: UpdatePasswordInput) => {
    setLoading(true)
    try {
      const result = await updatePasswordAction(data)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Password updated successfully!')
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Set New Password"
      description="Create a strong, unique password to secure your account."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormSection
          label="New Password"
          error={errors.password?.message}
        >
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={!!errors.password}
            className="rounded-xl border-slate-200 focus:ring-navy/5 focus:border-navy"
          />
        </FormSection>

        <PasswordRequirements password={passwordValue} />

        <FormSection
          label="Confirm Password"
          error={errors.confirmPassword?.message}
        >
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            className="rounded-xl border-slate-200 focus:ring-navy/5 focus:border-navy"
          />
        </FormSection>

        <FeatureButton
          type="submit"
          variant="primary"
          className="w-full text-base font-semibold"
          loading={loading}
          label="Update Password"
        />
        
        <div className="text-center text-sm text-slate-600">
          <Link href="/login" className="text-navy font-bold hover:underline underline-offset-4">
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
