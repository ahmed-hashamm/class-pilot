"use client";

import MarketingPagesLayout from "@/components/layout/MarketingPagesHero";
import { FREE_FEATURES, FAQS, FUTURE_FEATURES } from "@/lib/data/pricingData";
import { useReveal } from "@/lib/hooks/useReveal";

import { useState, useEffect } from "react";


function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left
          cursor-pointer bg-transparent border-none group"
      >
        <span className="font-semibold text-[15px] text-foreground group-hover:text-navy transition-colors">
          {q}
        </span>
        <span className={`shrink-0 size-7 rounded-full border border-border flex items-center justify-center
          transition-all duration-200 ${open ? "bg-navy border-navy" : "bg-transparent"}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
            className={`transition-transform duration-200 ${open ? "rotate-45" : ""}`}>
            <path d="M6 1v10M1 6h10" stroke={open ? "white" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {open && (
        <p className="text-[14px] text-muted-foreground leading-relaxed pb-5 max-w-2xl">
          {a}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function PricingPage() {
  useReveal();

  return (
    <main className="bg-background text-foreground font-sans overflow-x-hidden">


      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <MarketingPagesLayout
        href="/login"
        buttonText="Try Class Pilot Free"
        pageIntro="Pricing"
        headingStart="Completely free."
        headingHighlight="No catch."
        headingEnd=""
        text="Every feature — AI grading, group projects, class AI assistant — is free for every teacher and student. No credit card, no trial period, no limits."
      />

      {/* ── FREE PLAN CARD ────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="cp-reveal relative bg-white border-2 border-navy rounded-2xl overflow-hidden">

          {/* Top stripe */}
          <div className="bg-navy px-8 py-5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="inline-flex items-center gap-2 bg-yellow text-navy text-[10px]
                font-bold tracking-widest uppercase rounded-full px-3 py-1 mb-2">
                Current plan
              </span>
              <h2 className="font-black text-white text-[28px] leading-none tracking-tight">Free</h2>
            </div>
            <div className="text-right">
              <p className="text-[48px] font-black text-white leading-none">$0</p>
              <p className="text-white/50 text-[13px]">forever, for everyone</p>
            </div>
          </div>

          {/* Features grid */}
          <div className="p-8">
            <p className="text-[11px] font-bold tracking-[.18em] uppercase text-muted-foreground mb-6">
              Everything included
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {FREE_FEATURES.map((f, i) => (
                <div key={i} className="cp-reveal flex items-start gap-3"
                  style={{ transitionDelay: `${i * 0.07}s` }}>
                  <div className="shrink-0 size-9 rounded-xl bg-navy/8 border border-navy/12
                    flex items-center justify-center text-navy mt-0.5">
                    {f.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-[14px] text-foreground mb-0.5">{f.title}</p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row
              items-center justify-between gap-4">
              <p className="text-[14px] text-muted-foreground">
                No credit card required. Start in under two minutes.
              </p>
              <a href="/login"
                className="shrink-0 inline-flex items-center gap-2 bg-navy text-white
                  font-semibold text-sm px-7 py-3 rounded-lg transition
                  hover:bg-navy/90 hover:-translate-y-0.5">
                Get started free
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FUTURE PLANS TEASER ───────────────────────────────────────────── */}
      <section className="bg-secondary border-y border-border py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            <div className="cp-reveal">
              <span className="inline-flex items-center gap-2 bg-yellow text-navy text-[10px]
                font-bold tracking-widest uppercase rounded-full px-3 py-1 mb-4">
                On the roadmap
              </span>
              <h2 className="font-black text-[clamp(24px,3.5vw,38px)] leading-tight
                tracking-tight mb-4">
                Paid plans are coming —<br />
                <span className="text-navy">for schools that need more</span>
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                We're building institutional features for schools and districts that need
                advanced reporting, admin controls, and integrations. Core features will
                always stay free.
              </p>
            </div>

            <div className="cp-reveal bg-white border border-border rounded-2xl p-6"
              style={{ transitionDelay: "0.15s" }}>
              <p className="text-[11px] font-bold tracking-[.18em] uppercase
                text-muted-foreground mb-4">
                Features we're working on
              </p>
              <ul className="flex flex-col gap-3">
                {FUTURE_FEATURES.map((f, i) => (
                  <li key={i} className="cp-reveal flex items-center gap-3 text-[14px] text-muted-foreground"
                    style={{ transitionDelay: `${i * 0.06}s` }}>
                    <span className="shrink-0 size-5 rounded-full border-2 border-dashed
                      border-border flex items-center justify-center">
                      <span className="size-1.5 rounded-full bg-muted-foreground/30" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="cp-reveal text-center mb-10">
          <p className="text-[11px] font-bold tracking-[.18em] uppercase text-navy mb-2">FAQ</p>
          <h2 className="font-black text-[clamp(24px,3.5vw,38px)] leading-tight tracking-tight">
            Common questions
          </h2>
        </div>
        <div className="cp-reveal bg-white border border-border rounded-2xl px-8">
          {FAQS.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="bg-yellow py-16 px-6 text-center">
        <div className="cp-reveal">
          <h2 className="font-black text-[clamp(24px,4vw,44px)] leading-tight tracking-tight
            text-navy mb-3">
            Free today. Free tomorrow.
          </h2>
          <p className="text-navy/65 text-[15px] leading-relaxed max-w-sm mx-auto mb-8">
            Start using Class Pilot now — no payment details, no expiry date.
          </p>
          <a href="/signup"
            className="inline-flex items-center gap-2 bg-navy text-white font-semibold
              text-sm px-7 py-3 rounded-lg transition hover:bg-navy/90 hover:-translate-y-0.5">
            Create your free class
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>

    </main>
  );
}
