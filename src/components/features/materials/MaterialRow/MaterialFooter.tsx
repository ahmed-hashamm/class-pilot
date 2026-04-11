import Image from "next/image";
import { ChevronRight } from "lucide-react";
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
    <div className="flex items-center justify-between gap-3 w-full">
      <div className="flex flex-wrap gap-1.5 min-w-0">
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

      {/* Teacher avatar */}
      <div className="flex items-center gap-1.5 group/author shrink-0">
        <div className="size-6 rounded-lg overflow-hidden border border-navy/[0.06] bg-navy/5 flex items-center justify-center
          text-[9px] font-black text-navy shrink-0 relative">
          {teacher?.avatar_url && !imgError ? (
            <Image 
              src={teacher.avatar_url.startsWith('http') ? teacher.avatar_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${teacher.avatar_url}`}
              alt={teacher.full_name || "Teacher"}
              fill
              sizes="24px"
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="uppercase">{teacher?.full_name?.charAt(0) || "T"}</span>
          )}
        </div>
        
        <span className="hidden sm:block text-[11px] font-semibold text-navy/40 group-hover/author:text-navy transition-colors
          truncate max-w-[100px]">
          {teacher?.full_name || "Teacher"}
        </span>
      </div>
    </div>
  );
}
