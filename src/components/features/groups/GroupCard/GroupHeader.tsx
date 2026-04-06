import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Users } from "lucide-react";
import { Group } from "@/lib/types/schema";

interface GroupHeaderProps {
  group: Group;
  isTeacher: boolean;
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
}

export default function GroupHeader({ group, isTeacher, onEdit, onDelete }: GroupHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 p-5">
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <h3 className="font-bold text-[15px] sm:text-[16px] text-foreground tracking-tight leading-snug
          group-hover:text-navy transition-colors line-clamp-1">
          {group.title}
        </h3>

        {/* Member Count Badge */}
        <div className="flex items-center gap-1 text-muted-foreground/35 text-[11px] font-medium">
          <Users size={10} className="shrink-0" />
          <span>{group.project_members?.length || 0} members</span>
        </div>
      </div>

      {/* Action Buttons */}
      {isTeacher && (
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(group)}
            className="size-8 p-0 rounded-lg bg-secondary/60 border-transparent transition-all duration-200
              hover:bg-navy/10 hover:text-navy"
          >
            <Pencil size={13} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(group)}
            className="size-8 p-0 rounded-lg bg-red-50/60 text-red-400 border-transparent transition-all duration-200
              hover:bg-red-500 hover:text-white"
          >
            <Trash2 size={13} />
          </Button>
        </div>
      )}
    </div>
  );
}
