'use client'

/**
 * SubmissionForm component handles student work submissions for assignments.
 * It supports text-based submissions and file uploads.
 * It also displays grades and feedback once the assignment is assessed.
 */

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { submitAssignment } from '@/actions/ClassActions'
import { 
  AlertCircle, CheckCircle2, Award, 
  MessageSquare, FileText, Users, X,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { SubmissionTextEditor } from './SubmissionTextEditor'
import { SubmissionFileUploader } from './SubmissionFileUploader'
import { SkeletonLoader, FeatureButton } from '@/components/common'

interface SubmissionFormProps {
  assignment: any
  classId?: string
  onSuccess: () => void
  onClose: () => void
}

export default function SubmissionForm({ assignment, classId, onSuccess, onClose }: SubmissionFormProps) {
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)
  const [submissionData, setSubmissionData] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  const supabase = createClient()

  /**
   * Checks if the user already has a submission for this assignment.
   */
  useEffect(() => {
    checkExistingSubmission()
  }, [assignment.id])

  const checkExistingSubmission = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      let query = supabase
        .from('submissions')
        .select(`
          id, 
          assignment_id, 
          user_id, 
          content, 
          final_grade, 
          status, 
          feedback, 
          group_id
        `)
        .eq('assignment_id', assignment.id)

      if (assignment.is_group_project) {
        const { data: memberData } = await supabase
          .from('project_members')
          .select('project_id')
          .eq('user_id', user.id)
          .maybeSingle()
        
        if (memberData) {
          query = query.eq('group_id', (memberData as any).project_id)
        } else {
          query = query.eq('user_id', user.id)
        }
      } else {
        query = query.eq('user_id', user.id)
      }

      const { data: existing, error: queryError } = await query.maybeSingle()
      if (queryError) throw queryError

      if (existing) {
        setSubmissionData(existing)
        setContent((existing as any).content || '')
      }
    } catch (err) {
      console.error('Check submission error:', err)
    } finally {
      setChecking(false)
    }
  }

  /**
   * Handles the file upload and submission logic.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Authentication required')

      let groupId = null
      if (assignment.is_group_project) {
        const { data: memberData } = await supabase
          .from('project_members')
          .select('project_id')
          .eq('user_id', user.id)
          .maybeSingle()
        if (!memberData) throw new Error('No team association found.')
        groupId = (memberData as any).project_id
      }

      const uploadedFiles: any[] = []
      for (const file of files) {
        const filePath = `submissions/${assignment.id}/${user.id}/${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage
          .from('assignments')
          .upload(filePath, file)
        
        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('assignments')
          .getPublicUrl(filePath)
        
        uploadedFiles.push({ name: file.name, url: publicUrl, path: filePath })
      }

      await submitAssignment({
        assignmentId: assignment.id,
        classId: classId || assignment.class_id,
        userId: user.id,
        groupId,
        content: assignment.submission_type !== 'file' ? content : undefined,
        files: uploadedFiles,
        isGroupProject: assignment.is_group_project,
      })

      toast.success("Assignment submitted successfully")
      onSuccess()
      setIsEditing(false)
      checkExistingSubmission()
    } catch (err: any) {
      setError(err.message || 'Submission failed')
      toast.error(err.message || 'Failed to submit work')
    } finally {
      setLoading(false)
    }
  }

  if (checking) return <SkeletonLoader variant="form" />

  /* ── VIEW MODE (Already Submitted) ── */
  if (submissionData && !isEditing) {
    const isGraded = submissionData.status === 'graded' || submissionData.final_grade !== null

    return (
      <div className="w-full">
        <div className={cn(
          "flex items-center justify-between px-8 py-5 text-white shadow-md transition-colors",
          isGraded ? "bg-navy" : "bg-green-600"
        )}>
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-yellow" />
            <span className="font-black text-[14px] uppercase tracking-[0.1em]">
              {isGraded ? 'Assessment Finalized' : 'Submission Received'}
            </span>
          </div>
          {assignment.is_group_project && (
            <span className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest backdrop-blur-sm border border-white/10">
              <Users size={12} /> Group Work
            </span>
          )}
        </div>

        <div className="p-10 flex flex-col items-center gap-8 text-center bg-white">
          {isGraded ? (
            <>
              <div className="bg-navy rounded-3xl px-12 py-8 flex flex-col items-center gap-2 shadow-xl ring-8 ring-secondary/20">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
                  Grade Earned
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="font-black text-[64px] text-yellow leading-none tracking-tighter">
                    {submissionData.final_grade}
                  </span>
                  <span className="text-[24px] text-white/30 font-bold">/{assignment.points}</span>
                </div>
              </div>

              {submissionData.feedback && (
                <div className="w-full bg-secondary/50 border border-border rounded-2xl p-6 text-left relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-navy/20 group-hover:bg-navy transition-colors" />
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare size={14} className="text-navy" />
                    <p className="text-[11px] font-black uppercase tracking-[0.15em] text-navy">
                      Instructor Feedback
                    </p>
                  </div>
                  <p className="text-[14px] text-navy/80 font-medium leading-relaxed italic">
                    "{submissionData.feedback}"
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              <div className="size-20 rounded-3xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto shadow-inner">
                <FileText size={32} className="text-green-600" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="font-black text-[22px] tracking-tight text-navy">Well done!</h3>
                <p className="text-[14px] text-muted-foreground mt-3 font-medium leading-relaxed uppercase tracking-wide">
                  Your work is safely submitted. Your teacher will evaluate it according to the class guidelines.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            {!isGraded && (
              <FeatureButton 
                label="Edit Submission"
                variant="primary"
                onClick={() => setIsEditing(true)}
                className="flex-1"
              />
            )}
            <FeatureButton 
              label="Close"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    )
  }

  /* ── FORM MODE ── */
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 p-10 w-full bg-white rounded-b-3xl">
      <div className="flex flex-col gap-6">
        {assignment.is_group_project && (
          <div className="flex gap-4 p-5 bg-navy/[0.03] border-l-4 border-navy rounded-r-2xl">
            <Users size={20} className="text-navy shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[12px] font-black uppercase tracking-wider text-navy">Team Submission Mode</p>
              <p className="text-[13px] text-navy/70 font-medium leading-normal">
                Submitting on behalf of your group. All team members will receive this submission's grade.
              </p>
            </div>
          </div>
        )}

        {assignment.submission_type !== 'file' && (
          <SubmissionTextEditor 
            value={content} 
            onChange={setContent} 
            disabled={loading} 
          />
        )}

        {assignment.submission_type !== 'text' && (
          <SubmissionFileUploader 
            files={files} 
            onFilesChange={setFiles} 
            disabled={loading} 
          />
        )}
      </div>

      {error ? (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 text-[13px] font-bold px-5 py-4 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-secondary/50 border border-border px-5 py-4 rounded-2xl">
          <Award size={18} className="text-navy/40" />
          <span className="text-[11px] font-bold text-navy/50 uppercase tracking-widest">
            Maximum Points: {assignment.points}
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
        <FeatureButton 
          type="submit"
          label={submissionData ? "Update Work" : "Turn In Assignment"}
          variant="primary"
          loading={loading}
          className="flex-1 h-[56px] text-[15px]" 
        />
        <FeatureButton 
          type="button"
          label="Cancel"
          variant="outline"
          onClick={onClose}
          disabled={loading}
          className="flex-1 h-[56px] text-[15px]"
        />
      </div>
    </form>
  )
}
