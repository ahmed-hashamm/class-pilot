"use client"
import { DiagramCreateClass, DiagramGrading, DiagramPostAssignment, DiagramStudentFeed, DiagramSubmit } from "@/components/illustrations/HowItWorksPageDiagrams";
import { ReactNode } from "react";
export interface DiffCard {
    badge: string;
    title: string;
    desc: string;
    icon: ReactNode;
}

export interface Stat {
    num: string;
    lbl: string;
}

export interface Step {
    num: string;
    title: string;
    desc: string;
    tags: string[];
    diagram: ReactNode;
    flip: boolean;
    delay: string;
}
export const TEACHER_STEPS: Step[] = [
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

export const STUDENT_STEPS: Step[] = [
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


export const DIFF_CARDS: DiffCard[] = [
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

export const STATS: Stat[] = [
    { num: "3 sec", lbl: "avg. AI grading time per submission" },
    { num: "80%", lbl: "reduction in teacher marking time" },
    { num: "2×", lbl: "faster feedback turnaround" },
    { num: "100%", lbl: "AI answers from your own class material" },
];