import { PlayCircle, Users, ClipboardList, Users2, Database, Settings, LucideIcon } from "lucide-react";

export interface ClassTab {
  id: string;
  label: string;
  icon: LucideIcon;
  hide?: boolean;
  onClick?: () => void;
}

export const CLASS_TABS: (isTeacher: boolean, onManageClick: () => void) => ClassTab[] = (isTeacher, onManageClick) => [
  { id: "stream",    label: "Stream",    icon: PlayCircle    },
  { id: "people",    label: "People",    icon: Users         },
  { id: "work",      label: "Work",      icon: ClipboardList },
  { id: "groups",    label: "Groups",    icon: Users2        },
  { id: "materials", label: "Materials", icon: Database      },
  {
    id: "manage",
    label: "Manage",
    icon: Settings,
    hide: !isTeacher,
    onClick: onManageClick,
  },
];
