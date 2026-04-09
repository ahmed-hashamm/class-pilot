"use client";

import { cn } from "@/lib/utils";
import { 
  PricingCard, 
  FaqSection, 
  RoadmapSection 
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
      {/* Hero Section */}
      <section className="px-6 pt-24 pb-16 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="cp-reveal inline-flex items-center gap-2 bg-navy/5 border border-navy/10 px-4 py-1.5 rounded-full">
            <span className="size-2 rounded-full bg-navy animate-pulse" />
            <span className="text-[11px] font-bold text-navy tracking-wider uppercase">
              Early Access Pricing
            </span>
          </div>
          
          <h1 className="cp-reveal font-black text-[clamp(42px,6vw,72px)] leading-[0.9] tracking-tighter text-foreground">
            Simple, honest <br />
            <span className="text-navy">classroom tools.</span>
          </h1>
          
          <p className="cp-reveal text-[17px] text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            style={{ transitionDelay: "0.1s" }}>
            Class Pilot is currently free for all teachers and students. 
            We're building the future of classroom management, one feature at a time.
          </p>
        </div>
      </section>

      {/* Pricing Card Section */}
      <section className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <PricingCard 
            planName="Class Pilot"
            price="£0"
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
      <section className="px-6 py-24 text-center">
        <div className="cp-reveal max-w-2xl mx-auto bg-navy rounded-3xl p-12 shadow-2xl shadow-navy/20">
          <h2 className="text-3xl font-black text-white mb-4">
            Ready to transform your classroom?
          </h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Join thousands of teachers already using Class Pilot to save time and engage students.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="/auth/register"
              className="w-full sm:w-auto bg-white text-navy font-bold px-10 py-4 rounded-xl transition-transform hover:-translate-y-1"
            >
              Sign up for free
            </a>
            <a 
              href="/contact"
              className="w-full sm:w-auto bg-navy/50 text-white font-bold border border-white/20 px-10 py-4 rounded-xl transition-all hover:bg-navy/70"
            >
              Contact support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
