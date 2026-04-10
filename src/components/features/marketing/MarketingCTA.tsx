"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MarketingCTAProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  className?: string;
}

export default function MarketingCTA({
  title = "Ready to transform your classroom?",
  description = "Join thousands of teachers already using Class Pilot to save time and engage students.",
  primaryButtonText = "Sign up for free",
  primaryButtonHref = "/auth/register",
  secondaryButtonText = "Contact support",
  secondaryButtonHref = "/contact",
  className,
}: MarketingCTAProps) {
  return (
    <section className={cn("px-6 py-24 text-center", className)}>
      <div className="cp-reveal max-w-2xl mx-auto bg-navy rounded-3xl p-12 shadow-2xl shadow-navy/20">
        <h2 className="text-3xl font-black text-white mb-4">
          {title}
        </h2>
        <p className="text-white/70 mb-8 max-w-md mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={primaryButtonHref}
            className="w-full sm:w-auto bg-white text-navy font-bold px-10 py-4 rounded-xl transition-transform hover:-translate-y-1"
          >
            {primaryButtonText}
          </Link>
          <Link
            href={secondaryButtonHref}
            className="w-full sm:w-auto bg-navy/50 text-white font-bold border border-white/20 px-10 py-4 rounded-xl transition-all hover:bg-navy/70"
          >
            {secondaryButtonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
