import Image from "next/image";
import { User } from "lucide-react";
import AttachmentButton from "@/components/features/classes/buttons/AttachmentButton";
import { Material } from "@/lib/types/schema";
import { useState } from "react";

interface MaterialFooterProps {
  material: Material;
  getDisplayName: (path: string) => string;
}

export default function MaterialFooter({ material, getDisplayName }: MaterialFooterProps) {
  const [imgError, setImgError] = useState(false);
  const teacher = material.users;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-secondary/50">
      <div className="flex flex-wrap gap-2 min-w-0">
        {Array.isArray(material.attachment_paths) ? (
          material.attachment_paths.map((path: string) => (
            <AttachmentButton
              key={path}
              path={path}
              type="material"
              label={getDisplayName(path)}
            />
          ))
        ) : material.file_url ? (
          <AttachmentButton
            path={material.file_url}
            type="material"
            label={getDisplayName(material.file_url)}
          />
        ) : null}
      </div>

      <div className="hidden sm:flex items-center gap-2 group/author shrink-0 sm:ml-auto sm:pr-1.5">
        <div className="size-6 rounded-lg overflow-hidden border border-border bg-secondary flex items-center justify-center text-[10px] font-black text-navy shrink-0 relative">
          {teacher?.avatar_url && !imgError ? (
            <Image
              src={teacher.avatar_url.startsWith('http') ? teacher.avatar_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${teacher.avatar_url}`}
              alt={teacher.full_name || "Teacher"}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : teacher?.full_name?.charAt(0) || <User size={12} />}
        </div>
        <span className="text-[11px] font-bold text-muted-foreground/60 transition-colors group-hover/author:text-navy truncate max-w-[150px]">
          {teacher?.full_name || "Teacher"}
        </span>
      </div>
    </div>
  );
}
