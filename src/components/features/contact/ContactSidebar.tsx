export function ContactSidebar() {
  return (
    <div className="flex flex-col gap-4">
      {/* Direct email */}
      <div className="cp-reveal bg-white border border-border rounded-2xl p-6"
        style={{ transitionDelay: "0.1s" }}>
        <div className="size-10 rounded-xl bg-navy/8 text-navy flex items-center
          justify-center mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="4" width="16" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <p className="font-bold text-[14px] mb-1">Email us directly</p>
        <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">
          Prefer to write your own email? We're at:
        </p>
        <a href="mailto:classpilot.edu@gmail.com"
          className="text-[13px] font-semibold text-navy hover:underline">
          classpilot.edu@gmail.com
        </a>
      </div>

      {/* Response time */}
      <div className="cp-reveal bg-yellow/20 border border-yellow/60 rounded-2xl p-6"
        style={{ transitionDelay: "0.18s" }}>
        <div className="size-10 rounded-xl bg-yellow text-navy flex items-center
          justify-center mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <p className="font-bold text-[14px] mb-1">Response time</p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          We typically reply within <span className="font-semibold text-foreground">a few hours</span> on
          weekdays. Weekend messages are answered on Monday morning.
        </p>
      </div>

      {/* Help center nudge */}
      <div className="cp-reveal bg-secondary border border-border rounded-2xl p-6"
        style={{ transitionDelay: "0.26s" }}>
        <p className="font-bold text-[14px] mb-1">Looking for quick answers?</p>
        <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">
          Our Help Center covers the most common questions with step-by-step answers.
        </p>
        <a href="/help"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy
            hover:gap-2.5 transition-all duration-200">
          Browse Help Center
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}
