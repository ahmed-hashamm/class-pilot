'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { Database, Clock, FileText, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MaterialUpload from '../Feed/MaterialUpload' // Your existing form component
import AttachmentButton from '@/components/class/Buttons/AttachmentButton'
import Loader from '@/components/layout/Loader'

interface MaterialsTabProps {
  classId: string
  isTeacher: boolean
  userId: string
}

export default function MaterialsTab({ classId, isTeacher, userId }: MaterialsTabProps) {
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false) // State to show/hide form
  const supabase = createClient()

  useEffect(() => {
    loadMaterials()
  }, [classId, userId])

  const loadMaterials = async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('*, users(full_name, email)')
      .eq('class_id', classId)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setMaterials(data)
    }
    setLoading(false)
  }

  const getDisplayName = (path: string) => {
    const fileName = path.split('/').pop() || "File"
    const parts = fileName.split('-')
    return parts.length > 1 ? parts.slice(1).join('-') : fileName
  }

  if (loading) {
    return (
      <Loader text='Loading resources' border='border-emerald-500' />
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col items-start space-y-5 md:flex-row md:items-center justify-between mb-8 border-b border-gray-300 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Database className="text-emerald-600" size={28} />
            Class Materials
          </h2>
          <p className="text-sm text-gray-500 mt-1">Access shared documents and resources</p>
        </div>

        {isTeacher && (
          <Button
            onClick={() => setIsUploading(!isUploading)}
            className={`w-full md:w-fit ${isUploading ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-emerald-600 hover:bg-emerald-700 text-white'} rounded-full px-6 transition-all`}
          >
            {isUploading ? (
              <><X className="mr-2 h-4 w-4" /> Close</>
            ) : (
              <><Plus className="mr-2 h-4 w-4" /> Upload Material</>
            )}
          </Button>
        )}
      </div>

      {/* Your Existing MaterialUpload Component */}
      {isUploading && (
        <div className="mb-8">
          <MaterialUpload
            classId={classId}
            userId={userId}
            onSuccess={() => {
              setIsUploading(false) // Hide form on success
              loadMaterials()       // Refresh list
            }}
          />
        </div>
      )}

      {materials.length === 0 && !isUploading ? (
        <Card className="border-dashed border-2 bg-emerald-50/10 border-emerald-100">
          <CardContent className="py-20 text-center">
            <Database className="mx-auto h-12 w-12 text-emerald-200 mb-4" />
            <p className="text-emerald-800 font-medium">The resource library is empty.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-0  overflow-hidden rounded-lg shadow-sm">
          {materials.map((material) => (
            <div key={material.id} className="group bg-white border-b border-slate-300 transition-all hover:bg-emerald-50/40">
              <div className="p-6">
                <div className="flex items-start gap-5">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-200 transition-colors">
                    <FileText size={24} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                      {material.title}
                    </h3>

                    <div className="flex items-center gap-3 mt-1 text-xs text-emerald-600/70 font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {format(new Date(material.created_at), 'MMM d, yyyy')}
                      </span>
                      <span>•</span>
                      <span>{material.users?.full_name || 'Teacher'}</span>
                    </div>

                    {material.description && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                        {material.description}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2">
                      {/* File Logic */}
                      {material.attachment_paths ? (
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
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}