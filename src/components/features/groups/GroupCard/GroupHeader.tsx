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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 sm:px-8 sm:py-5 border-b border-secondary/50 bg-secondary/10">
      <div className="flex items-center gap-4">
        <div className="size-10 rounded-xl bg-navy flex items-center justify-center text-yellow shadow-lg shadow-navy/10 shrink-0">
          <Users size={18} className="shrink-0" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-black text-[18px] text-foreground tracking-tight group-hover:text-navy transition-colors">{group.title}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-bold text-muted-foreground/60">{group.project_members?.length || 0} Members</span>
          </div>
        </div>
      </div>

      {isTeacher && (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(group)}
            className="px-4 py-2 text-[11px] font-black uppercase tracking-widest shrink-0"
          >
            <Pencil size={12} className="shrink-0" /> Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(group)}
            className="size-9 p-0 shrink-0 border-transparent bg-white text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            <Trash2 size={14} className="shrink-0" />
          </Button>
        </div>
      )}
    </div>
  );
}
