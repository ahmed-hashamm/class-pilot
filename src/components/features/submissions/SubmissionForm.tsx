/**
 * @file SubmissionForm.tsx
 * @description Form for students to submit assignments (text and/or file uploads).
 * Checks for existing submissions and handles both individual and group submissions.
 */
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { submitAssignment } from '@/actions/ClassActions'
import {
  Loader2, CheckCircle2, AlertCircle, Award,
  MessageSquare, FileText, Users, X
} from 'lucide-react'
import { toast } from 'sonner'
import { FileUploadArea } from '@/components/ui/FileUploadArea'
import { FeatureButton } from '@/components/ui/FeatureButton'
import { Button } from '@/components/ui/button'
export default function SubmissionForm({ assignment, classId, onClose, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [submissionData, setSubmissionData] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const supabase = createClient()

  // Compute deadline status
  const isPastDeadline = (() => {
    if (!assignment.due_date) return false
    return new Date() > new Date(assignment.due_date)
  })()

  useEffect(() => {
    let cancelled = false
    const timeout = setTimeout(() => {
      if (!cancelled) setChecking(false)
    }, 8000) // Safety net: force stop after 8s

    checkExistingSubmission().finally(() => {
      if (!cancelled) {
        clearTimeout(timeout)
        setChecking(false)
      }
    })

    return () => { cancelled = true; clearTimeout(timeout) }
  }, [assignment.id])

  async function checkExistingSubmission() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let query = supabase.from('submissions').select('id, assignment_id, user_id, content, final_grade, status, feedback, group_id').eq('assignment_id', assignment.id)

    if (assignment.is_group_project) {
      const { data: memberData } = await supabase
        .from('project_members').select('project_id')
        .eq('user_id', user.id).maybeSingle()
      const projectId = (memberData as any)?.project_id
      if (projectId) query = query.eq('group_id', projectId)
      else return
    } else {
      query = query.eq('user_id', user.id)
    }

    const { data: existing } = await query.maybeSingle()
    if (existing) {
      const data = existing as any
      setSubmissionData(data)
      setContent(data.content || '')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)

    // Client-side deadline guard
    if (isPastDeadline && !submissionData) {
      setError('The deadline for this assignment has passed. Submissions are no longer accepted.')
      setLoading(false)
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let groupId = null
      if (assignment.is_group_project) {
        const { data: memberData } = await supabase
          .from('project_members').select('project_id')
          .eq('user_id', user.id).maybeSingle()
        if (!memberData) throw new Error('You are not part of a group for this project.')
        groupId = (memberData as any).project_id
      }

      const uploadedFiles: any[] = []

      for (const file of files) {
        const filePath = `submissions/${assignment.id}/${user.id}/${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage.from('assignments').upload(filePath, file)
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from('assignments').getPublicUrl(filePath)
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

      toast.success("Work submitted successfully")
      onSuccess()
      checkExistingSubmission()
    } catch (err: any) {
      console.error('Submission error:', err)
      setError(err.message)
      toast.error(err.message || 'Failed to submit work')
    } finally {
      setLoading(false)
    }
  }

  /* ── Checking ── */
  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-12 bg-white rounded-2xl">
        <Loader2 className="animate-spin text-navy" size={24} />
        <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
          Checking status…
        </span>
      </div>
    )
  }

  /* ── Already submitted ── */
  if (submissionData && !isEditing) {
    const grade = submissionData.final_grade
    const isGraded = submissionData.status === 'graded' || grade !== null

    return (
      <div className="w-full">

        {/* Status banner */}
        <div className={`flex items-center justify-between px-6 py-4
          ${isGraded ? 'bg-navy' : 'bg-green-500'} text-white`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={17} />
            <span className="font-bold text-[13px] uppercase tracking-wider">
              {isGraded ? 'Assessment complete' : 'Work turned in'}
            </span>
          </div>
          {assignment.is_group_project && (
            <span className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-1
              rounded-full text-[10px] font-bold uppercase">
              <Users size={11} /> Team
            </span>
          )}
        </div>

        <div className="p-8 flex flex-col items-center gap-6 text-center">
          {isGraded ? (
            <>
              {/* Grade display */}
              <div className="bg-navy rounded-2xl px-10 py-6 flex flex-col items-center gap-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                  Points earned
                </p>
                <p className="font-black text-[52px] text-yellow leading-none">
                  {grade}
                  <span className="text-[22px] text-white/40">/{assignment.points}</span>
                </p>
              </div>

              {submissionData.feedback && (
                <div className="w-full bg-secondary border border-border rounded-2xl p-5 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={13} className="text-navy" />
                    <p className="text-[11px] font-bold uppercase tracking-widest text-navy">
                      Feedback
                    </p>
                  </div>
                  <p className="text-[13px] text-foreground/80 leading-relaxed italic">
                    &quot;{submissionData.feedback}&quot;
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="size-16 rounded-2xl bg-green-50 border border-green-200
                flex items-center justify-center">
                <FileText size={28} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-black text-[18px] tracking-tight">Submitted & pending</h3>
                <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">
                  {assignment.is_group_project
                    ? "Your team's work has been received. You'll see the grade here once the teacher finishes review."
                    : "Your work is in! Your teacher will review and grade it soon."}
                </p>
              </div>
            </>
          )}

          <div className="flex flex-col gap-3 w-full">
            {!isGraded && (
              <FeatureButton
                onClick={() => setIsEditing(true)}
                className="w-full py-3"
                label="Edit Submission"
                variant="primary"
              />
            )}
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full py-3 text-muted-foreground uppercase tracking-widest"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Submission form ── */
  // Block new submissions after deadline (but allow editing existing ones)
  const canSubmit = !isPastDeadline || !!submissionData

  return (
    <form onSubmit={handleSubmit}
      className="flex flex-col gap-5 p-6 w-full">

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="font-black text-[16px] tracking-tight">
          {assignment.is_group_project ? 'Group submission' : 'Your submission'}
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="p-1.5">
          <X size={15} />
        </Button>
      </div>

      {/* Deadline warning */}
      {isPastDeadline && !submissionData && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200
          text-red-600 text-[13px] font-semibold px-4 py-3 rounded-xl">
          <AlertCircle size={14} /> The deadline has passed. Submissions are no longer accepted.
        </div>
      )}

      {/* Group notice */}
      {assignment.is_group_project && (
        <div className="flex gap-3 p-4 bg-yellow/10 border border-yellow/40 rounded-xl">
          <AlertCircle size={16} className="text-navy shrink-0 mt-0.5" />
          <p className="text-[12px] text-navy leading-relaxed">
            <strong>Team project:</strong> Only one member needs to submit. The grade
            will automatically appear for all members.
          </p>
        </div>
      )}

      {/* Content textarea */}
      {assignment.submission_type !== 'file' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">
            Response
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your submission details…"
            rows={5}
            disabled={!canSubmit}
            className="w-full resize-none bg-white border border-border rounded-xl px-4 py-3
              text-[14px] text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      )}

      {/* File upload */}
      {assignment.submission_type !== 'text' && canSubmit && (
        <FileUploadArea files={files} onFilesChange={setFiles} />
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200
          text-red-600 text-[13px] font-semibold px-4 py-3 rounded-xl">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <FeatureButton
          type="submit"
          disabled={loading || !canSubmit}
          loading={loading}
          loadingLabel="Submitting…"
          label="Submit work"
          className="flex-1 py-3"
        />
        <Button
          type="button"
          onClick={onClose}
          variant="outline"
          className="px-6 py-3 text-muted-foreground uppercase tracking-widest"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

