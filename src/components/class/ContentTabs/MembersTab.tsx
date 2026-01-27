'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, Mail, ShieldCheck, GraduationCap } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Loader from '@/components/layout/Loader'

interface MembersTabProps {
  classId: string
  isTeacher: boolean
  userId: string
}

export default function MembersTab({ classId, isTeacher, userId }: MembersTabProps) {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadMembers()
  }, [classId])

  const loadMembers = async () => {
    const { data, error } = await supabase
      .from('class_members')
      .select('*, users(full_name, email, avatar_url)')
      .eq('class_id', classId)
      .order('role', { ascending: false })
      .order('joined_at', { ascending: true })

    if (!error && data) {
      setMembers(data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <Loader text='Loading members' border='border-navy' />
    )
  }

  const teachers = members.filter((m) => m.role === 'teacher')
  const students = members.filter((m) => m.role === 'student')

  // Helper to get initials
  const getInitial = (name: string) => name?.charAt(0).toUpperCase() || "?"

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      
      {/* Teachers Section */}
      {teachers.length > 0 && (
        <section>
          <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-4">
            <h3 className="text-xl font-bold text-navy flex items-center gap-2">
              <ShieldCheck className="text-accent" size={22} />
              Teachers
            </h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {teachers.length} {teachers.length === 1 ? 'Host' : 'Hosts'}
            </span>
          </div>
          
          <div className="space-y-0 divide-y divide-gray-200">
            {teachers.map((member) => (
              <div key={member.id} className="py-4 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border-2 border-accent/20">
                    <AvatarImage src={member.users?.avatar_url} alt={member.users?.full_name} />
                    <AvatarFallback className="bg-navy text-accent font-bold">
                      {getInitial(member.users?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-navy transition-colors">
                      {member.users?.full_name || "Unknown Teacher"}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Mail size={12} /> {member.users?.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Students Section */}
      <section>
        <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-4">
          <h3 className="text-xl font-bold text-navy flex items-center gap-2">
            <GraduationCap className="text-navy-light" size={22} />
            Students
          </h3>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {students.length} Enrolled
          </span>
        </div>

        {students.length === 0 ? (
          <div className="py-12 text-center bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
            <p className="text-gray-500 italic">No students have joined yet.</p>
          </div>
        ) : (
          <div className="space-y-0 divide-y divide-gray-200">
            {students.map((member) => (
              <div key={member.id} className="py-4 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarImage src={member.users?.avatar_url} alt={member.users?.full_name} />
                    <AvatarFallback className="bg-gray-100 text-navy-light font-bold">
                      {getInitial(member.users?.full_name || member.users?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-800 group-hover:text-navy transition-colors">
                      {member.users?.full_name || member.users?.email}
                    </p>
                    <p className="text-xs text-gray-500">{member.users?.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}