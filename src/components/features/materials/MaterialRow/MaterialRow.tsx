"use client";

import { Material } from "@/lib/types/schema";
import { CheckCircle2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { useState, useRef, useEffect } from "react";
import MaterialActions from "./MaterialActions";
import MaterialFooter from "./MaterialFooter";

interface MaterialRowProps {
  material: Material;
  isTeacher: boolean;
  isLast?: boolean;
  syncingId: string | null;
  onSync: (id: string) => void;
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
  getDisplayName: (path: string) => string;
}

export default function MaterialRow({
  material,
  isTeacher,
  syncingId,
  onSync,
  onEdit,
  onDelete,
  getDisplayName,
}: MaterialRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const isSyncing = syncingId === material.id;

  useEffect(() => {
    const element = descriptionRef.current;
    if (!element) return;

    const checkTruncation = () => {
      // For line-clamp-1, scrollHeight vs clientHeight is the most reliable check
      // However, we must temporarily remove the clamp to measure true height
      // or just check if scrollHeight > clientHeight while clamped
      const isOverflowing = element.scrollHeight > element.clientHeight;
      setIsTruncated(isOverflowing);
    };

    checkTruncation();

    const observer = new ResizeObserver(checkTruncation);
    observer.observe(element);

    return () => observer.disconnect();
  }, [material.description]);

  return (
    <div className="group relative bg-navy/5 hover:bg-white overflow-hidden
       border rounded-md  hover:shadow-md hover:-translate-y-0.5 transition-all duration-500 border-b-4 border-navy/90 flex flex-col">

      {/* Top glow on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-navy/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full gap-3">
        {/* Header Block */}
        <div className="flex items-start justify-between gap-3 w-full">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <h3 className="font-bold text-[15px] sm:text-[16px] text-foreground tracking-tight leading-snug
              group-hover:text-navy transition-colors line-clamp-1">
              {material.title}
            </h3>

            <div className="flex items-center gap-1.5 text-muted-foreground/35 text-[11px] font-medium">
              <Clock size={10} className="shrink-0" />
              <span>Posted {material.created_at ? format(new Date(material.created_at), "MMM d") : "Recently"}</span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 z-10">
            {material.ai_synced && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-100
                text-emerald-600 text-[9px] font-bold uppercase tracking-wider">
                <CheckCircle2 size={10} className="shrink-0" />
                <span>Synced</span>
              </div>
            )}

            {isTeacher && (
              <MaterialActions
                material={material}
                isSyncing={isSyncing}
                onSync={onSync}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
          </div>
        </div>

        {/* Body Content - Expandable */}
        {material.description && (
          <div
            onClick={() => isTruncated && setIsExpanded(!isExpanded)}
            className={`flex items-start gap-1 ${isTruncated ? 'cursor-pointer group/desc' : ''}`}
          >
            <p
              ref={descriptionRef}
              className={`text-[13px] leading-relaxed text-muted-foreground/50 transition-all duration-300
              ${!isExpanded ? 'line-clamp-1' : ''}`}
            >
              {material.description}
            </p>
            {(isTruncated || isExpanded) && (
              <button className="flex items-center gap-0.5 text-[9px] font-bold text-navy/30 group-hover/desc:text-navy transition-colors tracking-wider whitespace-nowrap mt-1">
                {isExpanded ? (
                  <><ChevronUp size={12} /><span>less</span></>
                ) : (
                  <><ChevronDown size={12} /><span>more</span></>
                )}
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-dashed border-navy/[0.06] pt-3 mt-auto">
          <MaterialFooter material={material} getDisplayName={getDisplayName} />
        </div>
      </div>
    </div>
  );
}
