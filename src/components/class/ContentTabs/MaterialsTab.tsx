// 'use client'

// import { useEffect, useState } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { Card, CardContent } from '@/components/ui/card'
// import { format } from 'date-fns'
// import { Database, Clock, FileText, Plus, X } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import MaterialUpload from '../Feed/MaterialUpload' // Your existing form component
// import AttachmentButton from '@/components/class/Buttons/AttachmentButton'
// import Loader from '@/components/layout/Loader'

// interface MaterialsTabProps {
//   classId: string
//   isTeacher: boolean
//   userId: string
// }

// export default function MaterialsTab({ classId, isTeacher, userId }: MaterialsTabProps) {
//   const [materials, setMaterials] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [isUploading, setIsUploading] = useState(false) // State to show/hide form
//   const supabase = createClient()

//   useEffect(() => {
//     loadMaterials()
//   }, [classId, userId])

//   const loadMaterials = async () => {
//     const { data, error } = await supabase
//       .from('materials')
//       .select('*, users(full_name, email)')
//       .eq('class_id', classId)
//       .order('created_at', { ascending: false })

//     if (!error && data) {
//       setMaterials(data)
//     }
//     setLoading(false)
//   }

//   const getDisplayName = (path: string) => {
//     const fileName = path.split('/').pop() || "File"
//     const parts = fileName.split('-')
//     return parts.length > 1 ? parts.slice(1).join('-') : fileName
//   }

//   if (loading) {
//     return (
//       <Loader text='Loading resources' border='border-emerald-500' />
//     )
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       {/* Header Section */}
//       <div className="flex flex-col items-start space-y-5 md:flex-row md:items-center justify-between mb-8 border-b border-gray-300 pb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <Database className="text-emerald-600" size={28} />
//             Class Materials
//           </h2>
//           <p className="text-sm text-gray-500 mt-1">Access shared documents and resources</p>
//         </div>

//         {isTeacher && (
//           <Button
//             onClick={() => setIsUploading(!isUploading)}
//             className={`w-full md:w-fit ${isUploading ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-emerald-600 hover:bg-emerald-700 text-white'} rounded-full px-6 transition-all`}
//           >
//             {isUploading ? (
//               <><X className="mr-2 h-4 w-4" /> Close</>
//             ) : (
//               <><Plus className="mr-2 h-4 w-4" /> Upload Material</>
//             )}
//           </Button>
//         )}
//       </div>

//       {/* Your Existing MaterialUpload Component */}
//       {isUploading && (
//         <div className="mb-8">
//           <MaterialUpload
//             classId={classId}
//             userId={userId}
//             onSuccess={() => {
//               setIsUploading(false) // Hide form on success
//               loadMaterials()       // Refresh list
//             }}
//           />
//         </div>
//       )}

//       {materials.length === 0 && !isUploading ? (
//         <Card className="border-dashed border-2 bg-emerald-50/10 border-emerald-100">
//           <CardContent className="py-20 text-center">
//             <Database className="mx-auto h-12 w-12 text-emerald-200 mb-4" />
//             <p className="text-emerald-800 font-medium">The resource library is empty.</p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="space-y-0  overflow-hidden rounded-lg shadow-sm">
//           {materials.map((material) => (
//             <div key={material.id} className="group bg-white border-b border-slate-300 transition-all hover:bg-emerald-50/40">
//               <div className="p-6">
//                 <div className="flex items-start gap-5">
//                   <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-200 transition-colors">
//                     <FileText size={24} />
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
//                       {material.title}
//                     </h3>

//                     <div className="flex items-center gap-3 mt-1 text-xs text-emerald-600/70 font-semibold">
//                       <span className="flex items-center gap-1">
//                         <Clock size={12} />
//                         {format(new Date(material.created_at), 'MMM d, yyyy')}
//                       </span>
//                       <span>•</span>
//                       <span>{material.users?.full_name || 'Teacher'}</span>
//                     </div>

//                     {material.description && (
//                       <p className="text-sm text-gray-600 mt-3 line-clamp-2 leading-relaxed">
//                         {material.description}
//                       </p>
//                     )}

//                     <div className="mt-5 flex flex-wrap gap-2">
//                       {/* File Logic */}
//                       {material.attachment_paths ? (
//                         material.attachment_paths.map((path: string) => (
//                           <AttachmentButton
//                             key={path}
//                             path={path}
//                             type="material"
//                             label={getDisplayName(path)}
//                           />
//                         ))
//                       ) : material.file_url ? (
//                         <AttachmentButton
//                           path={material.file_url}
//                           type="material"
//                           label={getDisplayName(material.file_url)}
//                         />
//                       ) : null}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { Database, Clock, FileText, Plus, X } from 'lucide-react'
import MaterialUpload from '../Feed/MaterialUpload'
import AttachmentButton from '@/components/class/Buttons/AttachmentButton'
import Loader from '@/components/layout/Loader'

