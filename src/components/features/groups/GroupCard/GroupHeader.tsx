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
    <div className="flex items-start justify-between gap-3 px-6 py-4 ">
      <div className="flex flex-col min-w-0">
        <h3 className="font-black text-[15px] sm:text-[16px] text-navy uppercase tracking-widest leading-none truncate">
          {group.title}
        </h3>

        {/* Member Count Badge */}
        <div className="flex items-center gap-1.5 mt-2 text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest">
          <Users size={10} className="shrink-0" />
          <span>{group.project_members?.length || 0} members</span>
        </div>
      </div>

      {/* Action Buttons */}
      {isTeacher && (
        <div className="flex items-center gap-1 shrink-0 transition-opacity duration-300">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(group)}
            className="size-7 p-0 rounded-md text-navy/40 hover:text-navy hover:bg-navy/10 transition-all outline-none"
          >
            <Pencil size={12} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(group)}
            className="size-7 p-0 rounded-md text-navy/40 hover:text-red-500 hover:bg-red-50 transition-all outline-none"
          >
            <Trash2 size={12} />
          </Button>
        </div>
      )}
    </div>
  );
}
