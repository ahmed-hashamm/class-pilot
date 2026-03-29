import { format } from "date-fns";
import { Clock } from "lucide-react";
import { Material } from "@/lib/types/schema";

interface MaterialHeaderProps {
  material: Material;
}

export default function MaterialHeader({ material }: MaterialHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5 text-[12px] text-muted-foreground font-semibold">
      <div className="flex items-center gap-1.5">
        <Clock size={12} className="opacity-40" />
        <span>{material.created_at ? format(new Date(material.created_at), "MMM d, yyyy") : "No date"}</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <span className="text-border font-extrabold hidden sm:inline ml-0.5">·</span>
        <span className="font-medium text-muted-foreground/70 truncate max-w-[150px]">
          {material.users?.full_name || "Teacher"}
        </span>
      </div>
    </div>
  );
}
