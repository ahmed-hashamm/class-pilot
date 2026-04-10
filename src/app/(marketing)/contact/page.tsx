"use client";

import { MarketingHero } from "@/components/layout";
import { useReveal } from "@/lib/hooks/useReveal";
import { ContactForm, ContactSidebar } from "@/components/features/contact";

export default function ContactPage() {
    useReveal();

    return (
        <main className="bg-background text-foreground font-sans overflow-x-hidden">
            <MarketingHero
                href="/login"
                buttonText="Get Started"
                pageIntro="Contact Us"
                headingStart="We'd love to"
                headingHighlight="hear from you"
                headingEnd=""
                text="Whether it's a question, a bug, or a feature idea — we read every message and reply within a few hours."
            />

            <div className="max-w-5xl mx-auto px-6 py-14">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
                    <div className="cp-reveal bg-white border border-border rounded-2xl overflow-hidden">
                        <ContactForm />
                    </div>
                    <ContactSidebar />
                </div>
            </div>
        </main>
    );
}
