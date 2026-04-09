"use client";

import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

interface Feature {
  iconName: string;
  title: string;
  desc: string;
}

interface PricingCardProps {
  planName: string;
  price: string;
  priceSub: string;
  features: Feature[];
  ctaText: string;
  ctaHref: string;
  footerText: string;
  badgeText?: string;
  className?: string;
}

export default function PricingCard({
  planName,
  price,
  priceSub,
  features,
  ctaText,
  ctaHref,
  footerText,
  badgeText,
  className
}: PricingCardProps) {
  return (
    <div className={cn("cp-reveal relative bg-white border-2 border-navy rounded-2xl overflow-hidden shadow-xl", className)}>
      {/* Top Header Section */}
      <div className="bg-navy px-8 py-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          {badgeText && (
            <span className="inline-flex items-center gap-2 bg-yellow text-navy text-[10px]
              font-bold tracking-widest uppercase rounded-full px-3 py-1 mb-2.5">
              {badgeText}
            </span>
          )}
          <h2 className="font-black text-white text-[32px] leading-none tracking-tight">
            {planName}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-[48px] font-black text-white leading-none tracking-tighter">
            {price}
          </p>
          <p className="text-white/40 text-[13px] font-medium mt-1 uppercase tracking-wider">
            {priceSub}
          </p>
        </div>
      </div>

      {/* Features Content */}
      <div className="p-8">
        <p className="text-[11px] font-bold tracking-[.18em] uppercase text-muted-foreground mb-8">
          Everything included
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          {features.map((feature, i) => {
            // Dynamically resolve icon from iconName string
            const Icon = (Icons as any)[
              feature.iconName.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join("")
            ] || Icons.HelpCircle;

            return (
              <div 
                key={i} 
                className="flex items-start gap-4 transition-transform hover:translate-x-1"
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <div className="shrink-0 size-10 rounded-xl bg-navy/5 border border-navy/10
                  flex items-center justify-center text-navy transition-colors group-hover:bg-navy/10">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-bold text-[15px] text-foreground mb-0.5 leading-tight">
                    {feature.title}
                  </p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button & Disclaimer */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row
          items-center justify-between gap-6">
          <p className="text-[14px] text-muted-foreground font-medium">
            {footerText}
          </p>
          <a 
            href={ctaHref}
            className="shrink-0 inline-flex items-center gap-2.5 bg-navy text-white
              font-bold text-[14px] px-8 py-3.5 rounded-xl transition-all
              hover:bg-navy/90 hover:-translate-y-1 shadow-lg shadow-navy/10"
          >
            {ctaText}
            <Icons.ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
