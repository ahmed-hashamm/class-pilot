"use client";

import { useState, useEffect, ReactNode } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
import WavePattern from "@/components/layout/WavePattern";
type View = "teacher" | "student";

interface Step {
    num: string;
    title: string;
    desc: string;
    tags: string[];
    diagram: ReactNode;
    flip: boolean;
    delay: string;
}

interface DiffCard {
    badge: string;
    title: string;
    desc: string;
    icon: ReactNode;
}

interface Stat {
    num: string;
    lbl: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   THEME CONSTANTS
   Resolved from globals.css so SVGs always match exactly
───────────────────────────────────────────────────────────────────────────── */
const NAVY = "#043873";           // hsl(212 93% 23%)
const NAVY_LIGHT = "#4F9CF9";           // hsl(215 94% 65%)
const YELLOW = "#FFE492";           // hsl(48 100% 78%)
const WHITE = "#ffffff";
const NEAR_BLACK = "#171717";           // hsl(0 0% 9%)
const BORDER_CLR = "#E5E5E5";           // hsl(0 0% 89.8%)
const MUTED_TEXT = "#737373";           // hsl(0 0% 45.1%)
const MUTED_BG = "#F5F5F5";           // hsl(0 0% 96.1%)

/* ─────────────────────────────────────────────────────────────────────────────
   SCROLL REVEAL HOOK  — accepts a dep so it re-runs when the view toggles
───────────────────────────────────────────────────────────────────────────── */
function useReveal(dep?: unknown) {
    useEffect(() => {
        // Tiny delay lets React flush the new DOM nodes first
        const id = setTimeout(() => {
            const els = document.querySelectorAll<HTMLElement>(".cp-reveal:not(.cp-visible)");
            const obs = new IntersectionObserver(
                (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("cp-visible"); }),
                { threshold: 0.08 }
            );
            els.forEach((el) => obs.observe(el));
            return () => obs.disconnect();
        }, 50);
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dep]);
}

/* ─────────────────────────────────────────────────────────────────────────────
   SVG DIAGRAMS  (use resolved hex values — no CSS vars in SVG attributes)
───────────────────────────────────────────────────────────────────────────── */

/** Teacher — step 1: class setup */
function DiagramCreateClass() {
    return (
        <svg viewBox="0 0 260 180" fill="none" className="w-full">
            {/* shell */}
            <rect x="10" y="10" width="240" height="160" rx="10" fill={MUTED_BG} stroke={BORDER_CLR} strokeWidth="1" />
            {/* topbar */}
            <rect x="10" y="10" width="240" height="26" rx="10" fill={NAVY} />
            <rect x="10" y="26" width="240" height="10" fill={NAVY} />
            <text x="130" y="27" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="8.5" fontWeight="500" fill={WHITE}>Class Pilot</text>
            {/* sidebar */}
            <rect x="10" y="36" width="54" height="134" fill={WHITE} stroke={BORDER_CLR} strokeWidth="0.5" />
            {([52, 70, 88, 106] as number[]).map((y, i) => (
                <rect key={i} x="18" y={y} width="38" height="8" rx="4"
                    fill={i === 0 ? NAVY : MUTED_BG} />
            ))}
            {/* class card */}
            <text x="76" y="53" fontFamily="Inter,sans-serif" fontSize="7.5" fill={MUTED_TEXT}>My Classes</text>
            <rect x="76" y="60" width="164" height="54" rx="8" fill={WHITE} stroke={BORDER_CLR} strokeWidth="1" />
            <rect x="76" y="60" width="164" height="54" rx="8" fill={`${NAVY}08`} />
            <rect x="76" y="60" width="4" height="54" rx="2" fill={NAVY} />
            <rect x="88" y="70" width="68" height="7" rx="3" fill={NAVY} />
            <text x="88" y="88" fontFamily="Inter,sans-serif" fontSize="7.5" fill={MUTED_TEXT}>BS Computer Science 5th Semester</text>
            {([0, 1, 2, 3] as number[]).map((i) => (
                <circle key={i} cx={88 + i * 14} cy={103} r={6} fill={MUTED_BG} stroke={BORDER_CLR} strokeWidth="1" />
            ))}
            <text x="148" y="106" fontFamily="Inter,sans-serif" fontSize="7" fill={MUTED_TEXT}>+24 students</text>
            {/* new class btn */}
            <rect x="76" y="124" width="164" height="28" rx="8" fill={WHITE}
                stroke={BORDER_CLR} strokeWidth="1" strokeDasharray="4 3" />
            <text x="158" y="141" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="8.5" fill={MUTED_TEXT}>+ New Class</text>
        </svg>
    );
}

