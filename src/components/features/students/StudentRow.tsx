"use client";

import { StudentAvatar } from "./StudentAvatar";
import { Mail } from "lucide-react";

interface StudentRowProps {
  member: any;
  role: "teacher" | "student";
}

export default function StudentRow({ member, role }: StudentRowProps) {
  const name = member.users?.full_name || member.users?.email || "Unknown";
  const email = member.users?.email;
  const avatar = member.users?.avatar_url;

  return (
    <div className="flex items-center justify-between gap-4 px-6 py-3.5
      hover:bg-secondary/40 transition-colors group">
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Avatar */}
        <StudentAvatar 
          name={name}
          src={avatar}
          role={role}
        />

        {/* Name + email */}
        <div className="min-w-0">
          <p className="font-semibold text-[14px] text-foreground truncate
            group-hover:text-navy transition-colors">
            {name}
          </p>
          {email && (
            <p className="flex items-center gap-1 text-[12px] text-muted-foreground truncate">
              <Mail size={11} />
              {email}
            </p>
          )}
        </div>
      </div>

      {/* Role badge */}
      <span className={`shrink-0 text-[10px] font-bold tracking-widest uppercase
        rounded-full px-2.5 py-0.5 border
        ${role === "teacher"
          ? "bg-navy/8 text-navy border-navy/15"
          : "bg-navy-light/10 text-navy-light border-navy-light/20"
        }`}>
        {role}
      </span>
    </div>
  );
}
