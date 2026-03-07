import { ClipboardList, FileText, Megaphone } from 'lucide-react'

export const getFeedIconConfig = (item: any) => {
  switch (item.type) {
    case "assignment":
      return {
        icon: <ClipboardList size={20} />,
        color: "bg-orange-500",
        bg: "bg-orange-50",
        textColor: "text-orange-700",
      };

    case "material":
      return {
        icon: <FileText size={20} />,
        color: "bg-emerald-500", 
        bg: "bg-emerald-50",
        textColor: "text-emerald-700",
      };

    case "announcement":
    default:
      return {
        icon: <Megaphone size={20} />,
        color: "bg-purple-500",
        bg: "bg-purple-50",
        textColor: "text-purple-700",
      };
  }
};