/** Teacher — step 2: post assignment */
function DiagramPostAssignment() {
    return (
        <svg viewBox="0 0 260 185" fill="none" className="w-full">
            <rect x="10" y="10" width="240" height="165" rx="10" fill={WHITE} stroke={BORDER_CLR} strokeWidth="1" />
            {/* topbar */}
            <rect x="10" y="10" width="240" height="26" rx="10" fill={NAVY} />
            <rect x="10" y="26" width="240" height="10" fill={NAVY} />
            <text x="130" y="27" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="8" fill={WHITE}>New Assignment</text>
            {/* title input */}
            <rect x="22" y="46" width="216" height="20" rx="5" fill={WHITE} stroke={NAVY_LIGHT} strokeWidth="1.5" />
            <text x="30" y="59" fontFamily="Inter,sans-serif" fontSize="8.5" fill={NEAR_BLACK}>Assignment 2: Data Structures and Algorithms</text>
            {/* instructions */}
            <rect x="22" y="74" width="216" height="36" rx="5" fill={MUTED_BG} stroke={BORDER_CLR} strokeWidth="1" />
            <rect x="30" y="82" width="140" height="4.5" rx="2" fill={BORDER_CLR} />
            <rect x="30" y="91" width="110" height="4.5" rx="2" fill={BORDER_CLR} />
            <rect x="30" y="100" width="80" height="4.5" rx="2" fill={BORDER_CLR} />
            {/* attach / due row */}
            <rect x="22" y="118" width="100" height="18" rx="5" fill={MUTED_BG} stroke={BORDER_CLR} strokeWidth="1" />
            <text x="72" y="129" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="7" fill={MUTED_TEXT}>📎  Attach material</text>
            <rect x="130" y="118" width="108" height="18" rx="5" fill={MUTED_BG} stroke={BORDER_CLR} strokeWidth="1" />
            <text x="184" y="129" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="7" fill={MUTED_TEXT}>🗓  Due: Nov 22</text>
            {/* CTA */}
            <rect x="22" y="146" width="216" height="20" rx="5" fill={MUTED_BG} />
            <text x="130" y="159" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="8.5" fontWeight="600" fill={NAVY}>Post to Class</text>
        </svg>
    );
}

/** Student — step 2: assignment feed */
function DiagramStudentFeed() {
    return (
        <svg viewBox="0 0 260 180" fill="none" className="w-full">
            <rect x="10" y="10" width="240" height="160" rx="10" fill={WHITE} stroke={BORDER_CLR} strokeWidth="1" />
            <rect x="10" y="10" width="240" height="26" rx="10" fill={NAVY} />
            <rect x="10" y="26" width="240" height="10" fill={NAVY} />
            <text x="130" y="27" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="8" fill={WHITE}>My Assignments</text>
            {/* items */}
            {([
                { title: "Assignment 2: Calculus", due: "Due tomorrow", urgent: true },
                { title: "Lab Report 5: Deep Learning", due: "Due 2/3/2026", urgent: false },
            ] as { title: string; due: string; urgent: boolean }[]).map((a, i) => (
                <g key={i}>
                    <rect x="22" y={44 + i * 52} width="216" height="40" rx="7"
                        fill={WHITE} stroke={BORDER_CLR} strokeWidth="1" />
                    <rect x="22" y={44 + i * 52} width="4" height="40" rx="2"
                        fill={a.urgent ? NAVY : NAVY_LIGHT} />
                    <text x="34" y={60 + i * 52} fontFamily="Inter,sans-serif" fontSize="8.5" fontWeight="500" fill={NEAR_BLACK}>{a.title}</text>
                    <text x="34" y={74 + i * 52} fontFamily="Inter,sans-serif" fontSize="7" fill={a.urgent ? NAVY : MUTED_TEXT}>{a.due}</text>
                    {/* open badge */}
                    <rect x="193" y={51 + i * 52} width="36" height="16" rx="8"
                        fill={YELLOW} />
                    <text x="211" y={62 + i * 52} textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="7" fontWeight="600" fill={NAVY}>Open</text>
                </g>
            ))}
            {/* AI hint */}
            <rect x="22" y="152" width="216" height="11" rx="5" fill={`${NAVY}08`} stroke={`${NAVY}20`} strokeWidth="1" />
            <text x="130" y="161" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="6.5" fill={NAVY_LIGHT}>✦  Ask the Class AI Assistant →</text>
        </svg>
    );
}

