"use client";

import { MarketingHero } from "@/components/layout";
import {
  PricingCard,
  FaqSection,
  RoadmapSection,
  MarketingCTA
} from "@/components/features/marketing";
import {
  FREE_FEATURES,
  FUTURE_FEATURES,
  FAQS
} from "@/lib/data/marketing/pricing";
import { useReveal } from "@/lib/hooks/useReveal";

export default function PricingPage() {
  useReveal();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header (navy) */}
      <MarketingHero
        pageIntro="Early Access Pricing"
        href="/auth/register"
        buttonText="Get started for free"
        headingStart="Simple, honest"
        headingHighlight="classroom tools"
        text="Class Pilot is currently free for all teachers and students. 
            We're building the future of classroom management, one feature at a time."
      />

      {/* Pricing Card Section */}
      <section className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <PricingCard
            planName="Class Pilot"
            price="$0"
            priceSub="For teachers & students"
            features={FREE_FEATURES}
            ctaText="Get started for free"
            ctaHref="/auth/register"
            footerText="No credit card required. Setup in 60 seconds."
            badgeText="Early Access"
          />
        </div>
      </section>

      {/* Future Roadmap Section */}
      <RoadmapSection
        title="We're just getting started."
        subtitle="Our mission is to make advanced classroom technology accessible to every teacher. We're constantly adding new features based on teacher feedback."
        roadmapItems={FUTURE_FEATURES}
      />

      {/* FAQ Section */}
      <FaqSection faqs={FAQS} />

      {/* Final CTA */}
      <MarketingCTA />
    </div>
  );
}
