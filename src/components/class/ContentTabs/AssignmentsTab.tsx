'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import Link from 'next/link'
import { ClipboardList, Calendar, Award, Plus, Paperclip } from 'lucide-react'
import Loader from '@/components/layout/Loader'

interface AssignmentsTabProps {
  classId: string
  isTeacher: boolean
  userId: string
}

export default function AssignmentsTab({ classId, isTeacher, userId }: AssignmentsTabProps) {
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadAssignments()
  }, [classId, userId])

  const loadAssignments = async () => {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setAssignments(data)
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
      <Loader text="Loading assignments" border="border-orange-500"/> 

    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center justify-between border-b border-gray-300 pb-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
          <p className="text-sm text-gray-500">View and manage coursework</p>
        </div>
        {isTeacher && (
          <Link className='w-full md:w-fit' href={`/classes/${classId}/assignments/create`}>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white w-full md:w-fit rounded-full px-6 shadow-md shadow-orange-100 transition-all">
              <Plus className="mr-2 h-4 w-4" /> Create Assignment
            </Button>
          </Link>
        )}
      </div>

      {assignments.length === 0 ? (
        <Card className="border-dashed border-2 bg-gray-50/50">
          <CardContent className="py-20 text-center">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No assignments yet.</p>
            {isTeacher && <p className="text-sm text-gray-400">Click the button above to get started.</p>}
          </CardContent>
        </Card>
      ) : (
        /* Darker border color applied via divide-gray-300 and border-gray-300 */
        <div className="space-y-0 ">
          {assignments.map((assignment) => (
            /* Wrapped in Link for full row redirect functionality */
            <Link 
              key={assignment.id} 
              href={`/classes/${classId}/assignments/${assignment.id}`}
              className="group block relative bg-white transition-all border-b border-slate-300 hover:bg-orange-50/30"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                    <ClipboardList size={24} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-bold text-gray-900 truncate group-hover:underline decoration-orange-500 underline-offset-4">
                        {assignment.title}
                      </h3>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 shrink-0">
                        <Award size={14} className="text-orange-500" />
                        {assignment.points} pts
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {assignment.description || "No description provided."}
                    </p>

                    {/* Metadata: Date & Files */}
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {assignment.due_date && (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                            <Calendar size={14} className="text-orange-500" />
                            Due: {format(new Date(assignment.due_date), 'MMM d, h:mm a')}
                          </div>
                        )}
                      </div>

                      {/* Attachments (Small preview) */}
                      {(assignment.attachment_paths || assignment.attachments) && (
                        <div className="flex flex-wrap gap-2">
                          {(assignment.attachment_paths || assignment.attachments).map((path: any, idx: number) => {
                             const filePath = typeof path === 'string' ? path : path.path;
                             return (
                               <div key={idx} className="flex items-center gap-1 text-[11px] bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-500">
                                 <Paperclip size={10} className="text-orange-500" />
                                 <span className="max-w-[100px] truncate">{getDisplayName(filePath)}</span>
                               </div>
                             );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}