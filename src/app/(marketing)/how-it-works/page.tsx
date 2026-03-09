"use client";

import { useState, useEffect, ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";
/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
import MarketingPagesLayout from "@/components/layout/MarketingPagesHero";
import { TEACHER_STEPS, STUDENT_STEPS, STATS, DIFF_CARDS } from "@/data/data";
import { DiagramAIChat, DiagramCreateClass, DiagramGrading, DiagramGroupCollab, DiagramPostAssignment, DiagramStudentFeed, DiagramSubmit } from "@/components/illustrations/HowItWorksPageDiagrams";
type View = "teacher" | "student";
/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function HowItWorks() {
    const [view, setView] = useState<View>("teacher");
    useReveal(view);   // re-observe whenever the tab switches

    const steps = view === "teacher" ? TEACHER_STEPS : STUDENT_STEPS;

    return (
        <>

            <main className="bg-background text-foreground font-sans mt-[1px] ">

                {/* ── HERO  (navy bg) ─────────────────────────────────────────────── */}
                <MarketingPagesLayout
                    pageIntro="How It Works"
                    href="/login"
                    buttonText="Get started free"
                    headingStart="Your classroom,"
                    headingHighlight="smarter"
                    text="Teaching tips, AI in education, product news, and study strategies —
                    written by teachers and the Class Pilot team."
                />

                {/* ── STEP-BY-STEP (white bg) ──────────────────────────────────────── */}
                <section className="py-20 bg-background">
                    <div className="max-w-5xl mx-auto px-6">

                        {/* section header + toggle */}
                        <div className="text-center mb-14 cp-reveal">
                            <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-navy mb-2">
                                Step by step
                            </p>
                            <h2 className="font-black text-[clamp(26px,4vw,44px)] leading-tight tracking-tight mb-8">
                                See it from your side
                            </h2>

                            <div className="inline-flex bg-muted border border-border rounded-xl p-1 gap-1">
                                {(["teacher", "student"] as View[]).map((v) => (
                                    <button key={v} onClick={() => setView(v)}
                                        className={`flex items-center gap-2 text-[13px] font-semibold px-5 py-2.5
                      rounded-lg border-none cursor-pointer transition-all duration-200
                      ${view === v
                                                ? "bg-navy text-white shadow-sm"
                                                : "text-muted-foreground hover:text-foreground bg-transparent"}`}>
                                        {v === "teacher" ? (
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <rect x="1" y="1" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.3" />
                                                <path d="M3.5 7.5h7M3.5 5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                                            </svg>
                                        ) : (
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
                                                <path d="M1.5 12.5c0-2.8 2.5-4.5 5.5-4.5s5.5 1.7 5.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                                            </svg>
                                        )}
                                        {v === "teacher" ? "I'm a Teacher" : "I'm a Student"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* steps */}
                        <div className="flex flex-col">
                            {steps.map((step, i) => (
                                <div key={`${view}-${i}`}
                                    className="cp-reveal cp-visible"
                                    style={{ transitionDelay: step.delay }}>

                                    {/* On md+ screens, use flex row (or row-reverse for flip) */}
                                    <div
                                        className="flex flex-col md:flex-row items-stretch min-h-[240px]"
                                        style={{ flexDirection: undefined }}
                                    >
                                        {/* On desktop, swap order via CSS order property */}
                                        {/* Content */}
                                        <div
                                            className={`flex flex-col justify-center py-10 px-4 md:px-6 flex-1
                        ${step.flip ? "md:text-right md:items-end" : ""}`}
                                            style={{ order: step.flip ? 3 : 1 }}>
                                            <span className="font-black text-[64px] leading-none text-navy/8 -mb-2 select-none">
                                                {step.num}
                                            </span>
                                            <h3 className="font-bold text-[22px] leading-snug tracking-tight mb-3 mt-1">
                                                {step.title}
                                            </h3>
                                            <p className="text-[14px] font-normal text-muted-foreground leading-relaxed max-w-sm">
                                                {step.desc}
                                            </p>
                                            <div className={`flex flex-wrap gap-1.5 mt-4 ${step.flip ? "md:justify-end" : ""}`}>
                                                {step.tags.map((t) => (
                                                    <span key={t}
                                                        className="text-[10px] font-semibold tracking-wide uppercase
                              text-navy bg-navy/8 border border-navy/15 rounded px-2.5 py-1">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Spine — hidden on mobile */}
                                        <div
                                            className="hidden md:flex flex-col items-center w-[60px] shrink-0"
                                            style={{ order: 2 }}>
                                            <div className="flex-1 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
                                            <div className="cp-pulse size-4 rounded-full bg-navy border-2 border-background
                        shrink-0 z-10" style={{ animationDelay: `${i * 0.7}s` }} />
                                            <div className="flex-1 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
                                        </div>

                                        {/* Visual */}
                                        <div
                                            className="flex items-center justify-center p-4 md:p-6 flex-1"
                                            style={{ order: step.flip ? 1 : 3 }}>
                                            <div className="cp-float w-full max-w-[280px] bg-white border border-border
                        rounded-xl shadow-sm overflow-hidden p-3"
                                                style={{ animationDelay: `${i * 0.4}s` }}>
                                                {step.diagram}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── QUOTE (navy bg) ──────────────────────────────────────────────── */}
                <div className="bg-navy py-16 px-6 text-center cp-reveal">
                    <p className="font-bold italic text-[clamp(18px,3vw,30px)] leading-snug
            max-w-2xl mx-auto mb-4 text-white/90">
                        "I used to spend hours everyday marking. Now it takes a fraction of the time
                        and the feedback is more specific."
                    </p>
                    <p className="text-sm text-white/50">
                        <span className="text-yellow font-semibold">Mam Amna</span>
                        {" "}· Ai & Ml Professor
                    </p>
                </div>

                {/* ── 3 DIFFERENTIATING FEATURES (light bg) ───────────────────────── */}
                <section className="py-20 bg-secondary">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="cp-reveal mb-12">
                            <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-navy mb-2">
                                What makes us different
                            </p>
                            <h2 className="font-black text-[clamp(26px,4vw,44px)] leading-tight tracking-tight">
                                Built-in intelligence,<br />at every step
                            </h2>
                        </div>

                        <div className="cp-reveal grid grid-cols-1 md:grid-cols-3 gap-px
              bg-border border border-border rounded-2xl overflow-hidden">
                            {DIFF_CARDS.map((d, i) => (
                                <div key={i}
                                    className="relative bg-background hover:bg-navy/[.025]
                    transition-colors duration-200 p-8 group">
                                    {/* top accent stripe */}
                                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-navy
                    scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl" />

                                    {/* badge */}
                                    <span className="inline-block text-[10px] font-bold tracking-widest uppercase
                    text-navy bg-yellow rounded-full px-3 py-0.5 mb-5">
                                        {d.badge}
                                    </span>

                                    {/* icon */}
                                    <div className="size-11 rounded-xl bg-navy/8 border border-navy/12
                    flex items-center justify-center text-navy mb-5">
                                        {d.icon}
                                    </div>

                                    <h3 className="font-bold text-[20px] leading-snug tracking-tight mb-3">{d.title}</h3>
                                    <p className="text-[14px] text-muted-foreground leading-relaxed">{d.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── AI ASSISTANT SPOTLIGHT (white bg) ───────────────────────────── */}
                <section className="py-20 bg-background">
                    <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="cp-reveal">
                            <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-navy mb-2">
                                Spotlight
                            </p>
                            <h2 className="font-black text-[clamp(24px,3.5vw,40px)] leading-tight tracking-tight mb-4">
                                An AI tutor that only knows{" "}
                                <span className="relative inline-block">
                                    your class
                                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-yellow rounded-full" />
                                </span>
                            </h2>
                            <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">
                                The Class AI Assistant is built from the materials you upload — lecture notes,
                                textbook chapters, past papers, revision guides. Students get accurate,
                                on-syllabus answers, every time.
                            </p>
                            <p className="text-[15px] text-muted-foreground leading-relaxed">
                                Every answer is cited back to the source so students can verify it themselves.
                                You stay in complete control of what the AI knows.
                            </p>
                        </div>
                        <div className="cp-reveal cp-float" style={{ transitionDelay: "0.15s" }}>
                            <div className="bg-white border border-border rounded-2xl shadow-sm p-5 overflow-hidden">
                                <DiagramAIChat />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── GROUP COLLAB SPOTLIGHT (secondary bg) ───────────────────────── */}
                <section className="py-20 bg-secondary">
                    <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="cp-reveal cp-float order-2 md:order-1">
                            <div className="bg-white border border-border rounded-2xl shadow-sm p-5 overflow-hidden">
                                <DiagramGroupCollab />
                            </div>
                        </div>
                        <div className="cp-reveal order-1 md:order-2" style={{ transitionDelay: "0.15s" }}>
                            <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-navy mb-2">
                                Spotlight
                            </p>
                            <h2 className="text-primary text-[clamp(24px,3.5vw,40px)] leading-tight tracking-tight mb-4">
                                Group work,<br />fully visible
                            </h2>
                            <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">
                                Students collaborate in a shared workspace — writing, editing, and commenting
                                in real time. No switching to external tools, no version confusion.
                            </p>
                            <p className="text-[15px] text-muted-foreground leading-relaxed">
                                Teachers see a single submission so that there is no repetition — saving them a lot of time.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── STATS (navy bg) ──────────────────────────────────────────────── */}
                <section className="bg-navy py-20">
                    <div className="max-w-5xl mx-auto px-6 text-center">
                        <div className="cp-reveal mb-12">
                            <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-yellow mb-2">
                                The impact
                            </p>
                            <h2 className="font-black text-[clamp(26px,4vw,44px)] leading-tight tracking-tight text-white">
                                Numbers that matter
                            </h2>
                        </div>
                        <div className="cp-reveal grid grid-cols-2 md:grid-cols-4 gap-8">
                            {STATS.map((s, i) => (
                                <div key={i}>
                                    <p className="font-black text-[44px] leading-none text-yellow mb-2">{s.num}</p>
                                    <div className="w-7 h-0.5 bg-yellow/50 mx-auto mb-2" />
                                    <p className="text-[13px] text-white/55 font-light">{s.lbl}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA (yellow bg) ──────────────────────────────────────────────── */}
                <section className="bg-secondary py-20 px-6 text-center  cp-reveal">
                    <p className="text-[11px] font-bold tracking-[.2em] uppercase text-navy/60 mb-2">
                        Ready to start?
                    </p>
                    <h2 className="font-black text-[clamp(28px,4.5vw,52px)] leading-tight tracking-tight
            text-primary mb-4">
                        Your class is live in{" "}
                        <span className="italic">under two minutes.</span>
                    </h2>
                    <p className="text-[15px] text-muted-foreground leading-relaxed max-w-md mx-auto mb-9">
                        Create your class, invite your students, and post your first assignment today.
                        Free to try, no credit card needed.
                    </p>
                    <div className="flex gap-3 justify-center flex-wrap">
                        <a href="/login"
                            className="inline-flex items-center gap-2 bg-navy-light text-white font-semibold
                text-sm px-7 py-3 rounded-lg transition hover:bg-navy-light/90 hover:-translate-y-0.5">
                            Create your free class
                        </a>
                        {/* <a href="/demo"
                            className="inline-flex items-center gap-2 text-navy font-semibold text-sm
                px-5 py-3 border-2 border-navy/30 rounded-lg transition hover:border-navy">
                            Watch the demo
                        </a> */}
                    </div>
                </section>

            </main>
        </>
    );
}