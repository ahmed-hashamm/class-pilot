'use client'

import { CATEGORIES, CategoryId } from "@/lib/db_data_fetching/supportData";

interface CategoryGridProps {
  activeCategory: CategoryId | "all"
  setActiveCategory: (id: CategoryId | "all") => void
}

export function CategoryGrid({ activeCategory, setActiveCategory }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {CATEGORIES.map((cat, i) => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(
            activeCategory === cat.id ? "all" : cat.id
          )}
          className={`cp-reveal text-left p-5 rounded-xl border transition-all duration-200
            cursor-pointer group
            ${activeCategory === cat.id
              ? "bg-navy border-navy text-white"
              : "bg-white border-border hover:border-navy/30 hover:shadow-sm"
            }`}
          style={{ transitionDelay: `${i * 0.05}s` }}>
          <div className={`size-10 rounded-lg flex items-center justify-center mb-3
            transition-colors
            ${activeCategory === cat.id
              ? "bg-white/15 text-white"
              : "bg-navy/8 text-navy"
            }`}>
            {cat.icon}
          </div>
          <p className={`font-bold text-[14px] mb-0.5
            ${activeCategory === cat.id ? "text-white" : "text-foreground"}`}>
            {cat.label}
          </p>
          <p className={`text-[12px] leading-snug
            ${activeCategory === cat.id ? "text-white/65" : "text-muted-foreground"}`}>
            {cat.desc}
          </p>
        </button>
      ))}
    </div>
  );
}
