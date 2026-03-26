"use client";

import WavePattern from "./WavePattern";

interface MarketingHeroProps {
    /** Small eyebrow label inside the pill — e.g. "The Class Pilot Blog" */
    pageIntro: string;
    /** Plain text before the highlighted word — can be empty string */
    headingStart?: string;
    /** The yellow-highlighted portion of the heading */
    headingHighlight: string;
    /** Plain text after the highlighted word — can be empty string */
    headingEnd?: string;
    /** Subtitle paragraph below the heading */
    text: string;
    /**Href of the hero link  */
    href: string;
    /**Button Text */
    buttonText: string;
}

export default function MarketingPagesLayout({
    pageIntro,
    headingStart,
    headingHighlight,
    headingEnd,
    text,
    href,
    buttonText
}: MarketingHeroProps) {
    return (
        <section className="bg-navy text-white px-6 py-12 text-center relative overflow-hidden">
            <WavePattern />
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 55% 40% at 50% 0%, rgba(79,156,249,.15) 0%, transparent 70%)",
                }}
            />

            <span
                className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[.18em]
          uppercase bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-white/80"
            >
                <span className="size-2 rounded-full bg-yellow inline-block animate-pulse" />
                {pageIntro}
            </span>

            <h1
                className="font-black text-[clamp(32px,3vw,60px)] leading-tight tracking-tight mb-4 max-w-2xl mx-auto"
            >
                {headingStart}{headingStart ? " " : ""}
                <span className="text-yellow">{headingHighlight}</span>
                {headingEnd ? " " : ""}{headingEnd}
            </h1>

            <p
                className="text-white/60 text-[clamp(14px,1vw,17px)] font-light
          leading-relaxed max-w-lg mx-auto"
            >
                {text}
            </p>
            <div className="cp-hero-4 mt-4">
                <a href={href}
                    className="inline-flex items-center gap-2 bg-yellow text-navy font-semibold
                text-sm px-7 py-3 rounded-lg transition hover:bg-yellow-hover hover:-translate-y-0.5">
                    {buttonText}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </a>
                {/* <a href="/demo"
                            className="inline-flex items-center gap-2 text-white font-normal text-sm
                px-5 py-3 border border-white/25 rounded-lg transition hover:border-yellow/60 hover:text-yellow">
                            Watch 2-min demo
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.1" />
                                <path d="M5.5 4.5l4 2-4 2v-4z" fill="currentColor" />
                            </svg>
                        </a> */}
            </div>
        </section>
    );
}
