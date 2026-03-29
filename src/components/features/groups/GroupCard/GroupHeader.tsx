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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:px-8 border-b border-secondary/50 bg-secondary/10">
      <div className="flex items-center gap-4">
        <div className="size-10 rounded-xl bg-navy flex items-center justify-center text-yellow shadow-lg shadow-navy/10 shrink-0">
          <Users size={18} />
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
          <button
            onClick={() => onEdit(group)}
            className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-navy bg-white border border-border rounded-xl hover:bg-navy hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            onClick={() => onDelete(group)}
            className="inline-flex items-center justify-center size-9 text-red-500 bg-white border border-border rounded-xl hover:bg-red-50 hover:border-red-200 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
