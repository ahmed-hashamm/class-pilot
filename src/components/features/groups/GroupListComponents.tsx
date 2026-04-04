import { Users2, Plus } from "lucide-react";
import { FeatureButton } from "@/components/ui/FeatureButton";

export function GroupHeader({
  isTeacher,
  onNewGroup,
}: {
  isTeacher: boolean;
  onNewGroup: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xxl bg-navy flex items-center justify-center">
          <Users2 size={17} className="text-yellow" />
        </div>
        <div>
          <h2 className="font-black text-[18px] tracking-tight">Collaboration Groups</h2>
          <p className="text-[13px] text-muted-foreground">Manage student teams</p>
        </div>
      </div>
      {isTeacher && (
        <FeatureButton
          onClick={onNewGroup}
          label="New group"
          icon={Plus}
          className="px-5 py-2.5"
        />
      )}
    </div>
  );
}

export function GroupEmptyState({
  isTeacher,
  onNewGroup,
}: {
  isTeacher: boolean;
  onNewGroup: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3
      py-16 border-2 border-dashed border-border rounded-2xl bg-white text-center">
      <div className="size-14 rounded-xl bg-navy/8 border border-navy/15
        flex items-center justify-center">
        <Users2 size={24} className="text-navy/40" />
      </div>
      <p className="font-bold text-[16px] tracking-tight">No groups yet</p>
      <p className="text-[13px] text-muted-foreground max-w-xs leading-relaxed">
        {isTeacher
          ? "Create a group and assign students to collaborate on projects."
          : "Your teacher hasn't created any groups yet."}
      </p>
      {isTeacher && (
        <FeatureButton
          onClick={onNewGroup}
          label="Create first group"
          icon={Plus}
          className="mt-2 px-5 py-2.5"
        />
      )}
    </div>
  );
}
