'use client'

import { Lock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdatePasswordSchema, type UpdatePasswordInput } from '@/lib/validations/auth'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Label } from '@/components/ui/label'
import { PasswordRequirements } from '@/components/features/auth/PasswordRequirements'
import { FeatureButton } from '@/components/ui/FeatureButton'

interface SecuritySectionProps {
  handleUpdatePassword: (password: string) => Promise<{ error: string | null }>
  passwordLoading: boolean
}

export function SecuritySection({
  handleUpdatePassword,
  passwordLoading,
}: SecuritySectionProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const passwordValue = watch('password', '')

  const onPasswordSubmit = async (data: UpdatePasswordInput) => {
    const result = await handleUpdatePassword(data.password)
    if (!result.error) {
      reset()
    }
  }

  return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
      <p className="text-[11px] font-bold tracking-[.18em] uppercase text-navy mb-5 flex items-center gap-2">
        <Lock size={12} />
        Security
      </p>

      <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sec-password">New password</Label>
            <PasswordInput
              id="sec-password"
              {...register('password')}
              placeholder="••••••••"
              error={!!errors.password}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/20 focus-visible:border-navy focus-visible:ring-offset-0 transition"
            />
            {errors.password && (
              <p className="text-[12px] text-red-500 font-medium">
                {errors.password.message}
              </p>
            )}
            <PasswordRequirements password={passwordValue} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sec-confirm-password">Confirm new password</Label>
            <PasswordInput
              id="sec-confirm-password"
              {...register('confirmPassword')}
              placeholder="••••••••"
              error={!!errors.confirmPassword}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/20 focus-visible:border-navy focus-visible:ring-offset-0 transition"
            />
            {errors.confirmPassword && (
              <p className="text-[12px] text-red-500 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-[12px] text-muted-foreground">
            Changing your password will update your login credentials immediately.
          </p>
          <FeatureButton
            type="submit"
            loading={passwordLoading || isSubmitting}
            label="Update Password"
            loadingLabel="Updating..."
            className="w-full md:w-auto"
          />
        </div>
      </form>
    </div>
  )
}
