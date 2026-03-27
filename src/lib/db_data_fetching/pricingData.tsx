export const _dummy = true; // just to make sure it exports
import { ReactNode } from 'react';
export const FREE_FEATURES = [
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="4" width="16" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 9h8M6 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "Unlimited classes",
        desc: "Create as many classes as you need. No caps on subjects, grade levels, or students.",
    },
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "Unlimited students",
        desc: "Invite your entire class, department, or school with a single code.",
    },
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 6h12M4 10h8M4 14h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "Assignments & materials",
        desc: "Post assignments, attach files, set due dates, and schedule posts ahead of time.",
    },
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7.5 10l2 2 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "AI-assisted grading",
        desc: "Grade submissions in minutes with AI scoring and personalised feedback drafts.",
    },
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="6" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="14" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M1 17c0-2.8 2.2-4.5 5-4.5h8c2.8 0 5 1.7 5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "Group collaboration",
        desc: "Real-time shared workspaces for group projects with individual contribution tracking.",
    },
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="4" width="16" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 9h8M6 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="15" cy="15" r="4" fill="hsl(var(--background))" stroke="currentColor" strokeWidth="1.4" />
                <path d="M13.8 15l.9.9 1.7-1.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Class AI Assistant",
        desc: "An AI tutor trained exclusively on your uploaded class materials — on-syllabus, always.",
    },
];

/* ─────────────────────────────────────────────────────────────────────────────
   FUTURE PLAN TEASER
───────────────────────────────────────────────────────────────────────────── */
export const FUTURE_FEATURES = [
    "Advanced analytics & progress reports",
    "Parent communication tools",
    "School-wide admin dashboard",
    "LMS integrations (Canvas, Schoology)",
    "Priority support",
    "Custom branding for institutions",
];

/* ─────────────────────────────────────────────────────────────────────────────
   FAQ
───────────────────────────────────────────────────────────────────────────── */
export const FAQS = [
    {
        q: "Is Class Pilot really free?",
        a: "Yes — completely free, right now. Every feature on this page is available to all teachers and students at no cost. No credit card required to sign up.",
    },
    {
        q: "Will it always be free?",
        a: "The core features will remain free. We plan to introduce optional paid plans in the future for schools and institutions that need advanced features like analytics, admin dashboards, and LMS integrations. We'll give plenty of notice before anything changes.",
    },
    {
        q: "What happens to my data when paid plans launch?",
        a: "Nothing changes. Your classes, assignments, and student data stay exactly as they are. You'll never be forced onto a paid plan to keep accessing what you already have.",
    },
    {
        q: "Is there a student limit per class?",
        a: "No. Invite as many students as you need — there are no caps on class size or the number of classes you create.",
    },
    {
        q: "Do students need to pay?",
        a: "No. Class Pilot is free for students too. They join using a class code their teacher shares — no account setup, no payment required.",
    },
];
