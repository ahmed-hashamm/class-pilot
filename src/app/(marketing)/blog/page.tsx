"use client";

import BlogsPageClock from "@/components/illustrations/BlogsPageClock";
import MarketingPagesLayout from "@/components/layout/MarketingPagesHero";
import { useReveal } from "@/hooks/useReveal";

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function BlogPage() {
    useReveal();

    return (
        <main className="bg-background text-foreground font-sans overflow-x-hidden mt-[1px]">

            {/* ── HERO HEADER (navy) ────────────────────────────────────────────── */}
            <MarketingPagesLayout
                pageIntro="The Class Pilot Blog"
                href="/login"
                buttonText="Try Class-Pilot Free"
                headingStart="Ideas, insights &"
                headingHighlight="updates"
                text="Teaching tips, AI in education, product news, and study strategies —
                    written by teachers and the Class Pilot team."
            />

            {/* ── COMING SOON ──────────────────────────────────────────────────── */}
            <section className="max-w-3xl mx-auto px-6 py-20 text-center">

                {/* Clock illustration */}
                <div className="cp-reveal">
                    <BlogsPageClock />
                </div>

                {/* Badge */}
                <div className="cp-reveal" style={{ transitionDelay: "0.1s" }}>
                    <span className="inline-flex items-center gap-2 bg-yellow text-navy text-[11px]
                        font-bold tracking-widest uppercase rounded-full px-4 py-1.5 mb-6">
                        <span className="size-1.5 rounded-full bg-navy inline-block" />
                        Coming Soon
                    </span>
                </div>

                {/* Heading */}
                <div className="cp-reveal" style={{ transitionDelay: "0.18s" }}>
                    <h2 className="font-black text-[clamp(26px,4vw,42px)] leading-tight tracking-tight
                        text-foreground mb-4">
                        The Class Pilot blog<br />is on its way
                    </h2>
                </div>

                {/* Body text */}
                <div className="cp-reveal" style={{ transitionDelay: "0.26s" }}>
                    <p className="text-[15px] text-muted-foreground leading-relaxed max-w-md mx-auto mb-10">
                        We're working on articles covering teaching strategies, AI in education,
                        product updates, and student study guides. Check back soon.
                    </p>
                </div>

                {/* Topic chips */}
                <div className="cp-reveal flex flex-wrap gap-2 mb-12 justify-center"
                    style={{ transitionDelay: "0.34s" }}>
                    {[
                        { label: "Teaching Tips",   icon: "✏️" },
                        { label: "AI in Education", icon: "✦"  },
                        { label: "Product Updates", icon: "🚀" },
                        { label: "Student Guides",  icon: "📖" },
                    ].map(({ label, icon }) => (
                        <span key={label}
                            className="inline-flex items-center gap-2 text-[12px] font-semibold
                                text-navy bg-navy/8 border border-navy/15 rounded-full px-4 py-2">
                            <span>{icon}</span>
                            {label}
                        </span>
                    ))}
                </div>

                {/* Divider + back link */}
                <div className="cp-reveal" style={{ transitionDelay: "0.42s" }}>
                    <div className="w-12 h-0.5 bg-border mx-auto mb-10" />
                    <a href="/"
                        className="inline-flex items-center gap-2 text-[13px] font-semibold text-navy
                            hover:gap-3 transition-all duration-200">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M12 7H2M7 2L2 7l5 5" stroke="currentColor" strokeWidth="1.6"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back to home
                    </a>
                </div>

            </section>

        </main>
    );
}