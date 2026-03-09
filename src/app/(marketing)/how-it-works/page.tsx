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
   SCROLL REVEAL HOOK  — accepts a dep so it re-runs when the view toggles
───────────────────────────────────────────────────────────────────────────── */
// function useReveal(dep?: unknown) {
//     useEffect(() => {
//         // Tiny delay lets React flush the new DOM nodes first
//         const id = setTimeout(() => {
//             const els = document.querySelectorAll<HTMLElement>(".cp-reveal:not(.cp-visible)");
//             const obs = new IntersectionObserver(
//                 (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("cp-visible"); }),
//                 { threshold: 0.08 }
//             );
//             els.forEach((el) => obs.observe(el));
//             return () => obs.disconnect();
//         }, 50);
//         return () => clearTimeout(id);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [dep]);
// }
//     {
//         num: "01", flip: false, delay: "0s",
//         title: "Create your class & invite students",
//         desc: "Set up a class in seconds — give it a name, subject, and grade level. Share your unique class code or invite link. Students join instantly. Your class stream, assignments, and materials are live from the moment you create it.",
//         tags: ["2-minute setup", "Shareable class code", "Unlimited students"],
//         diagram: <DiagramCreateClass />,
//     },
//     {
//         num: "02", flip: true, delay: "0.1s",
//         title: "Post assignments & attach materials",
//         desc: "Write instructions, attach slides, PDFs, videos, or links, and set a due date — all from one screen. Every student sees it the moment you post. Schedule posts ahead of time or go live in real-time during class.",
//         tags: ["Rich attachments", "Due date reminders", "Scheduled posting"],
//         diagram: <DiagramPostAssignment />,
//     },
//     {
//         num: "03", flip: false, delay: "0.2s",
//         title: "Grade manually — or let the AI do it",
//         desc: "Every submission lands in one queue. Mark by hand with inline comments, or trigger AI-assisted grading: the AI scores each submission against your rubric and drafts personalised feedback per student. You review, approve, and return.",
//         tags: ["AI grading", "Rubric-based scoring", "Inline comments"],
//         diagram: <DiagramGrading  />,
//     },
// ];

// const STUDENT_STEPS: Step[] = [
//     {
//         num: "01", flip: false, delay: "0s",
//         title: "Join your class with a code",
//         desc: "Enter your teacher's class code once and your entire class — assignments, materials, due dates, announcements — appears in your personal feed, organised by subject.",
//         tags: ["Instant access", "All classes in one place", "Mobile friendly"],
//         diagram: <DiagramCreateClass />,
//     },
//     {
//         num: "02", flip: true, delay: "0.1s",
//         title: "See your work & ask the Class AI",
//         desc: "Your feed shows every assignment the moment it's posted, with materials right beside it. Stuck on something? Open the Class AI — trained exclusively on your teacher's uploaded notes — and get instant, on-syllabus answers.",
//         tags: ["Live notifications", "Clear due dates", "Class AI tutor"],
//         diagram: <DiagramStudentFeed />,
//     },
//     {
//         num: "03", flip: false, delay: "0.2s",
//         title: "Submit your work & get feedback",
//         desc: "Type answers, upload a file, or attach your work directly in the app. Once submitted, your teacher's feedback — including AI-suggested comments — comes back in the same thread. No email chains. No lost notes.",
//         tags: ["Easy submission", "Inline feedback", "Grade tracking"],
//         diagram: <DiagramSubmit />,
//     },
// ];

// const DIFF_CARDS: DiffCard[] = [
//     {
//         badge: "AI",
//         title: "AI-Assisted Grading",
//         desc: "The AI reads each submission, scores it against your rubric, and writes personalised feedback for every student. You review and approve in a single pass — a class of 30 graded in minutes, not hours.",
//         icon: (
//             <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
//                 <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5" />
//                 <path d="M7.5 11l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                 <path d="M14 3.8A5.5 5.5 0 0118.2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".4" />
//             </svg>
//         ),
//     },
//     {
//         badge: "Collaboration",
//         title: "Group Projects",
//         desc: "Students collaborate in a shared live workspace — writing, editing, and commenting together in real time. Teachers see a single submission so that there is no repetition — saving them a lot of time.",
//         icon: (
//             <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
//                 <circle cx="8" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.5" />
//                 <circle cx="15" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.5" />
//                 <path d="M2.5 18c0-3 2.5-4.5 5.5-4.5h7c3 0 5.5 1.5 5.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
//             </svg>
//         ),
//     },
//     {
//         badge: "AI",
//         title: "Class-Specific AI Assistant",
//         desc: "Every class gets its own AI tutor built from the materials you upload — lecture notes, textbooks, past papers. Students get accurate, on-syllabus answers cited back to your actual source material.",
//         icon: (
//             <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
//                 <rect x="2.5" y="5.5" width="17" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
//                 <path d="M7 9.5h8M7 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
//                 <circle cx="17.5" cy="17.5" r="3.5" fill="white" stroke="currentColor" strokeWidth="1.5" />
//                 <path d="M16.2 17.5l1 1 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>
//         ),
//     },
// ];

// const STATS: Stat[] = [
//     { num: "3 sec", lbl: "avg. AI grading time per submission" },
//     { num: "80%", lbl: "reduction in teacher marking time" },
//     { num: "2×", lbl: "faster feedback turnaround" },
//     { num: "100%", lbl: "AI answers from your own class material" },
// ];

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function HowItWorks() {
    const [view, setView] = useState<View>("teacher");
    useReveal(view);   // re-observe whenever the tab switches

    const steps = view === "teacher" ? TEACHER_STEPS : STUDENT_STEPS;

    return (
        <>
            {/* <style>{`
        @keyframes cp-fadeUp   { from { opacity:0; transform:translateY(22px) } to { opacity:1; transform:translateY(0) } }
        @keyframes cp-float    { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-7px) } }
        @keyframes cp-pulse    { 0%,100% { box-shadow:0 0 0 0 rgba(4,56,115,.35) } 50% { box-shadow:0 0 0 10px rgba(4,56,115,0) } }

        .cp-reveal   { opacity:0; transform:translateY(22px); transition:opacity .6s ease, transform .6s ease; }
        .cp-visible  { opacity:1; transform:translateY(0); }
        .cp-float    { animation:cp-float 5s ease-in-out infinite; }
        .cp-pulse    { animation:cp-pulse 2.8s ease-in-out infinite; }
        .cp-hero-1   { animation:cp-fadeUp .6s ease .1s both; }
        .cp-hero-2   { animation:cp-fadeUp .6s ease .22s both; }
        .cp-hero-3   { animation:cp-fadeUp .6s ease .36s both; }
        .cp-hero-4   { animation:cp-fadeUp .6s ease .5s both; }
      `}</style> */}

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