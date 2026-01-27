// 'use client'

// import { useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { format } from 'date-fns'
// import CreateAnnouncementButton from './CreateAnnouncementButton'
// import { useRealtimeAnnouncements } from '@/hooks/useRealtime'

// interface AnnouncementsTabProps {
//   classId: string
//   isTeacher: boolean
// }

// export default function AnnouncementsTab({ classId, isTeacher }: AnnouncementsTabProps) {
//   const announcements = useRealtimeAnnouncements(classId)
//   const loading = announcements.length === 0

//   if (loading) {
//     return <div className="text-center py-8">Loading announcements...</div>
//   }

//   return (
//     <div className="space-y-4">
//       {isTeacher && (
//         <div className="flex justify-end">
//           <CreateAnnouncementButton
//             classId={classId}
//             onSuccess={() => {
//               loadAnnouncements()
//             }}
//           />
//         </div>
//       )}

//       {announcements.length === 0 ? (
//         <Card>
//           <CardContent className="py-12 text-center text-gray-600">
//             No announcements yet.
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="space-y-4">
//           {announcements.map((announcement) => (
//             <Card key={announcement.id} className={announcement.pinned ? 'border-blue-500' : ''}>
//               <CardHeader>
//                 <div className="flex items-start justify-between">
//                   <div>
//                     {announcement.pinned && (
//                       <span className="text-xs text-blue-600 font-medium mb-1 block">📌 Pinned</span>
//                     )}
//                     <CardTitle>{announcement.title}</CardTitle>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
//                 <p className="text-xs text-gray-500 mt-4">
//                   {announcement.users?.full_name || announcement.users?.email} •{' '}
//                   {format(new Date(announcement.created_at), 'MMM d, yyyy h:mm a')}
//                 </p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

