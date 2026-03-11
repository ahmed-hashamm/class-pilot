// import { ClipboardList, FileText, Megaphone } from 'lucide-react'

// export const getFeedIconConfig = (item: any) => {
//   switch (item.type) {
//     case "assignment":
//       return {
//         icon: <ClipboardList size={20} />,
//         color: "bg-orange-500",
//         bg: "bg-orange-50",
//         textColor: "text-orange-700",
//       };

//     case "material":
//       return {
//         icon: <FileText size={20} />,
//         color: "bg-emerald-500", 
//         bg: "bg-emerald-50",
//         textColor: "text-emerald-700",
//       };

//     case "announcement":
//     default:
//       return {
//         icon: <Megaphone size={20} />,
//         color: "bg-purple-500",
//         bg: "bg-purple-50",
//         textColor: "text-purple-700",
//       };
//   }
// };
import { ClipboardList, FileText, Megaphone } from 'lucide-react'

export default function FeedItemIcon({ type }: { type: string }) {
  let icon, color;
  switch (type) {
    case "assignment":
      icon = <ClipboardList size={20} />;
      color = "bg-yellow text-blue-900";       // yellow — high priority, action required
      break;

    case "material":
      icon = <FileText size={20} />;
      color = "bg-navy-light text-white";  // navy-light — informational, reference
      break;

    case "announcement":
    default:
      icon = <Megaphone size={20} />;
      color = "bg-navy/90 text-white";        // navy — authoritative, from teacher
      break;
  }

  return (
    <div className={`shrink-0 size-10 rounded-xl flex items-center justify-center shadow-sm ${color}`}>
      {icon}
    </div>
  );
}