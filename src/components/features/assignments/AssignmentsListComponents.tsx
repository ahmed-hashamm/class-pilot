"use client";

import Link from "next/link";
import { ClipboardList, Plus, RefreshCw } from "lucide-react";
import { FeatureButton } from "@/components/ui";

export function AssignmentsHeader({
  isTeacher,
  classId,
}: {
  isTeacher: boolean;
  classId: string;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-navy flex items-center justify-center">
          <ClipboardList size={17} className="text-yellow" />
        </div>
        <div>
          <h2 className="font-black text-[18px] tracking-tight">Assignments</h2>
          <p className="text-[13px] text-muted-foreground">Coursework and evaluative materials</p>
        </div>
      </div>

      {isTeacher && (
        <Link href={`/classes/${classId}/assignments/create`}>
          <FeatureButton
            label="Create assignment"
            icon={Plus}
          />
        </Link>
      )}
    </div>
  );
}

export function AssignmentsEmptyState({ isTeacher, classId }: { isTeacher: boolean; classId: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3
      py-16 border-2 border-dashed border-border rounded-2xl bg-white text-center">
      <div className="size-14 rounded-2xl bg-navy/8 border border-navy/15
        flex items-center justify-center">
        <ClipboardList size={24} className="text-navy/40" />
      </div>
      <p className="font-bold text-[16px] tracking-tight">No assignments yet</p>
      <p className="text-[13px] text-muted-foreground max-w-xs leading-relaxed">
        {isTeacher
          ? 'Create your first assignment for students to complete.'
          : 'Your teacher has not posted any assignments yet.'}
      </p>
      {isTeacher && (
        <Link href={`/classes/${classId}/assignments/create`}>
          <FeatureButton
            label="Create first assignment"
            icon={Plus}
            className="mt-2"
          />
        </Link>
      )}
    </div>
  );
}

export function AssignmentsLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-border rounded-2xl overflow-hidden animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`flex items-start gap-4 p-5 ${i < 3 ? "border-b border-border" : ""}`}>
            <div className="shrink-0 size-11 rounded-xl bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
