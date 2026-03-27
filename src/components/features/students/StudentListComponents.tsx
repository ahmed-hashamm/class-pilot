"use client";

import { ShieldCheck, GraduationCap, Users } from "lucide-react";

export function MemberSectionHeader({
  role,
  count,
}: {
  role: "teacher" | "student";
  count: number;
}) {
  const isTeacher = role === "teacher";
  return (
    <div className="flex items-center justify-between px-6 py-4
      border-b border-border bg-secondary/50">
      <div className="flex items-center gap-2">
        <div className={`size-8 rounded-xl flex items-center justify-center
          ${isTeacher
            ? "bg-navy"
            : "bg-navy-light/15 border border-navy-light/25"
          }`}>
          {isTeacher ? (
            <ShieldCheck size={15} className="text-yellow" />
          ) : (
            <GraduationCap size={15} className="text-navy-light" />
          )}
        </div>
        <h3 className="font-black text-[16px] tracking-tight">
          {isTeacher ? "Teachers" : "Students"}
        </h3>
      </div>
      <span className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
        {count} {isTeacher ? (count === 1 ? "host" : "hosts") : "enrolled"}
      </span>
    </div>
  );
}

export function StudentsEmptyState({ isTeacher }: { isTeacher: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 py-14 text-center">
      <Users size={24} className="text-muted-foreground/40" />
      <p className="text-[14px] text-muted-foreground font-medium">
        No students have joined yet
      </p>
      {isTeacher && (
        <p className="text-[12px] text-muted-foreground">
          Share the class code so students can join.
        </p>
      )}
    </div>
  );
}

export function MembersLoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      {[1, 2].map((section) => (
        <section key={section} className="bg-white border border-border rounded-2xl overflow-hidden animate-pulse">
          <div className="h-12 bg-secondary/50 border-b border-border px-6 flex items-center justify-between">
             <div className="h-4 bg-muted rounded w-24" />
             <div className="h-3 bg-muted rounded w-16" />
          </div>
          <div className="divide-y divide-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-muted" />
                  <div className="h-3 bg-muted rounded w-32" />
                </div>
                <div className="h-4 w-12 bg-muted rounded-full" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
