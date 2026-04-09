"use client";

import { CookieGroup as CookieGroupType } from "@/lib/data/marketing/cookies";

interface CookieGroupProps {
  group: CookieGroupType;
}

export default function CookieGroup({ group }: CookieGroupProps) {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:border-navy/20">
      <div className={`flex items-center gap-2 px-4 py-2.5 ${group.colour}`}>
        <span className="font-bold text-[13px]">{group.type}</span>
      </div>
      <div className="p-4">
        <p className="text-[13px] text-muted-foreground mb-4 leading-relaxed">{group.desc}</p>
        <div className="flex flex-col gap-3.5">
          {group.items.map((item) => (
            <div key={item.name} className="flex items-start gap-3 group">
              <code className="shrink-0 text-[11px] font-mono font-bold bg-secondary
                border border-border rounded px-2 py-0.5 text-navy mt-0.5 group-hover:border-navy/20 transition-colors">
                {item.name}
              </code>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {item.purpose}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
