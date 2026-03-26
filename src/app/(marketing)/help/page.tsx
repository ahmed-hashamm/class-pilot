"use client";

import { useState, useMemo } from "react";
import MarketingPagesLayout from "@/components/layout/MarketingPagesHero";
import { useReveal } from "@/hooks/useReveal";
import { Article, ARTICLES, Category, CATEGORIES, CategoryId } from "@/data/data";

/* ─────────────────────────────────────────────────────────────────────────────
   ARTICLE ACCORDION ITEM
───────────────────────────────────────────────────────────────────────────── */
function ArticleItem({ article, defaultOpen = false }: { article: Article; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-border last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-4 py-4
                    text-left cursor-pointer bg-transparent border-none group"
            >
                <span className={`text-[14px] font-semibold transition-colors
                    ${open ? "text-navy" : "text-foreground group-hover:text-navy"}`}>
                    {article.title}
                </span>
                <span className={`shrink-0 size-6 rounded-full border flex items-center justify-center
                    transition-all duration-200
                    ${open ? "bg-navy border-navy" : "bg-transparent border-border"}`}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                        className={`transition-transform duration-200 ${open ? "rotate-45" : ""}`}>
                        <path d="M5 1v8M1 5h8" stroke={open ? "white" : "currentColor"}
                            strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </span>
            </button>
            {open && (
                <p className="text-[14px] text-muted-foreground leading-relaxed pb-5 pr-8">
                    {article.answer}
                </p>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function HelpCenterPage() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<CategoryId | "all">("all");

    // Pass both state values as deps so useReveal re-observes
    // whenever search results or category articles are newly rendered
    useReveal(`${search}::${activeCategory}`);

    /* filtered articles */
    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        return ARTICLES.filter((a) => {
            const matchesCategory = activeCategory === "all" || a.category === activeCategory;
            const matchesSearch =
                !q ||
                a.title.toLowerCase().includes(q) ||
                a.tags.some((t) => t.toLowerCase().includes(q)) ||
                a.answer.toLowerCase().includes(q);
            return matchesCategory && matchesSearch;
        });
    }, [search, activeCategory]);

    const popular = ARTICLES.filter((a) => a.popular);
    const isSearching = search.trim().length > 0;
    const isBrowsing = activeCategory !== "all";

    return (
        <main className="bg-background text-foreground font-sans overflow-x-hidden ">

            {/* ── HERO ──────────────────────────────────────────────────────────── */}
            <MarketingPagesLayout
                href="/login"
                buttonText="Get Started"
                pageIntro="Help Center"
                headingStart="How can we"
                headingHighlight="help you?"
                headingEnd=""
                text="Search for answers or browse by topic below."
            />

            {/* ── SEARCH BAR ───────────────────────────────────────────────────── */}
            <div className="bg-navy pb-8 px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                            width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setActiveCategory("all"); }}
                            placeholder="Search for anything — e.g. 'AI grading', 'submit assignment'…"
                            className="w-full bg-white border border-border rounded-xl
                                pl-11 pr-4 py-3.5 text-[14px] text-foreground placeholder:text-muted-foreground
                                focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy
                                transition shadow-sm"
                        />
                        {search && (
                            <button onClick={() => setSearch("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2
                                    text-muted-foreground hover:text-foreground transition cursor-pointer">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-14">

                {/* ── SEARCH RESULTS ─────────────────────────────────────────────── */}
                {isSearching ? (
                    <div className="cp-reveal">
                        <p className="text-[13px] text-muted-foreground mb-5">
                            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for{" "}
                            <span className="font-semibold text-foreground">"{search}"</span>
                        </p>
                        {filtered.length > 0 ? (
                            <div className="bg-white border border-border rounded-2xl px-6">
                                {filtered.map((a) => <ArticleItem key={a.slug} article={a} defaultOpen />)}
                            </div>
                        ) : (
                            <div className="text-center py-16 border border-dashed border-border rounded-2xl">
                                <p className="text-[15px] font-semibold text-foreground mb-2">No results found</p>
                                <p className="text-[14px] text-muted-foreground mb-6">
                                    Try different keywords, or contact us directly.
                                </p>
                                <a href="mailto:classpilot.edu@gmail.com"
                                    className="inline-flex items-center gap-2 bg-navy text-white
                                        font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-navy/90 transition">
                                    Email support
                                </a>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* ── BROWSE BY CATEGORY ───────────────────────────────────────── */}
                        <section className="mb-14">
                            <div className="cp-reveal mb-6">
                                <p className="text-[11px] font-bold tracking-[.18em] uppercase text-navy mb-1">
                                    Browse by topic
                                </p>
                                <h2 className="font-black text-[clamp(20px,3vw,30px)] leading-tight tracking-tight">
                                    What do you need help with?
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {CATEGORIES.map((cat, i) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(
                                            activeCategory === cat.id ? "all" : cat.id
                                        )}
                                        className={`cp-reveal text-left p-5 rounded-xl border transition-all duration-200
                                            cursor-pointer group
                                            ${activeCategory === cat.id
                                                ? "bg-navy border-navy text-white"
                                                : "bg-white border-border hover:border-navy/30 hover:shadow-sm"
                                            }`}
                                        style={{ transitionDelay: `${i * 0.05}s` }}>
                                        <div className={`size-10 rounded-lg flex items-center justify-center mb-3
                                            transition-colors
                                            ${activeCategory === cat.id
                                                ? "bg-white/15 text-white"
                                                : "bg-navy/8 text-navy"
                                            }`}>
                                            {cat.icon}
                                        </div>
                                        <p className={`font-bold text-[14px] mb-0.5
                                            ${activeCategory === cat.id ? "text-white" : "text-foreground"}`}>
                                            {cat.label}
                                        </p>
                                        <p className={`text-[12px] leading-snug
                                            ${activeCategory === cat.id ? "text-white/65" : "text-muted-foreground"}`}>
                                            {cat.desc}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* ── CATEGORY ARTICLES (when a category is selected) ─────────── */}
                        {isBrowsing && (
                            <section className="mb-14 cp-reveal">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-[17px] tracking-tight">
                                        {CATEGORIES.find((c) => c.id === activeCategory)?.label}
                                    </h3>
                                    <button
                                        onClick={() => setActiveCategory("all")}
                                        className="text-[12px] font-semibold text-muted-foreground
                                            hover:text-navy transition cursor-pointer bg-transparent border-none">
                                        ← Back to all topics
                                    </button>
                                </div>
                                <div className="bg-white border border-border rounded-2xl px-6">
                                    {filtered.map((a) => <ArticleItem key={a.slug} article={a} />)}
                                </div>
                            </section>
                        )}

                        {/* ── POPULAR ARTICLES (shown when no category selected) ───────── */}
                        {!isBrowsing && (
                            <section className="mb-14">
                                <div className="cp-reveal mb-6">
                                    <p className="text-[11px] font-bold tracking-[.18em] uppercase text-navy mb-1">
                                        Most helpful
                                    </p>
                                    <h2 className="font-black text-[clamp(20px,3vw,30px)] leading-tight tracking-tight">
                                        Popular articles
                                    </h2>
                                </div>
                                <div className="cp-reveal bg-white border border-border rounded-2xl px-6">
                                    {popular.map((a) => <ArticleItem key={a.slug} article={a} />)}
                                </div>
                            </section>
                        )}
                    </>
                )}

                {/* ── CONTACT CTA ──────────────────────────────────────────────────── */}
                <section className="cp-reveal">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Email */}
                        <div className="flex items-start gap-4 bg-white border border-border
                            rounded-2xl p-6 hover:shadow-sm transition-shadow">
                            <div className="shrink-0 size-11 rounded-xl bg-navy/8 border border-navy/12
                                flex items-center justify-center text-navy">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <rect x="2" y="4" width="16" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-[15px] mb-1">Email support</p>
                                <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">
                                    Can't find your answer? We usually reply within a few hours.
                                </p>
                                <a href="mailto:classpilot.edu@gmail.com"
                                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy
                                        hover:gap-2.5 transition-all duration-200">
                                    classpilot.edu@gmail.com
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Feedback */}
                        <div className="flex items-start gap-4 bg-yellow/20 border border-yellow/60
                            rounded-2xl p-6 hover:shadow-sm transition-shadow">
                            <div className="shrink-0 size-11 rounded-xl bg-yellow border border-yellow/80
                                flex items-center justify-center text-navy">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M2 4h16v10a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M6 8h8M6 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-[15px] mb-1">Send us feedback</p>
                                <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">
                                    Found a bug or have a feature idea? We read every message.
                                </p>
                                <a href="/contact"
                                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy
                                        hover:gap-2.5 transition-all duration-200">
                                    Share feedback
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                    </div>
                </section>

            </div>
        </main>
    );
}
