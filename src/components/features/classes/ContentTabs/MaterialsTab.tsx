"use client";

import { useState } from "react";
import MaterialsList from "@/components/features/materials/MaterialsList";
import { DiscussionPanel } from "@/components/features/discussions";
import { PageHeader, FeatureButton } from "@/components/ui";
import { Database, Plus, X } from "lucide-react";

interface MaterialsTabProps {
  classId: string;
  isTeacher: boolean;
  userId: string;
}

export default function MaterialsTab({ classId, isTeacher, userId }: MaterialsTabProps) {
  const [isUploading, setIsUploading] = useState(false);

  const HeaderAction = isTeacher ? (
    <FeatureButton
      label={isUploading ? "Close" : "Upload material"}
      icon={isUploading ? X : Plus}
      variant={isUploading ? "outline" : "primary"}
      onClick={() => setIsUploading(!isUploading)}
      className={isUploading ? "bg-muted" : ""}
    />
  ) : null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        icon={Database} 
        title="Class Materials" 
        description="Lecture notes, slides, and shared references."
        action={HeaderAction}
      />

      <div className="flex gap-10 items-start">
        <div className="flex-1 min-w-0">
          <MaterialsList
            classId={classId}
            isTeacher={isTeacher}
            userId={userId}
            hideHeader={true}
            externalUploading={isUploading}
            onExternalUploadToggle={() => setIsUploading(!isUploading)}
          />
        </div>

        {/* Discussion Board - Wider, no box */}
        <div className="hidden lg:block w-[450px] shrink-0 sticky top-8 pt-6">
          <DiscussionPanel
            classId={classId}
            topic="materials"
            userId={userId}
            isTeacher={isTeacher}
          />
        </div>
      </div>
    </div>
  );
}
