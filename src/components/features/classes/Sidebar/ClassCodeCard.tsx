"use client";

import { useState } from "react";
import { Lock, Copy, CheckCheck, Eye, EyeOff } from "lucide-react";
import SidebarCard from "./Sidebar";

interface ClassCodeCardProps {
  classCode: string;
  isTeacher: boolean;
  isCodeHidden: boolean;
}

export default function ClassCodeCard({
  classCode,
  isTeacher,
  isCodeHidden,
}: ClassCodeCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(classCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SidebarCard title="Class Code">
      {isCodeHidden && !isTeacher ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lock size={13} className="shrink-0" />
            <span className="text-[13px] font-semibold">Code hidden</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            The teacher has disabled the class code. Ask your instructor to share it directly.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2
            bg-secondary border border-border rounded-xl px-4 py-3">
            <span className="font-black text-[20px] tracking-widest text-navy
              font-mono leading-none">
              {classCode}
            </span>
            <button
              onClick={handleCopy}
              className={`shrink-0 inline-flex items-center gap-1.5 text-[12px]
                font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer
                border-none
                ${copied
                  ? 'bg-green-100 text-green-700'
                  : 'bg-navy/8 text-navy hover:bg-navy/15'
                }`}>
              {copied
                ? <><CheckCheck size={12} />Copied!</>
                : <><Copy size={12} />Copy</>
              }
            </button>
          </div>

          {isTeacher && (
            isCodeHidden ? (
              <div className="flex items-center gap-2 bg-yellow/15 border
                border-yellow/40 rounded-lg px-3 py-2">
                <span className="size-1.5 rounded-full bg-yellow animate-pulse" />
                <EyeOff size={11} className="text-navy shrink-0" />
                <p className="text-[11px] font-bold text-navy">
                  Hidden from students
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-50 border
                border-emerald-100 rounded-lg px-3 py-2">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <Eye size={11} className="text-emerald-600 shrink-0" />
                <p className="text-[11px] font-bold text-emerald-600">
                  Visible to students
                </p>
              </div>
            )
          )}
        </div>
      )}
    </SidebarCard>
  );
}