/** Student — step 3: submit */
function DiagramSubmit() {
    return (
        <svg viewBox="0 0 260 185" fill="none" className="w-full">
            <rect x="10" y="10" width="240" height="165" rx="10" fill={WHITE} stroke={BORDER_CLR} strokeWidth="1" />
            <rect x="10" y="10" width="240" height="26" rx="10" fill={NAVY} />
            <rect x="10" y="26" width="240" height="10" fill={NAVY} />
            <text x="130" y="27" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="8" fill={WHITE}>Submit Your Work</text>
            {/* Q1 */}
            <text x="30" y="56" fontFamily="Inter,sans-serif" fontSize="7.5" fontWeight="600" fill={MUTED_TEXT}>Text Content</text>
            <rect x="22" y="60" width="216" height="16" rx="4" fill={`${NAVY}08`} stroke={`${NAVY}22`} strokeWidth="1" />
            <text x="30" y="71" fontFamily="Inter,sans-serif" fontSize="7" fill={NEAR_BLACK}>Your text content here…</text>
            {/* Q2 */}
            <text x="30" y="92" fontFamily="Inter,sans-serif" fontSize="7.5" fontWeight="600" fill={MUTED_TEXT}>Attachments</text>
            {/* <rect x="22" y="96" width="216" height="16" rx="4" fill={MUTED_BG} stroke={BORDER_CLR} strokeWidth="1" /> */}
            {/* attach */}
            <rect x="22" y="100" width="140" height="40" rx="5" fill={WHITE}
                stroke={BORDER_CLR} strokeWidth="1" strokeDasharray="3 2" />
            <text x="86" y="123" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="7" fill={MUTED_TEXT}>+ Attach your work</text>
            {/* submit */}
            <rect x="22" y="150" width="216" height="20" rx="5" fill={YELLOW} />
            <text x="130" y="163" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="8.5" fontWeight="600" fill={NAVY}>Submit Assignment</text>
        </svg>
    );
}

/** Teacher — step 3: grading */
function DiagramGrading() {
    const rows = [
        { name: "Ahmed", score: "88/100", bar: 0.9, ai: true },
        { name: "Zohaib Hassan", score: "44/100", bar: 0.4, ai: true },
        { name: "Anees Asad", score: "—", bar: 0, ai: false },
    ];
    return (
        <svg viewBox="0 0 260 195" fill="none" className="w-full">
            <rect x="10" y="10" width="240" height="175" rx="10" fill={WHITE} stroke={BORDER_CLR} strokeWidth="1" />
            <rect x="10" y="10" width="240" height="26" rx="10" fill={NAVY} />
            <rect x="10" y="26" width="240" height="10" fill={NAVY} />
            <text x="130" y="27" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="8" fill={WHITE}>Grade Submissions</text>
            {rows.map((s, i) => (
                <g key={i}>
                    <rect x="22" y={46 + i * 42} width="216" height="34" rx="6"
                        fill={i === 2 ? MUTED_BG : WHITE} stroke={BORDER_CLR} strokeWidth="1" />
                    {/* avatar */}
                    <circle cx="38" cy={63 + i * 42} r="9" fill={`${NAVY}18`} stroke={`${NAVY}30`} strokeWidth="1" />
                    <text x="38" y={67 + i * 42} textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="8" fontWeight="600" fill={NAVY}>{s.name[0]}</text>
                    {/* name */}
                    <text x="52" y={59 + i * 42} fontFamily="Inter,sans-serif" fontSize="8" fontWeight="500" fill={NEAR_BLACK}>{s.name}</text>
                    {/* bar track */}
                    <rect x="52" y={65 + i * 42} width="88" height="4" rx="2" fill={MUTED_BG} />
                    {s.bar > 0 && <rect x="52" y={65 + i * 42} width={88 * s.bar} height="4" rx="2" fill={NAVY_LIGHT} />}
                    {/* score */}
                    <text x="150" y={67 + i * 42} fontFamily="Inter,sans-serif" fontSize="9" fontWeight="600"
                        fill={s.score === "—" ? MUTED_TEXT : NEAR_BLACK}>{s.score}</text>
                    {/* AI badge */}
                    {s.ai && (
                        <>
                            <rect x="174" y={56 + i * 42} width="52" height="16" rx="8"
                                fill={YELLOW} />
                            <text x="200" y={67 + i * 42} textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="6.5" fontWeight="600" fill={NAVY}>✦ AI graded</text>
                        </>
                    )}
                </g>
            ))}
            {/* <text x="24" y="177" fontFamily="Inter,sans-serif" fontSize="7" fill={MUTED_TEXT}>1 pending manual review</text> */}
        </svg>
    );
}

