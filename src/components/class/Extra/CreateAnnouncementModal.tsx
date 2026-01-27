// 'use client'

// import { useState } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// interface CreateAnnouncementModalProps {
//   classId: string
//   userId: string
//   onClose: () => void
//   onSuccess: () => void
// }

// export default function CreateAnnouncementModal({
//   classId,
//   userId,
//   onClose,
//   onSuccess,
// }: CreateAnnouncementModalProps) {
//   const [title, setTitle] = useState('')
//   const [content, setContent] = useState('')
//   const [pinned, setPinned] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const supabase = createClient()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)

//     try {
//       const { error: insertError } = await supabase.from('announcements').insert({
//         class_id: classId,
//         title,
//         content,
//         created_by: userId,
//         pinned,
//       })

//       if (insertError) throw insertError

//       onSuccess()
//     } catch (err: any) {
//       setError(err.message || 'Failed to create announcement')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <Card className="w-full max-w-2xl m-4">
//         <CardHeader>
//           <CardTitle>Create Announcement</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="title">Title *</Label>
//               <Input
//                 id="title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="content">Content *</Label>
//               <textarea
//                 id="content"
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 rows={6}
//                 required
//                 className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
//               />
//             </div>
//             <div className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 id="pinned"
//                 checked={pinned}
//                 onChange={(e) => setPinned(e.target.checked)}
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <Label htmlFor="pinned" className="cursor-pointer">
//                 Pin this announcement
//               </Label>
//             </div>
//             {error && (
//               <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
//             )}
//             <div className="flex gap-4">
//               <Button type="submit" variant="primary" disabled={loading}>
//                 {loading ? 'Creating...' : 'Create'}
//               </Button>
//               <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
//                 Cancel
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

