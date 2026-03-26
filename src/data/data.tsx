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


export type CategoryId =
    | "getting-started"
    | "assignments"
    | "ai-features"
    | "group-projects"
    | "for-students"
    | "account";
export interface Article {
    slug: string;
    title: string;
    category: CategoryId;
    tags: string[];
    popular?: boolean;
    answer: string;
}

export interface Category {
    id: CategoryId;
    label: string;
    desc: string;
    icon: React.ReactNode;
}

/* ─────────────────────────────────────────────────────────────────────────────
   CATEGORIES
───────────────────────────────────────────────────────────────────────────── */
export const CATEGORIES: Category[] = [
    {
        id: "getting-started",
        label: "Getting Started",
        desc: "Set up your class and invite students",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 2L2 7v8l9 5 9-5V7L11 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M2 7l9 5m0 0l9-5m-9 5v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        id: "assignments",
        label: "Assignments",
        desc: "Post work, attach files, set due dates",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="3" y="3" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 8h8M7 11h6M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        id: "ai-features",
        label: "AI Features",
        desc: "AI grading, feedback & class assistant",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7.5 11l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 3.8A5.5 5.5 0 0118.2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".4" />
            </svg>
        ),
    },
    {
        id: "group-projects",
        label: "Group Projects",
        desc: "Collaboration workspace & contributions",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="15" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 19c0-3 2.5-4.5 6-4.5s6 1.5 6 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M16 14.5c2 0 4 1 4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        id: "for-students",
        label: "For Students",
        desc: "Joining classes, submitting & Class AI",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 3L3 7l8 4 8-4-8-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M3 11l8 4 8-4M3 15l8 4 8-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        id: "account",
        label: "Account & Settings",
        desc: "Profile, notifications & preferences",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 19c0-3.5 3.5-6 8-6s8 2.5 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    },
];