/** AI assistant chat diagram */
function DiagramAIChat() {
    return (
        <svg viewBox="0 0 260 205" fill="none" className="w-full">
            <rect x="10" y="10" width="240" height="185" rx="10" fill={WHITE} stroke={BORDER_CLR} strokeWidth="1" />
            {/* header */}
            <rect x="10" y="10" width="240" height="30" rx="10" fill={NAVY} />
            <rect x="10" y="28" width="240" height="12" fill={NAVY} />
            <text x="76" y="29" fontFamily="Inter,sans-serif" fontSize="8.5" fontWeight="500" fill={WHITE}>Pilot AI — DSA 5th Semester</text>
            {/* "class notes only" badge */}
            {/* <rect x="176" y="16" width="64" height="16" rx="8" fill={YELLOW} />
            <text x="208" y="26" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="6.5" fontWeight="600" fill={NAVY}>Class notes only</text> */}
            {/* student bubble (right) */}
            <rect x="80" y="54" width="158" height="30" rx="10" fill={`${NAVY}12`} stroke={`${NAVY}20`} strokeWidth="1" />
            <text x="159" y="65" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="7.5" fill={NEAR_BLACK}>What is the role of the spindle</text>
            <text x="159" y="76" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="7.5" fill={NEAR_BLACK}>apparatus in mitosis?</text>
            {/* AI bubble (left) */}
            <rect x="22" y="97" width="178" height="52" rx="10" fill={MUTED_BG} stroke={BORDER_CLR} strokeWidth="1" />
            <circle cx="35" cy="108" r="7" fill={NAVY} />
            <text x="35" y="111" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="7" fontWeight="700" fill={YELLOW}>AI</text>
            <rect x="48" y="102" width="142" height="5" rx="2" fill={BORDER_CLR} />
            <rect x="48" y="112" width="122" height="5" rx="2" fill={BORDER_CLR} />
            <rect x="48" y="122" width="100" height="5" rx="2" fill={BORDER_CLR} />
            {/* citation */}
            <text x="24" y="164" fontFamily="Inter,sans-serif" fontSize="6.5" fill={NAVY_LIGHT}>Source: Chapter 4 · Your class notes</text>
            {/* input */}
            <rect x="22" y="172" width="216" height="18" rx="9" fill={MUTED_BG} stroke={BORDER_CLR} strokeWidth="1" />
            <text x="34" y="184" fontFamily="Inter,sans-serif" fontSize="7" fill={MUTED_TEXT}>Ask anything from your class…</text>
        </svg>
    );
}

