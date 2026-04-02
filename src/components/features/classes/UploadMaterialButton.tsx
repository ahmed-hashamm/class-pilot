// 'use client'

// import React, { useState } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { Button } from '@/components/ui/button'
// import UploadMaterialModal from './UploadMaterialModal'

// interface UploadMaterialButtonProps {
//   classId: string
//   onSuccess: () => void
// }

// export default function UploadMaterialButton({
//   classId,
//   onSuccess,
// }: UploadMaterialButtonProps) {
//   const [showModal, setShowModal] = useState(false)
//   const supabase = createClient()

//   const handleSuccess = async () => {
//     setShowModal(false)
//     onSuccess()
//   }

//   return (
//     <>
//       <Button variant="primary" onClick={() => setShowModal(true)}>
//         Upload Material
//       </Button>
//       {showModal && (
//         <UploadMaterialModalWrapper
//           classId={classId}
//           onClose={() => setShowModal(false)}
//           onSuccess={handleSuccess}
//         />
//       )}
//     </>
//   )
// }

// function UploadMaterialModalWrapper({
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
//     <UploadMaterialModal
//       classId={classId}
//       userId={userId}
//       onClose={onClose}
//       onSuccess={onSuccess}
//     />
//   )
// }

