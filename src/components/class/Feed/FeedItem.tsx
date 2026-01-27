// 'use client'

// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { format } from 'date-fns'
// import { 
//   Megaphone, 
//   CalendarClock, 
//   FileText, 
//   Pin,
//   Clock 
// } from 'lucide-react'

// interface FeedItemProps {
//   title: string
//   content: string
//   type: 'announcement' | 'assignment'
//   created_at: string
//   pinned?: boolean
//   deadline?: string | null     // Added for logic
//   attachment_path?: string | null // Added for logic
//   author?: { full_name?: string; email?: string }
// }

// export default function FeedItem({ 
//   title, 
//   content, 
//   type, 
//   pinned, 
//   created_at, 
//   deadline, 
//   attachment_path, 
//   author 
// }: FeedItemProps) {

//   // 1. Logic to determine the icon and color scheme
//   const getIcon = () => {
//     if (deadline) return { 
//       icon: <CalendarClock className="text-orange-500" size={20} />, 
//       bg: 'bg-orange-50' 
//     };
//     if (attachment_path) return { 
//       icon: <FileText className="text-blue-500" size={20} />, 
//       bg: 'bg-blue-50' 
//     };
//     return { 
//       icon: <Megaphone className="text-purple-500" size={20} />, 
//       bg: 'bg-purple-50' 
//     };
//   }

//   const { icon, bg } = getIcon();

//   return (
//     <Card className={`rounded-2xl shadow-sm transition-all border ${pinned ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-gray-200'}`}>
//       <CardHeader className="pb-3">
//         <div className="flex items-start justify-between">
//           <div className="flex gap-3">
//             {/* The Dynamic Icon Circle */}
//             <div className={`p-2.5 rounded-xl ${bg} flex-shrink-0`}>
//               {icon}
//             </div>
            
//             <div>
//               {pinned && (
//                 <div className="flex items-center gap-1 text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-0.5">
//                   <Pin size={10} className="fill-blue-600" />
//                   Pinned
//                 </div>
//               )}
//               <CardTitle className="text-lg leading-tight">
//                 {title}
//               </CardTitle>
//               <div className="flex items-center gap-2 mt-1">
//                  <p className="text-xs text-gray-500">
//                   {author?.full_name || author?.email}
//                 </p>
//                 <span className="text-gray-300">•</span>
//                 <p className="text-xs text-gray-500 flex items-center gap-1">
//                   <Clock size={12} />
//                   {format(new Date(created_at), 'MMM d')}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent>
//         <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
        
//         {/* Visual indicator for Deadline if it exists */}
//         {deadline && (
//           <div className="mt-4 flex items-center gap-2 p-2 rounded-lg bg-orange-50 border border-orange-100 w-fit">
//             <CalendarClock size={14} className="text-orange-600" />
//             <span className="text-xs font-semibold text-orange-700">
//               Due: {format(new Date(deadline), 'PPP')}
//             </span>
//           </div>
//         )}

//         {/* Visual indicator for File if it exists */}
//         {attachment_path && (
//           <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200 w-fit cursor-pointer hover:bg-gray-100 transition-colors">
//             <FileText size={14} className="text-blue-600" />
//             <span className="text-xs font-medium text-gray-600 truncate max-w-[200px]">
//               View Attachment
//             </span>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }