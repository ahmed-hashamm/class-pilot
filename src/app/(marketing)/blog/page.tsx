// "use client";

// import { useState } from "react";

// /* ─────────────────────────────────────────────────────────────────────────────
//    TYPES
// ───────────────────────────────────────────────────────────────────────────── */
// type Category = "All" | "Teaching Tips" | "AI in Education" | "Product Updates" | "Student Guides";

// interface Post {
//   slug: string;
//   category: Exclude<Category, "All">;
//   title: string;
//   excerpt: string;
//   author: string;
//   authorRole: string;
//   date: string;
//   readTime: string;
//   featured?: boolean;
// }

// /* ─────────────────────────────────────────────────────────────────────────────
//    DATA  — swap out for your CMS / API fetch in production
// ───────────────────────────────────────────────────────────────────────────── */
// const POSTS: Post[] = [
//   {
//     slug: "ai-grading-saves-teachers-time",
//     category: "AI in Education",
//     title: "How AI Grading Saves Teachers 4+ Hours Every Week",
//     excerpt:
//       "We analysed thousands of grading sessions on Class Pilot and found one clear pattern: teachers who use AI-assisted grading reclaim an average of 4.5 hours per week. Here's exactly how it works and why the feedback quality actually improves.",
//     author: "Priya Sharma",
//     authorRole: "Head of Product",
//     date: "Feb 28, 2026",
//     readTime: "6 min read",
//     featured: true,
//   },
//   {
//     slug: "5-lesson-structures-that-actually-work",
//     category: "Teaching Tips",
//     title: "5 Lesson Structures That Keep Students Engaged Start to Finish",
//     excerpt:
//       "The opening five minutes of a lesson determine whether students are with you or not. These battle-tested structures — used by over 12,000 teachers on Class Pilot — help you hook attention and sustain it.",
//     author: "James Okafor",
//     authorRole: "Educator Success Lead",
//     date: "Feb 20, 2026",
//     readTime: "5 min read",
//   },
//   {
//     slug: "class-ai-assistant-launch",
//     category: "Product Updates",
//     title: "Introducing the Class AI Assistant — Answers from Your Own Notes",
//     excerpt:
//       "Today we're launching the feature teachers and students have asked for most: an AI tutor trained exclusively on your uploaded class materials. No generic internet answers. Just your content, explained clearly.",
//     author: "Class Pilot Team",
//     authorRole: "Product",
//     date: "Feb 14, 2026",
//     readTime: "4 min read",
//   },
//   {
//     slug: "how-to-use-active-recall",
//     category: "Student Guides",
//     title: "Active Recall: The Study Method Backed by Decades of Research",
//     excerpt:
//       "Re-reading your notes feels productive. It isn't. Active recall — quizzing yourself on material before you think you're ready — is consistently the most effective study technique. Here's how to build it into your routine.",
//     author: "Aisha Malik",
//     authorRole: "Learning Science Writer",
//     date: "Feb 10, 2026",
//     readTime: "7 min read",
//   },
//   {
//     slug: "group-projects-that-dont-fail",
//     category: "Teaching Tips",
//     title: "Why Most Group Projects Fail — and How to Fix Them",
//     excerpt:
//       "One student does everything. Two students do nothing. Sound familiar? Group work fails when accountability is invisible. Class Pilot's collaboration workspace fixes this by logging every individual contribution in real time.",
//     author: "James Okafor",
//     authorRole: "Educator Success Lead",
//     date: "Feb 4, 2026",
//     readTime: "5 min read",
//   },
//   {
//     slug: "ai-in-classrooms-teacher-guide",
//     category: "AI in Education",
//     title: "A Practical Teacher's Guide to AI in the Classroom",
//     excerpt:
//       "AI tools are arriving in schools faster than training can keep up. This guide cuts through the hype and gives you a plain-English framework for deciding which tools to use, which to ignore, and how to talk about them with students.",
//     author: "Priya Sharma",
//     authorRole: "Head of Product",
//     date: "Jan 28, 2026",
//     readTime: "8 min read",
//   },
//   {
//     slug: "spaced-repetition-student-guide",
//     category: "Student Guides",
//     title: "Spaced Repetition: Study Less, Remember More",
//     excerpt:
//       "The forgetting curve is real — but it's beatable. Spaced repetition schedules your review sessions at exactly the right intervals to lock information into long-term memory before it fades. Here's how to set it up for any subject.",
//     author: "Aisha Malik",
//     authorRole: "Learning Science Writer",
//     date: "Jan 22, 2026",
//     readTime: "6 min read",
//   },
//   {
//     slug: "group-projects-workspace-update",
//     category: "Product Updates",
//     title: "Group Projects Just Got a Major Upgrade",
//     excerpt:
//       "Real-time co-editing, inline comments, contribution tracking, and a new teacher view that shows you exactly who wrote what — the Class Pilot collaboration workspace is now out of beta and available to all users.",
//     author: "Class Pilot Team",
//     authorRole: "Product",
//     date: "Jan 15, 2026",
//     readTime: "3 min read",
//   },
//   {
//     slug: "differentiating-instruction-guide",
//     category: "Teaching Tips",
//     title: "Differentiation Without Doubling Your Workload",
//     excerpt:
//       "Meeting every learner where they are sounds impossible when you have 30 students. These practical strategies — combined with Class Pilot's built-in differentiation suggestions — make it genuinely manageable.",
//     author: "James Okafor",
//     authorRole: "Educator Success Lead",
//     date: "Jan 8, 2026",
//     readTime: "6 min read",
//   },
// ];

