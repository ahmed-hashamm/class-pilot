// 'use client'

// import React, { useState } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { Button } from '@/components/ui/button'
// import CreateAnnouncementModal from './Modals/CreateAnnouncementModal'

// interface CreateAnnouncementButtonProps {
//   classId: string
//   onSuccess: () => void
// }

// export default function CreateAnnouncementButton({
//   classId,
//   onSuccess,
// }: CreateAnnouncementButtonProps) {
//   const [showModal, setShowModal] = useState(false)
//   const supabase = createClient()

//   const handleSuccess = async () => {
//     setShowModal(false)
//     onSuccess()
//   }

//   return (
//     <>
//       <Button variant="primary" onClick={() => setShowModal(true)}>
//         Create Announcement
//       </Button>
//       {showModal && (
//         <CreateAnnouncementModalWrapper
//           classId={classId}
//           onClose={() => setShowModal(false)}
//           onSuccess={handleSuccess}
//         />
//       )}
//     </>
//   )
// }

// function CreateAnnouncementModalWrapper({
//   classId,
//   onClose,
//   onSuccess,
// }: {
//   classId: string
//   onClose: () => void
//   onSuccess: () => void
// }) {
//   const supabase = createClient()
//   const [userId, setUserId] = useState<string | null>(null)

//   React.useEffect(() => {
//     supabase.auth.getUser().then(({ data: { user } }) => {
//       if (user) setUserId(user.id)
//     })
//   }, [supabase])

//   if (!userId) return null

//   return (
//     <CreateAnnouncementModal
//       classId={classId}
//       userId={userId}
//       onClose={onClose}
//       onSuccess={onSuccess}
//     />
//   )
// }

