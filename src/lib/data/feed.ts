import { Megaphone, FileUp, BarChart2, CheckSquare, ClipboardList, UserCheck, LucideIcon, FilePlusCorner, Vote, ChartColumn, UserRoundCheck } from "lucide-react";

export interface FeedAction {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const FEED_ACTIONS: FeedAction[] = [
  { id: "announcement", label: "Announcement", icon: Megaphone },
  { id: "material", label: "Material", icon: FilePlusCorner },
  { id: "poll", label: "Poll", icon: Vote },
  { id: "attendance", label: "Attendance", icon: UserCheck },
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

export interface FeedItemTheme {
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
}

export const FEED_ITEM_THEMES: Record<string, FeedItemTheme> = {
  announcement: {
    icon: Megaphone,
    bgColor: "bg-navy",
    iconColor: "text-white"
  },
  assignment: {
    icon: ClipboardList,
    bgColor: "bg-navy",
    iconColor: "text-white"
  },
  material: {
    icon: FilePlusCorner,
    bgColor: "bg-navy",
    iconColor: "text-white"
  },
  poll: {
    icon: ChartColumn,
    bgColor: "bg-navy",
    iconColor: "text-white"
  },
  attendance: {
    icon: UserRoundCheck,
    bgColor: "bg-navy",
    iconColor: "text-white"
  },
};

export const FEED_TYPE_MESSAGES: Record<string, string> = {
  announcement: "This action cannot be undone. All students will lose access to this announcement.",
  assignment: "This will permanently delete the assignment and all student submissions.",
  material: "This will remove the material from the stream. Files will remain in storage.",
  poll: "This will permanently close and delete this poll and all its responses.",
  attendance: "This will delete the attendance session and all student records for this date.",
};
