'use client'

import { useProfile } from '@/lib/db_data_fetching/profile'
import { Loader2, Camera } from 'lucide-react'
import { PageHeader } from '@/components/ui'
import {
  AvatarSection,
  PersonalInfoSection,
  SecuritySection
} from '@/components/features/profile'
import { FeatureButton } from '@/components/ui/FeatureButton'

export default function SettingsPage() {
  const {
    loading, passwordLoading, uploading, initialLoading,
    fullName, avatarUrl, file,
    displayAvatar, initials,
    setFullName, setFile, clearFile,
    handleAvatarUpload, handleSaveProfile, handleUpdatePassword, goBack
  } = useProfile()

  if (initialLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="animate-spin text-navy" size={32} />
        <p className="text-sm font-medium text-muted-foreground">Loading your profile...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col">
      <PageHeader
        title="Profile Settings"
        description="Update your account information and security settings."
        icon={
          <div className="size-10 rounded-xl bg-navy flex items-center justify-center">
            <Camera size={17} className="text-yellow" />
          </div>
        }
        backHref="/dashboard"
        backLabel="Back to dashboard"
      />

      {/* Profile Sections Grid */}
      <div className="grid grid-cols-1 gap-6">
        <AvatarSection
          displayAvatar={displayAvatar}
          fullName={fullName}
          initials={initials}
          file={file}
          uploading={uploading}
          setFile={setFile}
          clearFile={clearFile}
          handleAvatarUpload={handleAvatarUpload}
        />

        <PersonalInfoSection
          fullName={fullName}
          setFullName={setFullName}
          handleSaveProfile={handleSaveProfile}
          loading={loading}
        />

        <SecuritySection
          handleUpdatePassword={handleUpdatePassword}
          passwordLoading={passwordLoading}
        />
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-border flex items-center justify-between">
        <p className="text-[12px] text-muted-foreground italic">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <FeatureButton
          variant="ghost"
          label="Done"
          onClick={goBack}
          className="text-[13px] text-navy px-0"
        />
      </div>

    </div>
  )
}