// const CATEGORIES: Category[] = [
//   "All",
//   "Teaching Tips",
//   "AI in Education",
//   "Product Updates",
//   "Student Guides",
// ];

// /* ─────────────────────────────────────────────────────────────────────────────
//    CATEGORY COLOUR MAP
// ───────────────────────────────────────────────────────────────────────────── */
// const CATEGORY_STYLES: Record<Exclude<Category, "All">, { bg: string; text: string; border: string }> = {
//   "Teaching Tips":   { bg: "bg-navy/8",        text: "text-navy",       border: "border-navy/15"      },
//   "AI in Education": { bg: "bg-yellow/30",      text: "text-navy",       border: "border-yellow/60"    },
//   "Product Updates": { bg: "bg-navy-light/15",  text: "text-navy-light", border: "border-navy-light/30"},
//   "Student Guides":  { bg: "bg-secondary",      text: "text-foreground", border: "border-border"       },
// };

// /* ─────────────────────────────────────────────────────────────────────────────
//    SUB-COMPONENTS
// ───────────────────────────────────────────────────────────────────────────── */

// /** Decorative illustrated placeholder for post cover art */
// function PostIllustration({ category, large = false }: { category: Exclude<Category, "All">; large?: boolean }) {
//   const size = large ? 260 : 120;

//   const patterns: Record<Exclude<Category, "All">, React.ReactNode> = {
//     "AI in Education": (
//       <>
//         {/* Circuit / brain motif */}
//         <circle cx="130" cy="100" r="38" fill="rgba(255,228,146,0.18)" stroke="#FFE492" strokeWidth="1.5"/>
//         <circle cx="130" cy="100" r="22" fill="rgba(4,56,115,0.12)" stroke="#043873" strokeWidth="1.2"/>
//         <circle cx="130" cy="100" r="8"  fill="#043873"/>
//         {[0,60,120,180,240,300].map((deg, i) => {
//           const rad = (deg * Math.PI) / 180;
//           const x1 = 130 + 22 * Math.cos(rad), y1 = 100 + 22 * Math.sin(rad);
//           const x2 = 130 + 52 * Math.cos(rad), y2 = 100 + 52 * Math.sin(rad);
//           return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#043873" strokeWidth="1.2" strokeDasharray="3 2"/>;
//         })}
//         {[0,60,120,180,240,300].map((deg, i) => {
//           const rad = (deg * Math.PI) / 180;
//           return <circle key={i} cx={130 + 52 * Math.cos(rad)} cy={100 + 52 * Math.sin(rad)} r="4" fill="#FFE492" stroke="#043873" strokeWidth="1"/>;
//         })}
//         <text x="130" y="156" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="10" fontWeight="600" fill="#043873">AI in Education</text>
//       </>
//     ),
//     "Teaching Tips": (
//       <>
//         {/* Chalkboard / lightbulb motif */}
//         <rect x="80" y="58" width="100" height="72" rx="6" fill="rgba(4,56,115,0.08)" stroke="#043873" strokeWidth="1.5"/>
//         <line x1="88" y1="75" x2="172" y2="75" stroke="#043873" strokeWidth="1" strokeDasharray="4 3" opacity=".4"/>
//         <line x1="88" y1="88" x2="155" y2="88" stroke="#043873" strokeWidth="1" strokeDasharray="4 3" opacity=".4"/>
//         <line x1="88" y1="101" x2="162" y2="101" stroke="#043873" strokeWidth="1" strokeDasharray="4 3" opacity=".4"/>
//         <circle cx="192" cy="68" r="16" fill="#FFE492" stroke="#043873" strokeWidth="1.5"/>
//         <path d="M188 68 q0-6 4-6 q4 0 4 6 q0 4-4 7 q-4-3-4-7z" fill="#043873"/>
//         <line x1="192" y1="87" x2="192" y2="91" stroke="#043873" strokeWidth="1.5" strokeLinecap="round"/>
//         <text x="130" y="148" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="10" fontWeight="600" fill="#043873">Teaching Tips</text>
//       </>
//     ),
//     "Product Updates": (
//       <>
//         {/* Rocket / launch motif */}
//         <path d="M130 58 C130 58 115 80 115 100 C115 110 122 118 130 118 C138 118 145 110 145 100 C145 80 130 58 130 58Z"
//           fill="rgba(4,56,115,0.1)" stroke="#043873" strokeWidth="1.5"/>
//         <circle cx="130" cy="100" r="8" fill="#FFE492" stroke="#043873" strokeWidth="1.2"/>
//         <path d="M122 116 L116 126 L124 122Z" fill="#FFE492" stroke="#043873" strokeWidth="1"/>
//         <path d="M138 116 L144 126 L136 122Z" fill="#FFE492" stroke="#043873" strokeWidth="1"/>
//         {[[-18,4],[-24,0],[-20,-6],[18,4],[24,0],[20,-6]].map(([dx,dy],i) => (
//           <circle key={i} cx={130+dx} cy={100+dy} r="2.5" fill="#043873" opacity=".3"/>
//         ))}
//         <text x="130" y="148" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="10" fontWeight="600" fill="#043873">Product Updates</text>
//       </>
//     ),
//     "Student Guides": (
//       <>
//         {/* Open book motif */}
//         <path d="M88 74 L88 122 Q109 118 130 122 Q151 118 172 122 L172 74 Q151 70 130 74 Q109 70 88 74Z"
//           fill="rgba(4,56,115,0.08)" stroke="#043873" strokeWidth="1.5"/>
//         <line x1="130" y1="74" x2="130" y2="122" stroke="#043873" strokeWidth="1.2"/>
//         {[82,92,102,112].map((y,i) => (
//           <line key={i} x1="95" y1={y} x2="124" y2={y} stroke="#043873" strokeWidth=".8" opacity=".35"/>
//         ))}
//         {[82,92,102,112].map((y,i) => (
//           <line key={i} x1="136" y1={y} x2="165" y2={y} stroke="#043873" strokeWidth=".8" opacity=".35"/>
//         ))}
//         <circle cx="172" cy="68" r="12" fill="#FFE492" stroke="#043873" strokeWidth="1.2"/>
//         <text x="172" y="72" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="10" fontWeight="700" fill="#043873">A+</text>
//         <text x="130" y="148" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="10" fontWeight="600" fill="#043873">Student Guides</text>
//       </>
//     ),
//   };

