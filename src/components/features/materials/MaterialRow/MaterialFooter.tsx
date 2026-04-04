import Image from "next/image";
import { User, ChevronRight } from "lucide-react";
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
    <div className="flex items-center justify-between gap-4 w-full">
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

      {/* Profile Section - Right side */}
      <div className="flex items-center gap-2 group/author shrink-0">
        <div className="size-8 rounded-full overflow-hidden border border-navy/10 bg-navy/5 flex items-center justify-center text-[11px] font-black text-navy shrink-0 relative shadow-sm">
          {teacher?.avatar_url && !imgError ? (
            <Image 
              src={teacher.avatar_url.startsWith('http') ? teacher.avatar_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${teacher.avatar_url}`}
              alt={teacher.full_name || "Teacher"}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="uppercase">{teacher?.full_name?.charAt(0) || "T"}</span>
          )}
        </div>
        
        <div className="hidden sm:flex items-center gap-1">
          <span className="text-[12px] font-bold text-navy/60 transition-colors group-hover/author:text-navy truncate max-w-[120px] tracking-tight">
            {teacher?.full_name || "Teacher"}
          </span>
          <ChevronRight size={14} className="text-navy/20 group-hover/author:text-navy group-hover/author:translate-x-0.5 transition-all" />
        </div>
      </div>
    </div>
  );
}
