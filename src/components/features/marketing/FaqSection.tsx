"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FaqItemProps {
  q: string;
  a: string;
}

function FaqItem({ q, a }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left
          cursor-pointer bg-transparent border-none group transition-colors"
      >
        <span className={cn(
          "font-semibold text-[15px] transition-colors",
          open ? "text-navy" : "text-foreground group-hover:text-navy"
        )}>
          {q}
        </span>
        <span className={cn(
          "shrink-0 size-7 rounded-full border border-border flex items-center justify-center transition-all duration-300",
          open ? "bg-navy border-navy text-white" : "bg-transparent group-hover:border-navy/30"
        )}>
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none"
            className={cn("transition-transform duration-300", open ? "rotate-45" : "")}
          >
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div className={cn(
        "grid transition-all duration-300 ease-in-out",
        open ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
      )}>
        <p className="text-[14px] text-muted-foreground leading-relaxed max-w-2xl overflow-hidden">
          {a}
        </p>
      </div>
    </div>
  );
}

interface FaqSectionProps {
  faqs: Array<{ q: string; a: string }>;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function FaqSection({ 
  faqs, 
  title = "Frequently Asked Questions", 
  subtitle = "Questions you might have about our pricing and services",
  className 
}: FaqSectionProps) {
  return (
    <section className={cn("px-6 py-16", className)}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 cp-reveal">
          <p className="text-[11px] font-bold tracking-[.18em] uppercase text-navy mb-2">FAQ</p>
          <h2 className="font-black text-[clamp(24px,3.5vw,38px)] leading-tight tracking-tight text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-[15px] text-muted-foreground max-w-md mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        <div className="cp-reveal bg-white border border-border rounded-2xl px-8 shadow-sm">
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
