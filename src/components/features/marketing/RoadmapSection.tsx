"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface RoadmapSectionProps {
  title: string;
  subtitle: string;
  roadmapItems: string[];
  className?: string;
}

export default function RoadmapSection({ 
  title, 
  subtitle, 
  roadmapItems,
  className 
}: RoadmapSectionProps) {
  return (
    <section className={cn("bg-secondary border-y border-border py-16 px-6", className)}>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="cp-reveal">
            <span className="inline-flex items-center gap-2 bg-yellow text-navy text-[10px]
              font-bold tracking-widest uppercase rounded-full px-3 py-1 mb-4">
              On the roadmap
            </span>
            <h2 className="font-black text-[clamp(24px,3.5vw,38px)] leading-tight
              tracking-tight mb-5 text-foreground">
              {title}
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="cp-reveal bg-white border border-border rounded-2xl p-8 shadow-sm"
            style={{ transitionDelay: "0.15s" }}>
            <p className="text-[11px] font-bold tracking-[.18em] uppercase
              text-muted-foreground mb-6">
              Features we're working on
            </p>
            <ul className="flex flex-col gap-4">
              {roadmapItems.map((item, i) => (
                <li 
                  key={i} 
                  className="flex items-center gap-3.5 text-[14px] text-muted-foreground group"
                  style={{ transitionDelay: `${i * 0.05}s` }}
                >
                  <span className="shrink-0 size-5 rounded-full border-2 border-dashed
                    border-border flex items-center justify-center group-hover:border-navy/30 transition-colors">
                    <span className="size-1.5 rounded-full bg-muted-foreground/30 group-hover:bg-navy/40" />
                  </span>
                  <span className="group-hover:text-foreground transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
