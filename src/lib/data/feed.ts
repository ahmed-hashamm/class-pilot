import { Megaphone, FileUp, BarChart2, CheckSquare, LucideIcon } from "lucide-react";

export interface FeedAction {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const FEED_ACTIONS: FeedAction[] = [
  { id: "announcement", label: "Announcement", icon: Megaphone },
  { id: "material", label: "Material", icon: FileUp },
  { id: "poll", label: "Poll", icon: BarChart2 },
  { id: "attendance", label: "Attendance", icon: CheckSquare },
];

export const FEED_TYPE_LABELS: Record<string, string> = {
  announcement: "Announcement",
  assignment: "Assignment",
  material: "Material",
  poll: "Poll",
  attendance: "Attendance",
};

export const FEED_TYPE_PILLS: Record<string, string> = {
  announcement: "bg-navy/8 text-navy border-navy/15",
  assignment: "bg-yellow/20 text-navy border-yellow/40",
  material: "bg-navy-light/12 text-navy-light border-navy-light/25",
  poll: "bg-purple-500/10 text-purple-600 border-purple-500/25",
  attendance: "bg-green-500/10 text-green-600 border-green-500/25",
};
