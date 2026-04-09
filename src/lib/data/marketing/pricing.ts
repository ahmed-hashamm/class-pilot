/**
 * PRICING PAGE DATA
 */

export interface PricingFeature {
  iconName: string; // Lucide icon name or slug
  title: string;
  desc: string;
}

export const FREE_FEATURES = [
  {
    iconName: "layout",
    title: "Unlimited classes",
    desc: "Create as many classes as you need. No caps on subjects, grade levels, or students.",
  },
  {
    iconName: "users",
    title: "Unlimited students",
    desc: "Invite your entire class, department, or school with a single code.",
  },
  {
    iconName: "file-text",
    title: "Assignments & materials",
    desc: "Post assignments, attach files, set due dates, and schedule posts ahead of time.",
  },
  {
    iconName: "check-circle",
    title: "AI-assisted grading",
    desc: "Grade submissions in minutes with AI scoring and personalised feedback drafts.",
  },
  {
    iconName: "users-round",
    title: "Group collaboration",
    desc: "Real-time shared workspaces for group projects with individual contribution tracking.",
  },
  {
    iconName: "sparkles",
    title: "Class AI Assistant",
    desc: "An AI tutor trained exclusively on your uploaded class materials — on-syllabus, always.",
  },
];

export const FUTURE_FEATURES = [
  "Advanced analytics & progress reports",
  "Parent communication tools",
  "School-wide admin dashboard",
  "LMS integrations (Canvas, Schoology)",
  "Priority support",
  "Custom branding for institutions",
];

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
