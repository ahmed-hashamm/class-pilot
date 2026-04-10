import { ShieldCheck, Loader2 } from 'lucide-react'

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
        <button
          onClick={handleSaveProfile}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2
            bg-navy text-white font-semibold text-[13px] px-6 py-2.5 rounded-lg
            hover:bg-navy/90 transition-all disabled:opacity-60 cursor-pointer border-none">
          {loading ? <Loader2 size={14} className="animate-spin" /> : 'Update Personal Info'}
        </button>
      </div>
    </div>
  )
}