/** Group collaboration diagram */
function DiagramGroupCollab() {
    const members = ["Ahmed", "Anees", "Zohaib", "Hassan"];
    // const bars = [0.85, 0.6, 0.72, 0.4];
    return (
        <svg viewBox="0 0 260 195" fill="none" className="w-full">
            <rect x="10" y="10" width="240" height="175" rx="10" fill={WHITE} stroke={BORDER_CLR} strokeWidth="1" />
            <rect x="10" y="10" width="240" height="26" rx="10" fill={NAVY} />
            <rect x="10" y="26" width="240" height="10" fill={NAVY} />
            <text x="130" y="27" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="8" fill={WHITE}>Group Project — Ecosystems</text>
            {/* shared doc */}
            <rect x="22" y="46" width="148" height="116" rx="8" fill={MUTED_BG} stroke={BORDER_CLR} strokeWidth="1" />
            <rect x="30" y="56" width="78" height="6" rx="2" fill={NAVY} />
            <rect x="30" y="68" width="132" height="4" rx="2" fill={BORDER_CLR} />
            <rect x="30" y="77" width="110" height="4" rx="2" fill={BORDER_CLR} />
            {/* highlighted edit */}
            <rect x="30" y="88" width="92" height="7" rx="2" fill={`${YELLOW}60`} stroke={`${YELLOW}`} strokeWidth="1" />
            <rect x="30" y="88" width="3" height="7" rx="1" fill={NAVY} />
            <rect x="30" y="101" width="132" height="4" rx="2" fill={BORDER_CLR} />
            <rect x="30" y="110" width="100" height="4" rx="2" fill={BORDER_CLR} />
            {/* avatar row */}
            {/* {members.map((m, i) => (
                <g key={i}>
                    <circle cx={30 + i * 17} cy={148} r={9}
                        fill={i === 0 ? `${NAVY}22` : BORDER_CLR}
                        stroke={i === 0 ? NAVY : BORDER_CLR} strokeWidth="1" />
                    <text x={30 + i * 17} y={152} textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="7"
                        fontWeight="600" fill={i === 0 ? NAVY : MUTED_TEXT}>{m}</text>
                </g>
            ))} */}
            {/* contribution panel */}
            <rect x="178" y="46" width="72" height="116" rx="8" fill={WHITE} stroke={BORDER_CLR} strokeWidth="1" />
            <text x="214" y="60" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="6.5" fontWeight="600" fill={MUTED_TEXT}>Group Members</text>
            {members.map((m, i) => (
                <g key={i}>
                    <text x="184" y={76 + i * 22} fontFamily="Inter,sans-serif" fontSize="7" fill={MUTED_TEXT}>{m}</text>
                    {/* <rect x="196" y={70 + i * 22} width={42 * bars[i]} height="6" rx="3" fill={NAVY_LIGHT} /> */}
                </g>
            ))}
        </svg>
    );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
const TEACHER_STEPS: Step[] = [
    {
        num: "01", flip: false, delay: "0s",
        title: "Create your class & invite students",
        desc: "Set up a class in seconds — give it a name, subject, and grade level. Share your unique class code or invite link. Students join instantly. Your class stream, assignments, and materials are live from the moment you create it.",
        tags: ["2-minute setup", "Shareable class code", "Unlimited students"],
        diagram: <DiagramCreateClass />,
    },
    {
        num: "02", flip: true, delay: "0.1s",
        title: "Post assignments & attach materials",
        desc: "Write instructions, attach slides, PDFs, videos, or links, and set a due date — all from one screen. Every student sees it the moment you post. Schedule posts ahead of time or go live in real-time during class.",
        tags: ["Rich attachments", "Due date reminders", "Scheduled posting"],
        diagram: <DiagramPostAssignment />,
    },
    {
        num: "03", flip: false, delay: "0.2s",
        title: "Grade manually — or let the AI do it",
        desc: "Every submission lands in one queue. Mark by hand with inline comments, or trigger AI-assisted grading: the AI scores each submission against your rubric and drafts personalised feedback per student. You review, approve, and return.",
        tags: ["AI grading", "Rubric-based scoring", "Inline comments"],
        diagram: <DiagramGrading />,
    },
];

const STUDENT_STEPS: Step[] = [
    {
        num: "01", flip: false, delay: "0s",
        title: "Join your class with a code",
        desc: "Enter your teacher's class code once and your entire class — assignments, materials, due dates, announcements — appears in your personal feed, organised by subject.",
        tags: ["Instant access", "All classes in one place", "Mobile friendly"],
        diagram: <DiagramCreateClass />,
    },
    {
        num: "02", flip: true, delay: "0.1s",
        title: "See your work & ask the Class AI",
        desc: "Your feed shows every assignment the moment it's posted, with materials right beside it. Stuck on something? Open the Class AI — trained exclusively on your teacher's uploaded notes — and get instant, on-syllabus answers.",
        tags: ["Live notifications", "Clear due dates", "Class AI tutor"],
        diagram: <DiagramStudentFeed />,
    },
    {
        num: "03", flip: false, delay: "0.2s",
        title: "Submit your work & get feedback",
        desc: "Type answers, upload a file, or attach your work directly in the app. Once submitted, your teacher's feedback — including AI-suggested comments — comes back in the same thread. No email chains. No lost notes.",
        tags: ["Easy submission", "Inline feedback", "Grade tracking"],
        diagram: <DiagramSubmit />,
    },
];

const DIFF_CARDS: DiffCard[] = [
    {
        badge: "AI",
        title: "AI-Assisted Grading",
        desc: "The AI reads each submission, scores it against your rubric, and writes personalised feedback for every student. You review and approve in a single pass — a class of 30 graded in minutes, not hours.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7.5 11l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 3.8A5.5 5.5 0 0118.2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".4" />
            </svg>
        ),
    },
    {
        badge: "Collaboration",
        title: "Group Projects",
        desc: "Students collaborate in a shared live workspace — writing, editing, and commenting together in real time. Teachers see a single submission so that there is no repetition — saving them a lot of time.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="8" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="15" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2.5 18c0-3 2.5-4.5 5.5-4.5h7c3 0 5.5 1.5 5.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    },  
    {
        badge: "AI",
        title: "Class-Specific AI Assistant",
        desc: "Every class gets its own AI tutor built from the materials you upload — lecture notes, textbooks, past papers. Students get accurate, on-syllabus answers cited back to your actual source material.",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="2.5" y="5.5" width="17" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 9.5h8M7 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="17.5" cy="17.5" r="3.5" fill="white" stroke="currentColor" strokeWidth="1.5" />
                <path d="M16.2 17.5l1 1 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
];

const STATS: Stat[] = [
    { num: "3 sec", lbl: "avg. AI grading time per submission" },
    { num: "80%", lbl: "reduction in teacher marking time" },
    { num: "2×", lbl: "faster feedback turnaround" },
    { num: "100%", lbl: "AI answers from your own class material" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function HowItWorks() {
    const [view, setView] = useState<View>("teacher");
    useReveal(view);   // re-observe whenever the tab switches

    const steps = view === "teacher" ? TEACHER_STEPS : STUDENT_STEPS;

    return (
        <>
            <style>{`
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
      `}</style>

            <main className="bg-background text-foreground font-sans mt-[1px] ">

                {/* ── HERO  (navy bg) ─────────────────────────────────────────────── */}
                <section className="relative bg-navy text-white text-center  px-6 py-12 overflow-hidden">
                    {/* subtle radial glow */}
                    {/* <div className="pointer-events-none absolute inset-0"
                        style={{ background: `radial-gradient(ellipse 55% 40% at 50% 0%, rgba(79,156,249,.18) 0%, transparent 70%)` }} /> */}
                    <WavePattern />
                    <div className="cp-hero-1">
                        <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[.18em]
              uppercase bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-white/80">
                            <span className="size-2 rounded-full bg-yellow inline-block animate-pulse" />
                            How It Works
                        </span>
                    </div>

                    <h1 className="cp-hero-2 font-black text-[clamp(36px,3vw,70px)] leading-[1.06]
            tracking-tight mb-5 max-w-3xl mx-auto">
                        Your classroom,{" "}
                        <span className="relative inline-block">
                            <span className="text-yellow">smarter.</span>
                        </span>
                    </h1>

                    <p className="cp-hero-3 text-white/65 text-[clamp(15px,1vw,18px)] font-light
            leading-relaxed max-w-lg mx-auto mb-9">
                        Create classes, post assignments, collect submissions, and grade — all in one place.
                        With AI that actually understands your class.
                    </p>

                    <div className="cp-hero-4 flex gap-3 justify-center flex-wrap">
                        <a href="/login"
                            className="inline-flex items-center gap-2 bg-yellow text-navy font-semibold
                text-sm px-7 py-3 rounded-lg transition hover:bg-yellow-hover hover:-translate-y-0.5">
                            Get started free
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