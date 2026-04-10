import { Suspense } from 'react'
import { AuthLayout } from '@/components/features/auth/AuthLayout'
import { SignUpForm } from '@/components/features/auth/SignUpForm'
import { SocialAuth } from '@/components/features/auth/SocialAuth'

export const metadata = {
  title: 'Create an account | Class Pilot',
  description: 'Join Class Pilot to manage your classroom with AI-powered tools.',
}

export default function SignUpPage() {
  return (
    <AuthLayout 
      title="Create an account" 
      description="Enter your information to get started"
    >
      <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
        <SignUpForm />
        <SocialAuth />
      </Suspense>
    </AuthLayout>
  )
}