//   return (
//     <svg
//       viewBox="0 0 260 170"
//       fill="none"
//       className="w-full h-full"
//       style={{ background: "transparent" }}
//     >
//       <rect x="0" y="0" width="260" height="170" rx="0" fill="rgba(4,56,115,0.04)"/>
//       {patterns[category]}
//     </svg>
//   );
// }

// /** Category pill */
// function CategoryPill({ category }: { category: Exclude<Category, "All"> }) {
//   const s = CATEGORY_STYLES[category];
//   return (
//     <span className={`inline-block text-[10px] font-bold tracking-widest uppercase
//       rounded-full px-2.5 py-0.5 border ${s.bg} ${s.text} ${s.border}`}>
//       {category}
//     </span>
//   );
// }

// /** Author avatar (initials-based) */
// function Avatar({ name, small = false }: { name: string; small?: boolean }) {
//   const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
//   const size = small ? "size-7" : "size-9";
//   return (
//     <span className={`${size} rounded-full bg-navy/10 border border-navy/20
//       flex items-center justify-center text-navy font-bold shrink-0`}
//       style={{ fontSize: small ? 10 : 12 }}>
//       {initials}
//     </span>
//   );
// }

// /** Featured hero post */
// function FeaturedPost({ post }: { post: Post }) {
//   return (
//     <a href={`/blog/${post.slug}`}
//       className="group grid grid-cols-1 md:grid-cols-2 gap-0
//         bg-white border border-border rounded-2xl overflow-hidden
//         hover:shadow-lg transition-shadow duration-300">
//       {/* illustration */}
//       <div className="relative min-h-[220px] md:min-h-[340px] bg-secondary overflow-hidden">
//         <PostIllustration category={post.category} large />
//         {/* overlay badge */}
//         <div className="absolute top-4 left-4">
//           <span className="inline-flex items-center gap-1.5 bg-yellow text-navy
//             text-[10px] font-bold tracking-widest uppercase rounded-full px-3 py-1">
//             <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
//               <polygon points="4,0 5,3 8,3 5.5,5 6.5,8 4,6 1.5,8 2.5,5 0,3 3,3" fill="currentColor"/>
//             </svg>
//             Featured
//           </span>
//         </div>
//       </div>

//       {/* content */}
//       <div className="flex flex-col justify-center p-8 md:p-10">
//         <CategoryPill category={post.category} />

//         <h2 className="font-black text-[clamp(20px,2.5vw,28px)] leading-tight tracking-tight
//           mt-4 mb-3 group-hover:text-navy transition-colors">
//           {post.title}
//         </h2>

//         <p className="text-[15px] text-muted-foreground leading-relaxed mb-6 line-clamp-3">
//           {post.excerpt}
//         </p>

//         {/* meta */}
//         <div className="flex items-center gap-3">
//           <Avatar name={post.author} />
//           <div>
//             <p className="text-[13px] font-semibold text-foreground leading-none mb-0.5">{post.author}</p>
//             <p className="text-[11px] text-muted-foreground">{post.date} · {post.readTime}</p>
//           </div>
//         </div>

//         {/* read more */}
//         <div className="mt-6 flex items-center gap-2 text-[13px] font-semibold text-navy
//           group-hover:gap-3 transition-all duration-200">
//           Read article
//           <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//             <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//         </div>
//       </div>
//     </a>
//   );
// }

// /** Regular post card */
// function PostCard({ post }: { post: Post }) {
//   return (
//     <a href={`/blog/${post.slug}`}
//       className="group flex flex-col bg-white border border-border rounded-2xl
//         overflow-hidden hover:shadow-md transition-shadow duration-300">
//       {/* illustration */}
//       <div className="relative h-[160px] bg-secondary overflow-hidden shrink-0">
//         <PostIllustration category={post.category} />
//       </div>

