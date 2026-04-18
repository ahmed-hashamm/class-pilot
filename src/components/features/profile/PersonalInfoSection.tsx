import { ShieldCheck } from 'lucide-react'
import { FeatureButton } from '@/components/ui/FeatureButton'

interface PersonalInfoSectionProps {
  fullName: string
  setFullName: (name: string) => void
  handleSaveProfile: () => Promise<void>
  loading: boolean
}

export function PersonalInfoSection({
  fullName,
  setFullName,
  handleSaveProfile,
  loading,
}: PersonalInfoSectionProps) {
  return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
      <p className="text-[11px] font-bold tracking-[.18em] uppercase text-navy mb-5 flex items-center gap-2">
        <ShieldCheck size={12} />
        Personal info
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="full-name"
            className="text-[13px] font-semibold text-foreground">
            Full name <span className="text-navy">*</span>
          </label>
          <input
            id="full-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full bg-white border border-border rounded-lg px-4 py-3
              text-[14px] text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy
              transition"
          />
        </div>
        <FeatureButton
          label="Update Personal Info"
          loadingLabel="Saving..."
          loading={loading}
          onClick={handleSaveProfile}
          className="w-full md:w-auto"
        />
      </div>
    </div>
  )
}
