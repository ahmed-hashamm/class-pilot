'use client'

import { useState } from "react";
import { Article } from "@/lib/db_data_fetching/supportData";

interface ArticleItemProps {
  article: Article
  defaultOpen?: boolean
}

export function ArticleItem({ article, defaultOpen = false }: ArticleItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-4
          text-left cursor-pointer bg-transparent border-none group"
      >
        <span className={`text-[14px] font-semibold transition-colors
          ${open ? "text-navy" : "text-foreground group-hover:text-navy"}`}>
          {article.title}
        </span>
        <span className={`shrink-0 size-6 rounded-full border flex items-center justify-center
          transition-all duration-200
          ${open ? "bg-navy border-navy" : "bg-transparent border-border"}`}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
            className={`transition-transform duration-200 ${open ? "rotate-45" : ""}`}>
            <path d="M5 1v8M1 5h8" stroke={open ? "white" : "currentColor"}
              strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {open && (
        <p className="text-[14px] text-muted-foreground leading-relaxed pb-5 pr-8">
          {article.answer}
        </p>
      )}
    </div>
  );
}
