// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Copy, MoreVertical, Paperclip, Calendar, X } from 'lucide-react'

// export default function StreamTab({ classCode, isTeacher }: { classCode: string, isTeacher: boolean }) {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto py-8 px-4">
      
//       {/* SIDEBAR - Classroom Code & Sticky Notes */}
//       <div className="lg:col-span-3 space-y-4">
//         <Card className="rounded-xl border-none shadow-sm bg-white p-4">
//           <div className="flex justify-between items-center mb-2 font-semibold text-gray-500 text-sm">
//              <span>Classroom Code</span>
//              <MoreVertical size={16} />
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-3xl font-bold text-blue-600">{classCode}</span>
//             <Button variant="ghost"  className="text-blue-500"><Copy size={18} /></Button>
//           </div>
//         </Card>

//         <Card className="rounded-xl border-none shadow-sm bg-white p-4">
//           <div className="flex justify-between items-center mb-2 font-semibold text-gray-500 text-sm">
//              <span>Sticky Notes</span>
//              <MoreVertical size={16} />
//           </div>
//           <p className="text-xs text-gray-500 italic">Assignment deni, Quiz Upload krna, notes bnany</p>
//         </Card>
//       </div>

//       {/* FEED - Announcements */}
//       <div className="lg:col-span-9 space-y-6">
//         <Card className="rounded-2xl border-none shadow-sm overflow-hidden bg-white">
//           <div className="p-4 text-sm text-gray-400 border-b bg-gray-50/50">Make an announcement...</div>
//           <div className="p-6 min-h-[140px] bg-[#fdfaf5]">
//              <textarea className="w-full bg-transparent border-none outline-none resize-none" placeholder=".................|" />
//           </div>
//           <div className="p-4 flex justify-between bg-white border-t">
//             <div className="flex gap-2">
//                <Button variant="ghost"  className="rounded-full bg-blue-50 text-blue-500"><Paperclip size={18}/></Button>
//                <Button variant="ghost"      className="rounded-full bg-blue-50 text-blue-500"><Calendar size={18}/></Button>
//             </div>
//             <Button className="bg-[#1e6ed1] hover:bg-blue-700 px-10 rounded-xl font-bold">Post</Button>
//           </div>
//         </Card>
//       </div>
//     </div>
//   )
// }