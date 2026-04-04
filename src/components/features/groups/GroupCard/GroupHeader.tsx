import { Button } from "@/components/ui/button";
import { UserPlus, Pencil, Trash2, Users } from "lucide-react";
import { Group } from "@/lib/types/schema";

interface GroupHeaderProps {
  group: Group;
  isTeacher: boolean;
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
}

export default function GroupHeader({ group, isTeacher, onEdit, onDelete }: GroupHeaderProps) {
  return (
    <div className="flex flex-col gap-4 p-6 sm:p-8 pb-4">
      {/* Group Title & Info Badges */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
          <h3 className="font-black text-[20px] sm:text-[22px] text-foreground tracking-tighter leading-tight group-hover:text-navy transition-colors">
            {group.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {/* Member Count Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy/[0.03] border border-black/[0.03] text-navy/50 text-[11px] font-bold">
              <Users size={12} className="shrink-0 opacity-60" />
              <span>{group.project_members?.length || 0} Members</span>
            </div>

            {/* Project Status/Type Badge */}
            {/* <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/10 text-yellow-700 text-[11px] font-bold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-500"></span>
              </span>
              <span>Active Group</span>
            </div> */}
          </div>
        </div>

        {/* Action Buttons */}
        {isTeacher && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(group)}
              className="size-9 p-0 rounded-xl bg-navy/[0.03] border-transparent transition-all duration-300 hover:bg-navy/10 hover:text-navy"
            >
              <Pencil size={14} />
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(group)}
              className="size-9 p-0 rounded-xl bg-red-50 text-red-500 border-transparent transition-all duration-300 hover:bg-red-500 hover:text-white"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