/* ─────────────────────────────────────────────────────────────────────────────
   ARTICLES
───────────────────────────────────────────────────────────────────────────── */
export const ARTICLES: Article[] = [
    // ── Getting Started ──
    {
        slug: "create-first-class",
        title: "How do I create my first class?",
        category: "getting-started",
        tags: ["class", "setup", "create"],
        popular: true,
        answer:
            "Go to your dashboard and click '+ New Class'. Give it a name, subject, and grade level. Once created, you'll get a unique class code — share this with your students and they can join instantly. There's no limit on how many classes you can create.",
    },
    {
        slug: "invite-students",
        title: "How do students join my class?",
        category: "getting-started",
        tags: ["invite", "students", "class code"],
        popular: true,
        answer:
            "Share your class code or invite link from the class settings page. Students enter the code on their dashboard and they're in immediately — no approval needed on your end. You can find or reset your class code at any time under Class Settings.",
    },
    {
        slug: "student-limit",
        title: "Is there a limit on how many students I can invite?",
        category: "getting-started",
        tags: ["students", "limit", "free"],
        answer:
            "No. Class Pilot has no cap on students per class or the number of classes you create. Invite your entire school if you need to.",
    },
    {
        slug: "class-settings",
        title: "How do I edit my class name, subject, or settings?",
        category: "getting-started",
        tags: ["settings", "class", "edit"],
        answer:
            "Open the class, click the '⋯' menu in the top-right corner, and select 'Class Settings'. From there you can update the name, subject, grade level, and manage your class code.",
    },

    // ── Assignments ──
    {
        slug: "post-assignment",
        title: "How do I post an assignment?",
        category: "assignments",
        tags: ["assignment", "post", "create"],
        popular: true,
        answer:
            "Inside your class, click '+ New Assignment'. Write your instructions, attach any files (PDFs, slides, videos, or links), set a due date, and hit 'Post to Class'. Students see it in their feed immediately. You can also schedule a post to go live at a specific date and time.",
    },
    {
        slug: "file-types",
        title: "What file types can I attach to an assignment?",
        category: "assignments",
        tags: ["files", "attachments", "upload"],
        answer:
            "You can attach PDFs, Word documents, PowerPoint slides, images (JPG, PNG), videos (MP4), and external links. There is no strict file size limit during the free period, but we recommend keeping individual files under 100MB for best performance.",
    },
    {
        slug: "due-dates",
        title: "Can I edit or extend a due date after posting?",
        category: "assignments",
        tags: ["due date", "edit", "extend"],
        answer:
            "Yes. Open the assignment, click 'Edit', and update the due date. Students who have already submitted will see a note that the deadline was extended. Students who haven't submitted will see the new due date in their feed.",
    },
    {
        slug: "schedule-post",
        title: "How do I schedule an assignment to post later?",
        category: "assignments",
        tags: ["schedule", "post", "later"],
        answer:
            "When creating an assignment, toggle 'Schedule for later' and pick a date and time. The assignment will appear as a draft until the scheduled time, then post automatically to all students.",
    },

    // ── AI Features ──
    {
        slug: "ai-grading-how",
        title: "How does AI grading work?",
        category: "ai-features",
        tags: ["AI", "grading", "rubric", "feedback"],
        popular: true,
        answer:
            "When submissions come in, click 'Grade with AI' on any assignment. The AI reads each submission, scores it against your rubric, and writes a personalised feedback comment for every student. You then review each suggested score and feedback note — approving, editing, or overriding anything you disagree with — before returning it to students. Nothing is sent to students until you approve it.",
    },
    {
        slug: "ai-grading-rubric",
        title: "Do I need a rubric for AI grading?",
        category: "ai-features",
        tags: ["rubric", "AI", "grading"],
        answer:
            "A rubric isn't required but it significantly improves the quality of AI scoring. You can add a rubric when creating an assignment by clicking 'Add rubric' and defining criteria and point values. If no rubric is set, the AI grades based on completeness and relevance to the assignment instructions.",
    },
    {
        slug: "ai-assistant-what",
        title: "What is the Class AI Assistant?",
        category: "ai-features",
        tags: ["AI assistant", "students", "tutor"],
        popular: true,
        answer:
            "The Class AI Assistant is an AI tutor available to students inside each class. It is trained exclusively on the materials you upload — lecture notes, textbook excerpts, past papers, and revision guides. Students ask questions and receive answers cited back to your specific content. It will not pull in information from outside the materials you've provided, keeping answers on-syllabus.",
    },
    {
        slug: "ai-assistant-upload",
        title: "How do I add materials to the Class AI Assistant?",
        category: "ai-features",
        tags: ["AI assistant", "upload", "materials"],
        answer:
            "Go to your class and open the 'Class AI' tab. Click 'Upload materials' and add PDFs, Word documents, or plain text files. The AI will process them within a few minutes. You can add, remove, or replace materials at any time — the assistant updates automatically.",
    },
    {
        slug: "manual-grading",
        title: "Can I grade manually instead of using AI?",
        category: "ai-features",
        tags: ["manual", "grading", "marks"],
        answer:
            "Absolutely. AI grading is optional. Open any submission and use the inline comment and score fields to mark manually at your own pace. You can also use AI grading on some submissions and grade others manually — there's no requirement to use it consistently.",
    },

    // ── Group Projects ──
    {
        slug: "create-group-project",
        title: "How do I assign a group project?",
        category: "group-projects",
        tags: ["group", "project", "assign"],
        popular: true,
        answer:
            "When creating an assignment, toggle 'Group project' and set the group size. Class Pilot will divide your class into groups automatically, or you can assign groups manually. Each group gets a shared workspace where they can write, edit, and comment in real time.",
    },
    {
        slug: "contribution-tracking",
        title: "How does contribution tracking work?",
        category: "group-projects",
        tags: ["contributions", "tracking", "group"],
        answer:
            "Class Pilot logs every edit, addition, and comment each student makes in the group workspace. As a teacher, you can open any group submission and switch to the 'Contributions' view to see a breakdown of who wrote what and when. This is visible only to teachers, not to students.",
    },
    {
        slug: "group-submission",
        title: "Does each student submit separately or as a group?",
        category: "group-projects",
        tags: ["submit", "group", "submission"],
        answer:
            "The group submits once as a team — whichever member clicks 'Submit' finalises the submission for the whole group. All members can see the submission status in their feed. Teachers receive one submission per group, alongside the individual contribution log.",
    },

    // ── For Students ──
    {
        slug: "student-join",
        title: "How do I join a class as a student?",
        category: "for-students",
        tags: ["join", "class code", "student"],
        popular: true,
        answer:
            "Your teacher will share a class code or invite link. Log into Class Pilot, click 'Join a class' on your dashboard, enter the code, and you're in. Your assignments, materials, and class feed will appear immediately.",
    },
    {
        slug: "student-submit",
        title: "How do I submit an assignment?",
        category: "for-students",
        tags: ["submit", "assignment", "student"],
        answer:
            "Open the assignment from your feed. Type your answers directly in the response field, or attach a file using the paperclip icon. When you're ready, click 'Submit Assignment'. You'll see a confirmation and your teacher will be notified. You cannot edit a submission after submitting unless your teacher reopens it.",
    },
    {
        slug: "student-ai-assistant",
        title: "How do I use the Class AI Assistant as a student?",
        category: "for-students",
        tags: ["AI assistant", "student", "help"],
        answer:
            "Open your class and click the 'Class AI' button in the sidebar. Type any question related to your class material and the AI will answer using only the notes and resources your teacher has uploaded. Each answer includes a source reference so you can find the relevant section in your materials.",
    },
    {
        slug: "student-feedback",
        title: "Where do I see my grade and feedback?",
        category: "for-students",
        tags: ["grade", "feedback", "marks"],
        answer:
            "Once your teacher has returned a graded assignment, you'll see a notification in your feed. Open the assignment and scroll to the bottom to see your score, overall feedback, and any inline comments your teacher left on specific parts of your work.",
    },

    // ── Account ──
    {
        slug: "reset-password",
        title: "How do I reset my password?",
        category: "account",
        tags: ["password", "reset", "login"],
        popular: true,
        answer:
            "On the login page, click 'Forgot password?' and enter your email address. You'll receive a reset link within a few minutes. If it doesn't arrive, check your spam folder. The reset link expires after 30 minutes — request a new one if needed.",
    },
    {
        slug: "change-email",
        title: "How do I change my email address?",
        category: "account",
        tags: ["email", "account", "settings"],
        answer:
            "Go to your profile by clicking your avatar in the top-right corner, then select 'Account Settings'. Under 'Email address', click 'Change' and follow the verification steps. You'll need to confirm the new address before the change takes effect.",
    },
    {
        slug: "delete-account",
        title: "How do I delete my account?",
        category: "account",
        tags: ["delete", "account", "data"],
        answer:
            "Go to Account Settings and scroll to the bottom. Click 'Delete account' and confirm. This permanently removes your profile, classes, and all associated data. This action cannot be undone. If you're a teacher, your classes and student submissions will also be deleted.",
    },
    {
        slug: "notifications",
        title: "How do I manage email notifications?",
        category: "account",
        tags: ["notifications", "email", "settings"],
        answer:
            "Go to Account Settings and open the 'Notifications' tab. You can toggle individual notification types on or off — assignment submissions, new class members, AI grading completion, and weekly summaries.",
    },
];
