'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FeatureButton, FormSection } from '@/components/ui'
import { updatePassword as updatePasswordAction } from '@/actions/AuthActions'
import { UpdatePasswordSchema, type UpdatePasswordInput } from '@/lib/validations/auth'
import { PasswordRequirements } from '@/components/features/auth/PasswordRequirements'
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1">
          <Link href="/" className="flex items-center justify-center group mb-1">
            <div className="relative w-16 h-16 transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Class Pilot"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">Set New Password</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Please enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              />
            </FormSection>

            <FeatureButton
              type="submit"
              variant="primary"
              className="w-full text-base font-semibold mt-2"
              loading={loading}
              label="Update Password"
            />
            
            <div className="text-center">
              <Link href="/login" className="text-sm text-blue-600 hover:underline">
                Back to Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
