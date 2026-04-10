"use client";

import { MarketingHero } from "@/components/layout";
import { MarketingCTA } from "@/components/features/marketing";
import { useReveal } from "@/lib/hooks/useReveal";
import { STATS } from "@/lib/db_data_fetching/marketingData";
import {
    HowItWorksSteps,
    Differentiators,
    AssistantSpotlight,
    CollabSpotlight
} from "@/components/features/how-it-works";

export default function HowItWorks() {
    useReveal();

    return (
        <main className="bg-background text-foreground font-sans overflow-x-hidden">
            <MarketingHero
                pageIntro="How It Works"
                href="/login"
                buttonText="Get started free"
                headingStart="Your classroom,"
                headingHighlight="smarter"
                text="Teaching tips, AI in education, product news, and study strategies — written by teachers and the Class Pilot team."
            />

            <HowItWorksSteps />

            <div className="bg-navy py-16 px-6 text-center cp-reveal">
                <p className="font-bold italic text-[clamp(18px,3vw,30px)] leading-snug max-w-2xl mx-auto mb-4 text-white/90">
                    "I used to spend hours everyday marking. Now it takes a fraction of the time and the feedback is more specific."
                </p>
                <p className="text-sm text-white/50">
                    <span className="text-yellow font-semibold">Mam Amna</span> · Ai & Ml Professor
                </p>
            </div>

            <Differentiators />
            <AssistantSpotlight />
            <CollabSpotlight />

            <section className="bg-navy py-20">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <div className="cp-reveal mb-12">
                        <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-yellow mb-2">The impact</p>
                        <h2 className="font-black text-[clamp(26px,4vw,44px)] leading-tight tracking-tight text-white">Numbers that matter</h2>
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

            <MarketingCTA
                title="Your class is live in under two minutes."
                description="Create your class, invite your students, and post your first assignment today. Free to try, no credit card needed."
                primaryButtonText="Create your free class"
                primaryButtonHref="/login"
                className="bg-secondary/50"
            />
        </main>
    );
}
