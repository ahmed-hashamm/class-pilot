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
      {isCodeHidden ? (
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

          {isTeacher && isCodeHidden && (
            <div className="flex items-center gap-2 bg-yellow/15 border
              border-yellow/40 rounded-lg px-3 py-2">
              <EyeOff size={12} className="text-navy shrink-0" />
              <p className="text-[11px] font-semibold text-navy">
                Hidden from students
              </p>
            </div>
          )}

          {isTeacher && !isCodeHidden && (
            <div className="flex items-center gap-2 bg-secondary border
              border-border rounded-lg px-3 py-2">
              <Eye size={12} className="text-muted-foreground shrink-0" />
              <p className="text-[11px] font-medium text-muted-foreground">
                Visible to students
              </p>
            </div>
          )}
        </div>
      )}
    </SidebarCard>
  );
}
