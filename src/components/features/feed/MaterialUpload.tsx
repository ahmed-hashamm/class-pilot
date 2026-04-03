'use client'

/**
 * MaterialUpload component handles the logic and UI for teachers to share resources.
 * It is presented as a modal for better contextual workflow.
 * Supports multi-file selection, titles, descriptions, and pinning.
 */

import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  UploadCloud, SendHorizontal, Type, AlignLeft, 
  X, HelpCircle, FileText, AlertCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { toast } from "sonner"
import { FeatureButton } from '@/components/common'
import { MaterialFileList } from './MaterialFileList'
import { PinToggle } from './PinToggle'
import { ALLOWED_FILE_TYPES } from "@/lib/data/materials"

interface MaterialUploadProps {
  isOpen: boolean
  onClose: () => void
  classId: string
  onSuccess: () => void
}

export default function MaterialUpload({ isOpen, onClose, classId, onSuccess }: MaterialUploadProps) {
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const supabase = createClient()

  useEffect(() => {
    async function getSession() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    if (isOpen) getSession()
  }, [isOpen])

  /**
   * Validates and adds selected files to the upload queue.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files)
    
    const valid = selected.filter((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase()
      return ext && (ALLOWED_FILE_TYPES as readonly string[]).includes(ext)
    })

    if (valid.length < selected.length) {
      toast.error('Only academic formats allowed (PDF, DOCX, PPT, PPTX).')
    }

    setFiles((prev) => [...prev, ...valid])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  /**
   * Handles the multi-part material upload and syncs with AI workspace.
   */
  const handleUpload = async () => {
    if (!files.length) {
      toast.error('Please select at least one file')
      return
    }
    if (!userId) {
      toast.error('Authentication required')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('title', title || 'Untitled Resource')
    formData.append('description', description)
    formData.append('classId', classId)
    formData.append('userId', userId)
    formData.append('pinned', String(isPinned))
    files.forEach((f) => formData.append('files', f))

    try {
      const { createMaterial } = await import('@/actions/ClassActions')
      const result = await createMaterial(formData)

      if (result.success) {
        toast.success("Lesson materials published")
        resetForm()
        onSuccess()
        onClose()
        
        // Background AI Ingestion
        if (result.materialId) {
          fetch('/api/materials/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ materialId: result.materialId }),
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) toast.success(`AI indexed resource (${data.chunks} nodes)`)
          })
          .catch(console.error)
        }
      } else {
        throw new Error(result.error || "Publication failed")
      }
    } catch (err: any) {
      toast.error(err.message || "Publication failed")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setFiles([])
    setIsPinned(false)
  }

  const isFormDirty = title.trim() || description.trim() || files.length > 0

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-navy/70 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 bg-navy text-white">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-white/15 flex items-center justify-center">
                <UploadCloud size={20} className="text-yellow" />
              </div>
              <div>
                <h2 className="text-[18px] font-black tracking-tight leading-none">Share Materials</h2>
                <p className="text-[11px] text-white/50 font-bold uppercase tracking-widest mt-1">Class Library Resource</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all border-none bg-transparent cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="grid gap-8">
              {/* Title & Description side-by-side on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Type size={14} className="text-navy" />
                    <label className="text-[11px] font-black tracking-[0.15em] uppercase text-navy/70">
                      Material Title
                    </label>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                    placeholder="e.g. Quantum Mechanics Slides"
                    className="w-full rounded-2xl border-2 border-secondary bg-gray-50/30 py-4 px-5 text-[15px] font-bold text-navy focus:bg-white focus:border-navy outline-none transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-4 text-left">
                  <PinToggle
                    pinned={isPinned}
                    onToggle={setIsPinned}
                  />
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Pinned materials stay highlighting at the top of the feed for all students.
                  </p>
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlignLeft size={14} className="text-navy" />
                  <label className="text-[11px] font-black tracking-[0.15em] uppercase text-navy/70">
                    Description (Optional)
                  </label>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  placeholder="Help students understand what this material is for..."
                  className="w-full min-h-[100px] rounded-2xl border-2 border-secondary bg-gray-50/30 p-5 text-[14px] font-medium text-navy leading-relaxed resize-none focus:bg-white focus:border-navy outline-none transition-all shadow-sm"
                />
              </div>

              {/* File Selection */}
              <div className="space-y-4 border-t border-border pt-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-navy" />
                    <label className="text-[11px] font-black tracking-[0.15em] uppercase text-navy/70">
                      Resource Files
                    </label>
                  </div>
                  {files.length > 0 && (
                    <span className="text-[11px] font-black text-navy px-2.5 py-1 bg-secondary rounded-lg uppercase">
                      {files.length} Selected
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-4">
                  <label className="relative flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border rounded-3xl py-10 px-6 cursor-pointer hover:border-navy hover:bg-navy/5 transition-all group">
                    <div className="size-12 rounded-full bg-navy/5 flex items-center justify-center text-navy group-hover:scale-110 group-hover:bg-navy group-hover:text-white transition-all duration-300">
                      <UploadCloud size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-[14px] font-black text-navy uppercase tracking-wide">Select Resource Files</p>
                      <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">
                        PDF, DOCX, or PowerPoint
                      </p>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      disabled={loading}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>

                  {files.length > 0 && (
                    <MaterialFileList 
                      files={files} 
                      onRemove={(i) => setFiles(files.filter((_, idx) => idx !== i))} 
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-8 bg-gray-50 border-t border-border flex items-center justify-between">
            {isFormDirty && !loading ? (
              <button
                onClick={resetForm}
                className="text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition cursor-pointer bg-transparent border-none"
              >
                Clear All
              </button>
            ) : <div />}
            
            <div className="flex items-center gap-3">
              <FeatureButton
                label="Cancel"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              />
              <FeatureButton
                label="Publish Resource"
                icon={SendHorizontal}
                loading={loading}
                disabled={files.length === 0}
                onClick={handleUpload}
                className="min-w-[200px]"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
