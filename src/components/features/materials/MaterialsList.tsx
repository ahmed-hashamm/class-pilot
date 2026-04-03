'use client'

/**
 * MaterialsList component displays a collection of teaching materials within a class.
 * It provides administrative features for teachers (upload, pin, delete) 
 * and download access for students.
 */

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  FileText, Plus, Pin, Trash2, 
  Download, ExternalLink, Database,
  Search, Filter, Clock
} from 'lucide-react'
import { toast } from 'sonner'
import { 
  PageHeader, 
  SkeletonLoader, 
  EmptyState, 
  ConfirmModal,
  FeatureButton 
} from '@/components/common'
import MaterialUpload from '../feed/MaterialUpload'

interface MaterialsListProps {
  classId: string
  isTeacher: boolean
}

export function MaterialsList({ classId, isTeacher }: MaterialsListProps) {
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const supabase = createClient()

  useEffect(() => {
    fetchMaterials()
  }, [classId])

  const fetchMaterials = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('class_id', classId)
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setMaterials(data || [])
    } catch (err) {
      console.error('Fetch materials error:', err)
      toast.error('Could not load materials')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', deleteConfirm)

      if (error) throw error
      toast.success('Material removed')
      setMaterials(prev => prev.filter(m => m.id !== deleteConfirm))
      setDeleteConfirm(null)
    } catch (err) {
      toast.error('Deletion failed')
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return <SkeletonLoader variant="list" />

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Class Materials" 
        description="Access and manage shared educational resources"
        icon={Database}
        action={isTeacher && (
          <FeatureButton 
            label="Upload Material"
            icon={Plus}
            variant="primary"
            onClick={() => setIsUploadOpen(true)}
          />
        )}
      />

      {/* Search Bar */}
      <div className="relative group max-w-md">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-navy/40 group-focus-within:text-navy transition-colors">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border-2 border-secondary rounded-2xl py-3.5 pl-12 pr-4 text-[14px] font-medium focus:border-navy outline-none transition-all placeholder:text-muted-foreground/50 shadow-sm"
        />
      </div>

      {!filteredMaterials.length ? (
        <EmptyState 
          title={searchQuery ? "No matching materials found" : "No materials shared yet"}
          description={isTeacher ? "Start by uploading your first teaching resource." : "Teaching resources will appear here once your teacher shares them."}
          icon={FileText}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <div 
              key={material.id}
              className="group bg-white border border-border rounded-3xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {material.pinned && (
                <div className="absolute top-0 right-0 bg-yellow px-3 py-1 rounded-bl-2xl">
                  <Pin size={14} className="text-navy fill-navy" />
                </div>
              )}

              <div className="flex flex-col h-full gap-6">
                <div className="size-14 rounded-2xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-navy group-hover:text-white transition-colors duration-300">
                  <FileText size={28} />
                </div>

                <div className="space-y-2">
                  <h3 className="font-black text-[18px] text-navy line-clamp-1">{material.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={14} />
                    <span className="text-[11px] font-black uppercase tracking-wider">
                      {new Date(material.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 mt-auto">
                  <a 
                    href={material.file_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1"
                  >
                    <FeatureButton 
                      label="Download" 
                      variant="outline" 
                      icon={Download}
                      className="w-full py-2"
                    />
                  </a>
                  {isTeacher && (
                    <button 
                      onClick={() => setDeleteConfirm(material.id)}
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors border-none bg-transparent cursor-pointer"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isTeacher && (
        <MaterialUpload 
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          classId={classId}
          onSuccess={fetchMaterials}
        />
      )}

      <ConfirmModal 
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Material"
        message="Are you sure you want to remove this resource? This action cannot be undone."
      />
    </div>
  )
}
