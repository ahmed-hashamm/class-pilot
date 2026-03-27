"use client";

import { useReveal } from "@/lib/hooks/useReveal";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
interface Section {
  title: string;
  content: React.ReactNode;
}

interface LegalPageLayoutProps {
  badge: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED PROSE HELPERS — import in each page for consistent styling
───────────────────────────────────────────────────────────────────────────── */
export const P  = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[15px] text-muted-foreground leading-relaxed mb-4 last:mb-0">{children}</p>
);
export const UL = ({ children }: { children: React.ReactNode }) => (
  <ul className="flex flex-col gap-2 mb-4 last:mb-0">{children}</ul>
);
export const LI = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2.5 text-[15px] text-muted-foreground leading-relaxed">
    <span className="shrink-0 size-1.5 rounded-full bg-navy/40 mt-[9px]" />
    <span>{children}</span>
  </li>
);
export const A  = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="text-navy font-semibold hover:underline">{children}</a>
);
export const Strong = ({ children }: { children: React.ReactNode }) => (
  <strong className="font-semibold text-foreground">{children}</strong>
);

/* ─────────────────────────────────────────────────────────────────────────────
   LAYOUT
───────────────────────────────────────────────────────────────────────────── */
export default function LegalPageLayout({
  badge,
  title,
  subtitle,
  lastUpdated,
  sections,
}: LegalPageLayoutProps) {
  useReveal();

  return (
    <main className="bg-background text-foreground font-sans overflow-x-hidden">

      {/* ── HERO (navy) ───────────────────────────────────────────────────── */}
      <section className="bg-navy text-white px-6 py-12 text-center relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_50%_0%,_rgba(79,156,249,.15)_0%,_transparent_70%)]" />

        <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[.18em]
          uppercase bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-white/80">
          <span className="size-2 rounded-full bg-yellow inline-block" />
          {badge}
        </span>

        <h1 className="font-black text-[clamp(28px,3vw,52px)] leading-tight tracking-tight
          mb-4 max-w-2xl mx-auto">
          {title}
        </h1>

        <p className="text-white/60 text-[clamp(13px,1vw,16px)] font-light
          leading-relaxed max-w-lg mx-auto mb-4">
          {subtitle}
        </p>

        <p className="text-white/35 text-[12px]">Last updated: {lastUpdated}</p>
      </section>

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Table of contents */}
        <nav className="cp-reveal bg-secondary border border-border rounded-2xl p-6 mb-12">
          <p className="text-[11px] font-bold tracking-[.18em] uppercase text-navy mb-4">
            On this page
          </p>
          <ol className="flex flex-col gap-2">
            {sections.map((s, i) => (
              <li key={i}>
                <a href={`#section-${i}`}
                  className="flex items-center gap-2.5 text-[14px] text-muted-foreground
                    hover:text-navy font-medium transition-colors">
                  <span className="shrink-0 size-5 rounded-full bg-navy/8 border border-navy/15
                    flex items-center justify-center text-[10px] font-bold text-navy">
                    {i + 1}
                  </span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Sections */}
        <div className="flex flex-col gap-10">
          {sections.map((s, i) => (
            <div key={i} id={`section-${i}`} className="cp-reveal scroll-mt-8"
              style={{ transitionDelay: `${i * 0.04}s` }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="shrink-0 size-6 rounded-full bg-navy flex items-center
                  justify-center text-[11px] font-bold text-yellow">
                  {i + 1}
                </span>
                <h2 className="font-black text-[18px] tracking-tight">{s.title}</h2>
              </div>
              <div className="pl-9">{s.content}</div>
              {i < sections.length - 1 && (
                <div className="border-b border-border mt-10" />
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="cp-reveal mt-14 bg-navy rounded-2xl p-6 text-center">
          <p className="text-white/70 text-[14px] leading-relaxed mb-3">
            Questions about this policy? We're happy to help.
          </p>
          <a href="/contact"
            className="inline-flex items-center gap-2 bg-yellow text-navy font-semibold
              text-[13px] px-5 py-2.5 rounded-lg hover:bg-yellow/90 transition">
            Contact us
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

      </div>
    </main>
  );
}