interface MaterialsTabProps {
  classId: string
  isTeacher: boolean
  userId: string
}

export default function MaterialsTab({ classId, isTeacher, userId }: MaterialsTabProps) {
  const [materials,   setMaterials]   = useState<any[]>([])
  const [loading,     setLoading]     = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const supabase = createClient()

  useEffect(() => { loadMaterials() }, [classId, userId])

  const loadMaterials = async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('*, users(full_name, email)')
      .eq('class_id', classId)
      .order('created_at', { ascending: false })

    if (!error && data) setMaterials(data)
    setLoading(false)
  }

  const getDisplayName = (path: string) => {
    const fileName = path.split('/').pop() || 'File'
    const parts = fileName.split('-')
    return parts.length > 1 ? parts.slice(1).join('-') : fileName
  }

  if (loading) return <Loader text="Loading resources" border="border-navy" />

  return (
    <div className="flex flex-col gap-6 py-6">

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-navy flex items-center justify-center">
            <Database size={17} className="text-yellow" />
          </div>
          <div>
            <h2 className="font-black text-[18px] tracking-tight">Class Materials</h2>
            <p className="text-[13px] text-muted-foreground">
              Shared documents and resources
            </p>
          </div>
        </div>

        {isTeacher && (
          <button
            onClick={() => setIsUploading(!isUploading)}
            className={`inline-flex items-center gap-2 font-semibold text-[13px]
              px-5 py-2.5 rounded-xl transition-all cursor-pointer border-none
              ${isUploading
                ? 'bg-secondary border border-border text-foreground hover:border-navy/30'
                : 'bg-navy text-white hover:bg-navy/90 hover:-translate-y-0.5 shadow-sm'
              }`}>
            {isUploading
              ? <><X size={14} />Close</>
              : <><Plus size={14} />Upload material</>
            }
          </button>
        )}
      </div>

      {/* Upload panel */}
      {isUploading && (
        <div className="bg-white border border-border rounded-2xl p-5
          animate-in fade-in slide-in-from-top-1 duration-200">
          <MaterialUpload
            classId={classId}
            userId={userId}
            onSuccess={() => { setIsUploading(false); loadMaterials() }}
          />
        </div>
      )}

      {/* Empty state */}
      {materials.length === 0 && !isUploading ? (
        <div className="flex flex-col items-center justify-center gap-3
          py-16 border-2 border-dashed border-border rounded-2xl bg-white text-center">
          <div className="size-14 rounded-2xl bg-navy/8 border border-navy/15
            flex items-center justify-center">
            <Database size={24} className="text-navy/40" />
          </div>
          <p className="font-bold text-[16px] tracking-tight">No materials yet</p>
          <p className="text-[13px] text-muted-foreground max-w-xs leading-relaxed">
            {isTeacher
              ? 'Upload documents, slides, or files for your students to access.'
              : 'Your teacher has not uploaded any materials yet.'}
          </p>
          {isTeacher && (
            <button
              onClick={() => setIsUploading(true)}
              className="mt-2 inline-flex items-center gap-2 bg-navy text-white
                font-semibold text-[13px] px-5 py-2.5 rounded-xl
                hover:bg-navy/90 transition cursor-pointer border-none">
              <Plus size={14} />
              Upload first material
            </button>
          )}
        </div>
      ) : (
        /* Materials list */
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          {materials.map((material, i) => (
            <div
              key={material.id}
              className={`group flex items-start gap-4 p-5 transition-colors
                hover:bg-secondary/40
                ${i < materials.length - 1 ? 'border-b border-border' : ''}`}>

              {/* Icon */}
              <div className="shrink-0 size-11 rounded-xl bg-navy/8 border border-navy/15
                flex items-center justify-center group-hover:bg-navy/12 transition-colors">
                <FileText size={18} className="text-navy" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[15px] text-foreground truncate
                  group-hover:text-navy transition-colors mb-1">
                  {material.title}
                </h3>

                <p className="flex items-center gap-2 text-[12px] text-muted-foreground mb-1">
                  <Clock size={11} />
                  {format(new Date(material.created_at), 'MMM d, yyyy')}
                  <span className="text-border">·</span>
                  <span className="font-medium">
                    {material.users?.full_name || 'Teacher'}
                  </span>
                </p>

                {material.description && (
                  <p className="text-[13px] text-muted-foreground line-clamp-2
                    leading-relaxed mt-2">
                    {material.description}
                  </p>
                )}

                {/* Attachments */}
                {(material.attachment_paths || material.file_url) && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {Array.isArray(material.attachment_paths) ? (
                      material.attachment_paths.map((path: string) => (
                        <AttachmentButton
                          key={path}
                          path={path}
                          type="material"
                          label={getDisplayName(path)}
                        />
                      ))
                    ) : material.file_url ? (
                      <AttachmentButton
                        path={material.file_url}
                        type="material"
                        label={getDisplayName(material.file_url)}
                      />
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}