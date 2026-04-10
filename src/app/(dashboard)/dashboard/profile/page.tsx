'use client'

import { useProfile } from '@/lib/db_data_fetching/profile'
import { Loader2, CheckCircle2, AlertCircle, Camera, ArrowLeft } from 'lucide-react'
import { 
  AvatarSection, 
  PersonalInfoSection, 
  SecuritySection 
} from '@/components/features/profile'

export default function SettingsPage() {
  const {
    loading, uploading, initialLoading, fullName, avatarUrl, file,
    status, displayAvatar, initials,
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
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-8">

      {/* Back + title */}
      <div>
        <button
          onClick={goBack}
          className="inline-flex items-center gap-1.5 text-muted-foreground
              hover:text-navy text-[13px] font-semibold mb-5 transition-colors
              cursor-pointer bg-transparent border-none">
          <ArrowLeft size={14} />
          Back to dashboard
        </button>

        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-navy flex items-center justify-center">
            <Camera size={17} className="text-yellow" />
          </div>
          <div>
            <h1 className="font-black text-[20px] tracking-tight text-navy">Profile Settings</h1>
            <p className="text-[13px] text-muted-foreground">
              Update your account information and security settings.
            </p>
          </div>
        </div>
      </div>

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
          loading={loading}
        />
      </div>

      {/* Global Status message */}
      {status && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px]
          font-semibold animate-in fade-in slide-in-from-top-1
          ${status.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm'
            : 'bg-red-50 text-red-600 border border-red-200 shadow-sm'
          }`}>
          {status.type === 'success'
            ? <CheckCircle2 size={15} />
            : <AlertCircle size={15} />
          }
          {status.message}
        </div>
      )}

      {/* Final footer actions */}
      <div className="pt-4 border-t border-border flex items-center justify-between">
        <p className="text-[12px] text-muted-foreground italic">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <button
          onClick={goBack}
          className="text-[13px] font-bold text-navy hover:underline cursor-pointer bg-transparent border-none">
          Done
        </button>
      </div>

    </div>
  )
}
