"use client";

import { Database, Plus, X } from "lucide-react";
import { FeatureButton } from "@/components/ui/FeatureButton";
import { Button } from "@/components/ui/button";

export function MaterialsHeader({
  isTeacher,
  isUploading,
  onToggleUpload,
}: {
  isTeacher: boolean;
  isUploading: boolean;
  onToggleUpload: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-navy flex items-center justify-center">
          <Database size={17} className="text-yellow" />
        </div>
        <div>
          <h2 className="font-black text-[18px] tracking-tight">Class Materials</h2>
          <p className="text-[13px] text-muted-foreground">Shared documents and resources</p>
        </div>
      </div>

      {isTeacher && (
        <FeatureButton
          onClick={onToggleUpload}
          variant={isUploading ? "secondary" : "primary"}
          className="px-5 py-2.5"
          label={isUploading ? "Close" : "Upload material"}
          icon={isUploading ? X : Plus}
        />
      )}
    </div>
  );
}

export function MaterialsEmptyState({
  isTeacher,
  onToggleUpload,
}: {
  isTeacher: boolean;
  onToggleUpload: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3
      py-16 border-2 border-dashed border-border rounded-2xl bg-white text-center">
      <div className="size-14 rounded-2xl bg-navy/8 border border-navy/15
        flex items-center justify-center">
        <Database size={24} className="text-navy/40" />
      </div>
      <p className="font-bold text-[16px] tracking-tight">No materials yet</p>
      <p className="text-[13px] text-muted-foreground max-w-xs leading-relaxed">
        {isTeacher
          ? "Upload documents, slides, or files for your students to access."
          : "Your teacher has not uploaded any materials yet."}
      </p>
      {isTeacher && (
        <FeatureButton
          onClick={onToggleUpload}
          className="mt-2 px-5 py-2.5"
          label="Upload first material"
          icon={Plus}
        />
      )}
    </div>
  );
}

export function MaterialsLoadingSkeleton() {
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
