'use client'

import { useState } from "react";
import { useReveal } from "@/lib/hooks/useReveal";
import { TEACHER_STEPS, STUDENT_STEPS } from "@/lib/db_data_fetching/marketingData";

type View = "teacher" | "student";

export function HowItWorksSteps() {
    const [view, setView] = useState<View>("teacher");
    useReveal(view);

    const steps = view === "teacher" ? TEACHER_STEPS : STUDENT_STEPS;

    return (
        <section className="py-20 bg-background">
            <div className="max-w-5xl mx-auto px-6">
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

                <div className="flex flex-col">
                    {steps.map((step, i) => (
                        <div key={`${view}-${i}`}
                            className="cp-reveal cp-visible"
                            style={{ transitionDelay: step.delay }}>
                            <div className="flex flex-col md:flex-row items-stretch min-h-[240px]">
                                <div className={`flex flex-col justify-center py-10 px-4 md:px-6 flex-1
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
                                            <span key={t} className="text-[10px] font-semibold tracking-wide uppercase
                                                text-navy bg-navy/8 border border-navy/15 rounded px-2.5 py-1">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="hidden md:flex flex-col items-center w-[60px] shrink-0" style={{ order: 2 }}>
                                    <div className="flex-1 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
                                    <div className="cp-pulse size-4 rounded-full bg-navy border-2 border-background shrink-0 z-10"
                                        style={{ animationDelay: `${i * 0.7}s` }} />
                                    <div className="flex-1 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
                                </div>

                                <div className="flex items-center justify-center p-4 md:p-6 flex-1" style={{ order: step.flip ? 1 : 3 }}>
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
    );
}
