'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Users } from 'lucide-react'
import { useState } from 'react'

interface ClassCardHeaderProps {
  classId: string
  name: string
  role: string
  studentCount: number
  teacher: {
    full_name: string
    avatar_url: string | null
  }
}

export function ClassCardHeader({
  classId,
  name,
  role,
  studentCount,
  teacher,
}: ClassCardHeaderProps) {
  const [imgError, setImgError] = useState(false)
  const isTeacher = role.toLowerCase() === 'teacher'
  const teacherName = teacher?.full_name || 'Teacher'

  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex-1 min-w-0 pr-1">
        <Link href={`/classes/${classId}`}>
          <h3 className="font-bold text-[16px] text-foreground hover:text-navy
            transition-colors line-clamp-1 tracking-tight mb-1">
            {name}
          </h3>
        </Link>

        {/* Role badge */}
        <span className={`inline-flex items-center text-[10px] font-bold
          tracking-widest uppercase rounded-full px-2.5 py-0.5
          ${isTeacher
            ? 'bg-navy/8 text-navy border border-navy/15'
            : 'bg-navy-light/12 text-navy-light border border-navy-light/25'
          }`}>
          {role}
        </span>

        {/* Student count */}
        <div className="flex items-center gap-1 mt-2 text-[12px] text-muted-foreground">
          <Users size={11} />
          <span>{studentCount} student{studentCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Teacher avatar */}
      <div className="shrink-0 size-11 rounded-xl overflow-hidden border border-border
        bg-secondary flex items-center justify-center relative shadow-sm">
        {teacher?.avatar_url && !imgError ? (
          <Image
            src={teacher.avatar_url}
            alt={teacherName}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-[15px] font-black text-navy">
            {teacherName.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  )
}
