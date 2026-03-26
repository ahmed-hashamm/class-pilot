

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { Mail, ShieldCheck, GraduationCap, Users, RefreshCw } from 'lucide-react'
import Loader from '@/components/layout/Loader'

interface MembersTabProps {
  classId: string
  isTeacher: boolean
  userId: string
}

export default function MembersTab({ classId, isTeacher, userId }: MembersTabProps) {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const loadMembers = async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('class_members')
      .select('*, users(full_name, email, avatar_url)')
      .eq('class_id', classId)
      .order('role', { ascending: false })
      .order('joined_at', { ascending: true })

    if (error) {
      setError('Failed to load members.')
      setMembers([])
    } else if (data) {
      setMembers(data)
    }
    setLoading(false)
  }

  useEffect(() => { loadMembers() }, [classId])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-6 flex flex-col gap-8">
        {/* Teachers skeleton card */}
        <section className="bg-white border border-border rounded-2xl overflow-hidden animate-pulse">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/50">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-muted" />
              <div className="h-4 bg-muted rounded w-24" />
            </div>
            <div className="h-3 bg-muted rounded w-16" />
          </div>
          <div className="divide-y divide-border">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-6 py-3.5">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="shrink-0 size-10 rounded-xl bg-muted" />
                  <div className="space-y-2 w-40">
                    <div className="h-3 bg-muted rounded w-32" />
                    <div className="h-3 bg-muted rounded w-24" />
                  </div>
                </div>
                <div className="h-4 w-16 bg-muted rounded-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Students skeleton card */}
        <section className="bg-white border border-border rounded-2xl overflow-hidden animate-pulse">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/50">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-muted" />
              <div className="h-4 bg-muted rounded w-28" />
            </div>
            <div className="h-3 bg-muted rounded w-20" />
          </div>
          <div className="divide-y divide-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-6 py-3.5">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="shrink-0 size-10 rounded-xl bg-muted" />
                  <div className="space-y-2 w-48">
                    <div className="h-3 bg-muted rounded w-40" />
                    <div className="h-3 bg-muted rounded w-32" />
                  </div>
                </div>
                <div className="h-4 w-14 bg-muted rounded-full" />
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-6 flex flex-col gap-6">
        <div className="flex flex-col items-center justify-center gap-4 py-16
          border-2 border-dashed border-border rounded-2xl bg-white text-center">
          <Users size={32} className="text-muted-foreground/40" />
          <p className="text-[14px] font-medium text-muted-foreground">{error}</p>
          <button
            onClick={() => loadMembers()}
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

  const teachers = members.filter((m) => m.role === 'teacher')
  const students = members.filter((m) => m.role === 'student')
  const getInitial = (name: string) => name?.charAt(0).toUpperCase() || '?'

  return (
    <div className="max-w-3xl mx-auto py-6 flex flex-col gap-8">

      {/* Teachers */}
      {teachers.length > 0 && (
        <section className="bg-white border border-border rounded-2xl overflow-hidden">
          {/* Section header */}
          <div className="flex items-center justify-between px-6 py-4
            border-b border-border bg-secondary/50">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-navy flex items-center justify-center">
                <ShieldCheck size={15} className="text-yellow" />
              </div>
              <h3 className="font-black text-[16px] tracking-tight">Teachers</h3>
            </div>
            <span className="text-[11px] font-bold tracking-widest uppercase
              text-muted-foreground">
              {teachers.length} {teachers.length === 1 ? 'host' : 'hosts'}
            </span>
          </div>

          {/* Member rows */}
          <div className="divide-y divide-border">
            {teachers.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                role="teacher"
                getInitial={getInitial}
              />
            ))}
          </div>
        </section>
      )}

      {/* Students */}
      <section className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4
          border-b border-border bg-secondary/50">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-navy-light/15 border border-navy-light/25
              flex items-center justify-center">
              <GraduationCap size={15} className="text-navy-light" />
            </div>
            <h3 className="font-black text-[16px] tracking-tight">Students</h3>
          </div>
          <span className="text-[11px] font-bold tracking-widest uppercase
            text-muted-foreground">
            {students.length} enrolled
          </span>
        </div>

        {students.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-14 text-center">
            <Users size={24} className="text-muted-foreground/40" />
            <p className="text-[14px] text-muted-foreground font-medium">
              No students have joined yet
            </p>
            {isTeacher && (
              <p className="text-[12px] text-muted-foreground">
                Share the class code so students can join.
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {students.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                role="student"
                getInitial={getInitial}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  )
}

/* ── Member row ──────────────────────────────────────────────────────────── */
function MemberRow({
  member,
  role,
  getInitial,
}: {
  member: any
  role: 'teacher' | 'student'
  getInitial: (name: string) => string
}) {
  const [imgError, setImgError] = useState(false)
  const name  = member.users?.full_name || member.users?.email || 'Unknown'
  const email = member.users?.email
  const avatar = member.users?.avatar_url

  return (
    <div className="flex items-center justify-between gap-4 px-6 py-3.5
      hover:bg-secondary/40 transition-colors group">
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Avatar */}
        <div className={`shrink-0 size-10 rounded-xl overflow-hidden border flex
          items-center justify-center font-black text-[15px] relative
          ${role === 'teacher'
            ? 'bg-navy text-yellow border-navy/20'
            : 'bg-secondary text-navy border-border'
          }`}>
          {avatar && !imgError ? (
            <Image
              src={avatar}
              alt={name}
              className="object-cover"
              fill
              onError={() => setImgError(true)}
            />
          ) : (
            getInitial(name)
          )}
        </div>

        {/* Name + email */}
        <div className="min-w-0">
          <p className="font-semibold text-[14px] text-foreground truncate
            group-hover:text-navy transition-colors">
            {name}
          </p>
          {email && (
            <p className="flex items-center gap-1 text-[12px] text-muted-foreground truncate">
              <Mail size={11} />
              {email}
            </p>
          )}
        </div>
      </div>

      {/* Role badge */}
      <span className={`shrink-0 text-[10px] font-bold tracking-widest uppercase
        rounded-full px-2.5 py-0.5 border
        ${role === 'teacher'
          ? 'bg-navy/8 text-navy border-navy/15'
          : 'bg-navy-light/10 text-navy-light border-navy-light/20'
        }`}>
        {role}
      </span>
    </div>
  )
}
