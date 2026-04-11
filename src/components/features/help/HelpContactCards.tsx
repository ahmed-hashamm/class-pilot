export function HelpContactCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Email */}
      <div className="flex items-start gap-4 bg-white border border-border
        rounded-2xl p-6 hover:shadow-sm transition-shadow">
        <div className="shrink-0 size-11 rounded-xl bg-navy/8 border border-navy/12
          flex items-center justify-center text-navy">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="4" width="16" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-[15px] mb-1">Email support</p>
          <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">
            Can't find your answer? We usually reply within a few hours.
          </p>
          <a href="mailto:support@theclasspilot.com"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy
              hover:gap-2.5 transition-all duration-200">
            support@theclasspilot.com
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* Feedback */}
      <div className="flex items-start gap-4 bg-yellow/20 border border-yellow/60
        rounded-2xl p-6 hover:shadow-sm transition-shadow">
        <div className="shrink-0 size-11 rounded-xl bg-yellow border border-yellow/80
          flex items-center justify-center text-navy">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 4h16v10a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 8h8M6 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-[15px] mb-1">Send us feedback</p>
          <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">
            Found a bug or have a feature idea? We read every message.
          </p>
          <a href="/contact"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy
              hover:gap-2.5 transition-all duration-200">
            Share feedback
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
