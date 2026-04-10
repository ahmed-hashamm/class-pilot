import Image from 'next/image'
import { Camera, Loader2 } from 'lucide-react'

interface AvatarSectionProps {
  displayAvatar: string | null
  fullName: string
  initials: string
  file: File | null
  uploading: boolean
  setFile: (file: File | null) => void
  clearFile: () => void
  handleAvatarUpload: () => Promise<void>
}

export function AvatarSection({
  displayAvatar,
  fullName,
  initials,
  file,
  uploading,
  setFile,
  clearFile,
  handleAvatarUpload,
}: AvatarSectionProps) {
  return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
      <p className="text-[11px] font-bold tracking-[.18em] uppercase text-navy mb-5 flex items-center gap-2">
        <Camera size={12} />
        Profile photo
      </p>

      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <div className="size-20 rounded-2xl overflow-hidden border-2 border-border
            bg-secondary flex items-center justify-center relative">
            {displayAvatar ? (
              <Image src={displayAvatar} alt={fullName} fill
                className="object-cover" />
            ) : (
              <span className="text-[26px] font-black text-navy">{initials}</span>
            )}
          </div>
          <label htmlFor="avatar-upload"
            className="absolute -bottom-1.5 -right-1.5 size-7 rounded-full
              bg-navy border-2 border-white flex items-center justify-center
              cursor-pointer hover:bg-navy/90 transition-colors">
            <Camera size={12} className="text-white" />
          </label>
        </div>

        <div className="flex-1">
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file ? (
            <div className="flex flex-col gap-2">
              <p className="text-[13px] font-semibold text-foreground truncate">
                {file.name}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleAvatarUpload}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 bg-navy text-white
                    font-semibold text-[13px] px-4 py-2 rounded-lg
                    hover:bg-navy/90 transition disabled:opacity-60
                    cursor-pointer border-none">
                  {uploading
                    ? <><Loader2 size={13} className="animate-spin" />Uploading...</>
                    : 'Save photo'}
                </button>
                <button
                  onClick={clearFile}
                  className="text-[13px] font-semibold text-muted-foreground
                    hover:text-foreground transition cursor-pointer
                    bg-transparent border-none">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="avatar-upload"
                className="inline-flex items-center gap-2 bg-secondary border border-border
                  text-foreground font-semibold text-[13px] px-4 py-2 rounded-lg
                  hover:border-navy/30 transition cursor-pointer">
                <Camera size={13} />
                Choose photo
              </label>
              <p className="text-[12px] text-muted-foreground mt-2">
                JPG, PNG or GIF · Max 5MB
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