//       {/* content */}
//       <div className="flex flex-col flex-1 p-6">
//         <CategoryPill category={post.category} />

//         <h3 className="font-bold text-[17px] leading-snug tracking-tight mt-3 mb-2
//           group-hover:text-navy transition-colors line-clamp-2">
//           {post.title}
//         </h3>

//         <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2 flex-1">
//           {post.excerpt}
//         </p>

//         {/* divider */}
//         <div className="border-t border-border mt-4 pt-4 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Avatar name={post.author} small />
//             <div>
//               <p className="text-[12px] font-semibold text-foreground leading-none mb-0.5">{post.author}</p>
//               <p className="text-[11px] text-muted-foreground">{post.date}</p>
//             </div>
//           </div>
//           <span className="text-[11px] text-muted-foreground">{post.readTime}</span>
//         </div>
//       </div>
//     </a>
//   );
// }

// /* ─────────────────────────────────────────────────────────────────────────────
//    PAGE
// ───────────────────────────────────────────────────────────────────────────── */
// export default function BlogPage() {
//   const [activeCategory, setActiveCategory] = useState<Category>("All");

//   const featured = POSTS.find((p) => p.featured)!;

//   const filtered = POSTS.filter((p) => {
//     if (p.featured) return false;                                      // featured shown separately
//     if (activeCategory === "All") return true;
//     return p.category === activeCategory;
//   });

//   // When a category is active, show featured too if it matches
//   const showFeaturedInGrid =
//     activeCategory !== "All" && featured.category !== activeCategory;

//   return (
//     <main className="bg-background text-foreground font-sans overflow-x-hidden">

//       {/* ── HERO HEADER (navy) ────────────────────────────────────────────── */}
//       <section className="bg-navy text-white px-6 pt-24 pb-16 text-center relative overflow-hidden">
//         <div className="pointer-events-none absolute inset-0"
//           style={{ background: "radial-gradient(ellipse 55% 40% at 50% 0%, rgba(79,156,249,.15) 0%, transparent 70%)" }}/>

//         <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[.18em]
//           uppercase bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-white/80">
//           <span className="size-2 rounded-full bg-yellow inline-block" />
//           The Class Pilot Blog
//         </span>

//         <h1 className="font-black text-[clamp(32px,5.5vw,60px)] leading-tight tracking-tight mb-4 max-w-2xl mx-auto">
//           Ideas, insights &{" "}
//           <span className="text-yellow">updates</span>{" "}
//           for modern classrooms
//         </h1>

//         <p className="text-white/60 text-[clamp(14px,1.6vw,17px)] font-light
//           leading-relaxed max-w-lg mx-auto">
//           Teaching tips, AI in education, product news, and study strategies —
//           written by teachers and the Class Pilot team.
//         </p>
//       </section>

//       {/* ── CATEGORY TABS ────────────────────────────────────────────────── */}
//       <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
//         <div className="max-w-5xl mx-auto px-6">
//           <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none"
//             style={{ scrollbarWidth: "none" }}>
//             {CATEGORIES.map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => setActiveCategory(cat)}
//                 className={`shrink-0 text-[13px] font-semibold px-4 py-2 rounded-lg
//                   border transition-all duration-200 cursor-pointer whitespace-nowrap
//                   ${activeCategory === cat
//                     ? "bg-navy text-white border-navy"
//                     : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
//                   }`}>
//                 {cat}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── CONTENT ──────────────────────────────────────────────────────── */}
//       <div className="max-w-5xl mx-auto px-6 py-12">

//         {/* Featured post — only on "All" or if featured matches active category */}
//         {(activeCategory === "All" || featured.category === activeCategory) && (
//           <div className="mb-12">
//             <FeaturedPost post={featured} />
//           </div>
//         )}

