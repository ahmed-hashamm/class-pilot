
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { Database, Clock, FileText, Plus, X, RefreshCw } from 'lucide-react'
import MaterialUpload from '../Feed/MaterialUpload'
import AttachmentButton from '@/components/class/Buttons/AttachmentButton'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import EditMaterialModal from '@/components/class/ContentTabs/EditMaterialModal'

interface MaterialsTabProps {
  classId: string
  isTeacher: boolean
  userId: string
}

export default function MaterialsTab({ classId, isTeacher, userId }: MaterialsTabProps) {
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [editing, setEditing] = useState<any>(null)

  const supabase = createClient()

  const loadMaterials = async () => {
    setLoading(true)
    setError(null)

    // getUser() makes a real server call that triggers JWT refresh
    await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('materials')
      .select('*, users(full_name, email)')
      .eq('class_id', classId)
      .order('created_at', { ascending: false })

    if (error) {
      setError('Failed to load materials.')
      setMaterials([])
    } else if (data) {
      setMaterials(data)
    }
    setLoading(false)
  }

  const deleteMaterial = async (id: string, classId: string) => {
    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', id)
      .eq('class_id', classId)
    if (error) throw error
  }

  useEffect(() => { loadMaterials() }, [classId, userId])

  const getDisplayName = (path: string) => {
    const fileName = path.split('/').pop() || 'File'
    const parts = fileName.split('-')
    return parts.length > 1 ? parts.slice(1).join('-') : fileName
  }
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this material? This cannot be undone.')) return
    try { 
      await deleteMaterial(id, classId); 
      setMaterials((prev) => prev.filter((m) => m.id !== id)) 
      toast.success("Material deleted");
    }
    catch { toast.error('Failed to delete material') }
  }
  const handleEdit = (material: any) => {
    setEditing(material)
  }
  const handleUpdate = () => {
    setEditing(null)
    loadMaterials()
  }
  if (loading) {
    return (
      <div className="flex flex-col gap-6 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-muted flex items-center justify-center" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-32" />
              <div className="h-3 bg-muted rounded w-40" />
            </div>
          </div>
          <div className="h-9 w-40 bg-muted rounded-xl" />
        </div>

        <div className="bg-white border border-border rounded-2xl overflow-hidden animate-pulse">
          {[1, 2].map((i) => (
            <div
              key={i}
              className={`flex items-start gap-4 p-5 ${i === 1 ? "border-b border-border" : ""}`}
            >
              <div className="shrink-0 size-11 rounded-xl bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="flex gap-3 mt-2">
                  <div className="h-3 bg-muted rounded w-24" />
                  <div className="h-3 bg-muted rounded w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 py-6">
        <div className="flex flex-col items-center justify-center gap-4 py-16
          border-2 border-dashed border-border rounded-2xl bg-white text-center">
          <Database size={32} className="text-muted-foreground/40" />
          <p className="text-[14px] font-medium text-muted-foreground">{error}</p>
          <button
            onClick={() => loadMaterials()}
            className="inline-flex items-center gap-2 bg-navy text-white font-semibold
              text-[13px] px-5 py-2.5 rounded-xl hover:bg-navy/90 transition cursor-pointer
              border-none">
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </div>
    )
  }

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
              {isTeacher && (
                <div className="relative shrink-0">
                  <button onClick={() => setMenuOpen(menuOpen === material.id ? null : material.id)}
                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition cursor-pointer bg-transparent border-none">
                    <MoreVertical size={15} />
                  </button>
                  {menuOpen === material.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
                      <div className="absolute right-0 top-8 z-50 bg-white border border-border rounded-xl shadow-lg overflow-hidden min-w-[140px]">
                        <button onClick={() => { setMenuOpen(null); handleEdit(material) }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-foreground hover:bg-secondary transition cursor-pointer bg-transparent border-none text-left">
                          <Pencil size={13} className="text-navy" /> Edit
                        </button>
                        <button onClick={() => { setMenuOpen(null); handleDelete(material.id) }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-red-500 hover:bg-red-50 transition cursor-pointer bg-transparent border-none text-left">
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <EditMaterialModal
          material={{
            ...editing,
            classId: classId,
            files: editing.attachment_paths || []
          }}
          onClose={() => setEditing(null)}
          onSuccess={handleUpdate}
        />
      )}
    </div>
  )
}
// 'use client'

// import { useState, useEffect } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { FolderOpen, Paperclip, ExternalLink, MoreVertical, Pencil, Trash2 } from 'lucide-react'
// import { format } from 'date-fns'
// import EditMaterialModal from '@/components/class/ContentTabs/EditMaterialModal'
// import { deleteMaterial } from '@/components/class/ClassActions'
// import Loader from '@/components/layout/Loader'
// import AttachmentButton from '../Buttons/AttachmentButton'

// interface MaterialFile { name: string; url: string; type?: string }
// interface Material { id: string; title: string; description?: string; files?: MaterialFile[]; created_at: string }

// const FILE_EXT_COLOR: Record<string, string> = {
//   pdf: 'bg-red-50 text-red-600 border-red-200',
//   docx: 'bg-blue-50 text-blue-700 border-blue-200',
//   ppt: 'bg-orange-50 text-orange-600 border-orange-200',
//   pptx: 'bg-orange-50 text-orange-600 border-orange-200',
// }

// export default function MaterialsTab({ classId, isTeacher }: { classId: string; isTeacher: boolean }) {
//   const supabase = createClient()
//   const [materials, setMaterials] = useState<Material[]>([])
//   const [loading, setLoading] = useState(true)
//   const [editing, setEditing] = useState<Material | null>(null)

//   useEffect(() => { fetchMaterials() }, [classId])

//   async function fetchMaterials() {
//     setLoading(true)
//     const { data } = await supabase
//       .from('materials').select('*, users(full_name, email)')
//       .eq('class_id', classId).order('created_at', { ascending: false })
//     setMaterials(data ?? [])
//     setLoading(false)
//   }

//   const handleDelete = async (id: string) => {
//     if (!confirm('Delete this material? This cannot be undone.')) return
//     try { await deleteMaterial(id, classId); setMaterials((prev) => prev.filter((m) => m.id !== id)) }
//     catch { alert('Failed to delete material') }
//   }

//   if (loading) return <Loader text="Loading materials" border="border-navy" />

//   return (
//     <div className="flex flex-col gap-6 py-6">
//       <div className="flex items-center gap-3">
//         <div className="size-10 rounded-xl bg-navy flex items-center justify-center">
//           <FolderOpen size={17} className="text-yellow" />
//         </div>
//         <div>
//           <h2 className="font-black text-[18px] tracking-tight">Class materials</h2>
//           <p className="text-[13px] text-muted-foreground">{materials.length} resource{materials.length !== 1 ? 's' : ''} shared</p>
//         </div>
//       </div>

//       {materials.length === 0 ? (
//         <div className="flex flex-col items-center justify-center gap-3 py-16 border-2 border-dashed border-border rounded-2xl bg-white text-center">
//           <div className="size-14 rounded-2xl bg-navy/8 border border-navy/15 flex items-center justify-center">
//             <FolderOpen size={24} className="text-navy/40" />
//           </div>
//           <p className="font-bold text-[16px] tracking-tight">No materials yet</p>
//           <p className="text-[13px] text-muted-foreground max-w-xs">
//             {isTeacher ? 'Upload slides, PDFs, or notes from the Stream tab.' : "Your teacher hasn't shared any materials yet."}
//           </p>
//         </div>
//       ) : (
//         <div className="bg-white border border-border rounded-2xl overflow-hidden">
//           {materials.map((material, i) => (
//             <MaterialRow
//               key={material.id} material={material} isTeacher={isTeacher}
//               isLast={i === materials.length - 1}
//               onEdit={() => setEditing(material)}
//               onDelete={() => handleDelete(material.id)}
//             />
//           ))}
//         </div>
//       )}

//       {editing && (
//         <EditMaterialModal
//           material={{ ...editing, classId }}
//           onClose={() => setEditing(null)}
//           onSuccess={() => { setEditing(null); fetchMaterials() }}
//         />
//       )}
//     </div>
//   )
// }

// function MaterialRow({ material, isTeacher, isLast, onEdit, onDelete }: {
//   material: Material; isTeacher: boolean; isLast: boolean; onEdit: () => void; onDelete: () => void
// }) {
//   const [menuOpen, setMenuOpen] = useState(false)
//   const files = material.files || []

//   return (
//     <div className={`flex items-start gap-4 p-5 hover:bg-secondary/30 transition-colors ${!isLast ? 'border-b border-border' : ''}`}>
//       <div className="shrink-0 size-10 rounded-xl bg-navy/8 border border-navy/15 flex items-center justify-center mt-0.5">
//         <FolderOpen size={16} className="text-navy" />
//       </div>

//       <div className="flex-1 min-w-0">
//         <p className="font-bold text-[14px] text-foreground">{material.title}</p>
//         {material.description && <p className="text-[12px] text-muted-foreground mt-0.5">{material.description}</p>}
//         <p className="text-[11px] text-muted-foreground mt-1">{format(new Date(material.created_at), 'MMM d, yyyy')}</p>

//         {/* {files.length > 0 && (
//           <div className="flex flex-wrap gap-2 mt-3">
//             {files.map((file, i) => {
//               const ext = file.type || file.name.split('.').pop()?.toLowerCase() || ''
//               const chipStyle = FILE_EXT_COLOR[ext] || 'bg-secondary text-foreground border-border'
//               return (
//                 <AttachmentButton href={file.url} fileName={file.name} />
//               )
//             })}
//           </div>
//         )} */}
//              {(files.attachment_paths || material.file_url) && (
//                   <div className="flex flex-wrap gap-2 mt-3">
//                     {Array.isArray(material.attachment_paths) ? (
//                       material.attachment_paths.map((path: string) => (
//                         <AttachmentButton
//                           key={path}
//                           path={path}
//                           type="material"
//                           label={getDisplayName(path)}
//                         />
//                       ))
//                     ) : material.file_url ? (
//                       <AttachmentButton
//                         path={material.file_url}
//                         type="material"
//                         label={getDisplayName(material.file_url)}
//                       />
//                     ) : null}
//                   </div>
//                 )}
//       </div>

//       {isTeacher && (
//         <div className="relative shrink-0">
//           <button onClick={() => setMenuOpen(!menuOpen)}
//             className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition cursor-pointer bg-transparent border-none">
//             <MoreVertical size={15} />
//           </button>
//           {menuOpen && (
//             <>
//               <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
//               <div className="absolute right-0 top-8 z-50 bg-white border border-border rounded-xl shadow-lg overflow-hidden min-w-[140px]">
//                 <button onClick={() => { setMenuOpen(false); onEdit() }}
//                   className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-foreground hover:bg-secondary transition cursor-pointer bg-transparent border-none text-left">
//                   <Pencil size={13} className="text-navy" /> Edit
//                 </button>
//                 <button onClick={() => { setMenuOpen(false); onDelete() }}
//                   className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-red-500 hover:bg-red-50 transition cursor-pointer bg-transparent border-none text-left">
//                   <Trash2 size={13} /> Delete
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }
