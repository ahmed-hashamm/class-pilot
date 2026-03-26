'use client'

import { Plus, Users2, ArrowRight, FolderOpen } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { classService } from '@/services/classService'
import { toast } from 'sonner'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { Button } from '@/components/ui/button'

interface ProjectsTabProps {
  classId: string
  isTeacher: boolean
  userId: string
}

export default function ProjectsTab({ classId, isTeacher }: ProjectsTabProps) {
  const { data: projects = [] as any[], isLoading, error, refetch } = useQuery({
    queryKey: ['projects', classId],
    queryFn: () => classService.getProjects(classId),
  })

  if (isLoading) {
    return <div className="py-6"><SkeletonLoader variant="card" count={4} /></div>
  }

  if (error) {
    return <ErrorState message="Failed to load projects." onRetry={refetch} />
  }

  return (
    <div className="flex flex-col gap-5 py-6">
      {/* Teacher CTA */}
      {isTeacher && projects.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={() => toast.info('Create group project feature coming soon')}
            className="inline-flex items-center gap-2 bg-navy text-white font-semibold text-[13px] px-5 py-2.5 rounded-xl hover:bg-navy/90 hover:-translate-y-0.5 transition-all cursor-pointer border-none shadow-sm"
          >
            <Plus size={15} />
            Create group project
          </Button>
        </div>
      )}

      {/* Empty state */}
      {projects.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="No group projects yet"
          description={
            isTeacher
              ? 'Create a group project and assign students to collaborate in real-time.'
              : "Your teacher hasn't created any group projects yet."
          }
          actionLabel={isTeacher ? 'Create first project' : undefined}
          actionIcon={isTeacher ? Plus : undefined}
          onAction={isTeacher ? () => toast.info('Create group project feature coming soon') : undefined}
        />
      ) : (
        /* Projects grid */
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Project card ─────────────────────────────────────────────────────────── */
function ProjectCard({ project }: { project: any }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="shrink-0 size-10 rounded-xl bg-navy/8 border border-navy/15 flex items-center justify-center">
          <FolderOpen size={17} className="text-navy" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[15px] text-foreground tracking-tight truncate group-hover:text-navy transition-colors">
            {project.name}
          </h4>
          {project.description && (
            <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-[11px] text-muted-foreground font-medium">
          {new Date(project.created_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </span>
        <button
          onClick={() => toast.info('View details coming soon')}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-navy hover:gap-2.5 transition-all duration-200 cursor-pointer bg-transparent border-none"
        >
          View details
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  )
}