//         {/* Grid */}
//         {filtered.length > 0 ? (
//           <>
//             {activeCategory === "All" && (
//               <h2 className="font-bold text-[18px] tracking-tight mb-6 text-foreground">
//                 Latest articles
//               </h2>
//             )}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filtered.map((post) => (
//                 <PostCard key={post.slug} post={post} />
//               ))}
//             </div>
//           </>
//         ) : (
//           /* Empty state — featured matched the filter so no grid posts remain */
//           <p className="text-center text-muted-foreground text-[15px] py-8">
//             More {activeCategory} posts coming soon.
//           </p>
//         )}
//       </div>

//       {/* ── WRITE FOR US CTA (yellow) ─────────────────────────────────────── */}
//       <section className="bg-yellow py-16 px-6 mt-8 text-center">
//         <h2 className="font-black text-[clamp(24px,4vw,40px)] leading-tight tracking-tight text-navy mb-3">
//           A teacher? Write for us.
//         </h2>
//         <p className="text-navy/65 text-[15px] leading-relaxed max-w-md mx-auto mb-8">
//           Share your classroom experience with thousands of educators. We publish practical,
//           experience-first articles from real teachers.
//         </p>
//         <a href="/contact"
//           className="inline-flex items-center gap-2 bg-navy text-white font-semibold
//             text-sm px-7 py-3 rounded-lg transition hover:bg-navy/90 hover:-translate-y-0.5">
//           Get in touch
//           <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//             <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//         </a>
//       </section>

//     </main>
//   );
// }

"use client";

import BlogSPageClock from "@/components/illustrations/BlogsPageClock";
import MarketingPagesLayout from "@/components/layout/MarketingPagesHero";

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function BlogPage() {
    return (
        <main className="bg-background text-foreground font-sans overflow-x-hidden mt-[1px]">

            {/* ── HERO HEADER (navy) ────────────────────────────────────────────── */}
            <MarketingPagesLayout
                pageIntro="The Class Pilot Blog"
                href="/login"
                buttonText="Try Class-Pilot Free"
                headingStart="Ideas, insights &"
                headingHighlight="updates"
                // headingEnd="for modern classrooms"
                text="Teaching tips, AI in education, product news, and study strategies —
                    written by teachers and the Class Pilot team."
            />

            {/* ── COMING SOON ──────────────────────────────────────────────────── */}
            <section className="max-w-3xl mx-auto px-6 py-20 text-center">

                {/* Illustration */}
               
                <BlogSPageClock/>

                {/* Badge */}
                <span className="inline-flex items-center gap-2 bg-yellow text-navy text-[11px]
  font-bold tracking-widest uppercase rounded-full px-4 py-1.5 mb-6">
                    <span className="size-1.5 rounded-full bg-navy inline-block" />
                    Coming Soon
                </span>

                <h2 className="font-black text-[clamp(26px,4vw,42px)] leading-tight tracking-tight
  text-foreground mb-4">
                    The Class Pilot blog<br />is on its way
                </h2>

                <p className="text-[15px] text-muted-foreground leading-relaxed max-w-md mx-auto mb-10">
                    We're working on articles covering teaching strategies, AI in education,
                    product updates, and student study guides. Check back soon.
                </p>

                {/* Preview topic chips */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {[
                        { label: "Teaching Tips", icon: "✏️" },
                        { label: "AI in Education", icon: "✦" },
                        { label: "Product Updates", icon: "🚀" },
                        { label: "Student Guides", icon: "📖" },
                    ].map(({ label, icon }) => (
                        <span key={label}
                            className="inline-flex items-center gap-2 text-[12px] font-semibold
        text-navy bg-navy/8 border border-navy/15 rounded-full px-4 py-2">
                            <span>{icon}</span>
                            {label}
                        </span>
                    ))}
                </div>

                {/* Divider */}
                <div className="w-12 h-0.5 bg-border mx-auto mb-10" />

                {/* Back to home nudge */}
                <a href="/"
                    className="inline-flex items-center gap-2 text-[13px] font-semibold text-navy
    hover:gap-3 transition-all duration-200">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M12 7H2M7 2L2 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to home
                </a>
            </section>

        </main>
    );
}
