"use client";

import { useState, useMemo } from "react";
import { MarketingHero } from "@/components/layout";
import { useReveal } from "@/lib/hooks/useReveal";
import { ARTICLES, CATEGORIES, CategoryId } from "@/lib/db_data_fetching/supportData";
import { ArticleItem, CategoryGrid, HelpContactCards } from "@/components/features/help";

export default function HelpCenterPage() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<CategoryId | "all">("all");

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
            <MarketingHero
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
                        <section className="mb-14">
                            <div className="cp-reveal mb-6">
                                <p className="text-[11px] font-bold tracking-[.18em] uppercase text-navy mb-1">
                                    Browse by topic
                                </p>
                                <h2 className="font-black text-[clamp(20px,3vw,30px)] leading-tight tracking-tight">
                                    What do you need help with?
                                </h2>
                            </div>
                            <CategoryGrid activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
                        </section>

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

                <section className="cp-reveal">
                    <HelpContactCards />
                </section>
            </div>
        </main>
    );
}
