'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ProjectsTabProps {
  classId: string
  isTeacher: boolean
  userId: string
}

export default function ProjectsTab({ classId, isTeacher, userId }: ProjectsTabProps) {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadProjects()
  }, [classId, userId])

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('group_projects')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setProjects(data)
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>
  }

  return (
    <div className="space-y-4">
      {isTeacher && (
        <div className="flex justify-end">
          <Button variant="primary" onClick={() => {
            // TODO: Open create project modal
            alert('Create group project feature coming soon')
          }}>
            Create Group Project
          </Button>
        </div>
      )}

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-600">
            No group projects yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                {project.description && (
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

