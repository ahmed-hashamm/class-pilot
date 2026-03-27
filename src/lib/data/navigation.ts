import { Home, FileText, ListTodo, Calendar, LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export const DASHBOARD_NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Rubrics", href: "/rubrics", icon: FileText },
  { label: "To-do", href: "/todo", icon: ListTodo },
  { label: "Calendar", href: "/calendar", icon: Calendar },
];

export const MARKETING_NAV_LINKS: NavLink[] = [
  { label: "Solutions", href: "/solutions" },
  { label: "Resources", href: "/resources" },
  { label: "Pricing", href: "/pricing" },
];
