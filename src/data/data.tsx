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

/* ─────────────────────────────────────────────────────────────────────────────
   {Pricing page}
───────────────────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────────────────────
   CURRENT FREE FEATURES
───────────────────────────────────────────────────────────────────────────── */
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
  