"use client"
 /** Teacher — step 1: class setup */
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
 export function DiagramCreateClass() {
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
export function DiagramPostAssignment() {
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
export function DiagramStudentFeed() {
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
export function DiagramSubmit() {
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
export function DiagramGrading() {
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
export function DiagramAIChat() {
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
export function DiagramGroupCollab() {
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