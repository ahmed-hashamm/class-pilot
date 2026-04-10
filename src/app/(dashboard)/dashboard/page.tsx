import { getUserDashboardData } from '@/lib/db_data_fetching/dashboard'
import DashboardBanner from '@/components/features/dashboard/DashboardBanner'
import ClassList from '@/components/features/dashboard/ClassList'
import { Plus, Link as LinkIcon, BookOpen } from 'lucide-react'
import { Button, EmptyState } from '@/components/ui'

export default async function DashboardPage() {
  const result = await getUserDashboardData()
  if (!result) return null

  const { user, dashboardData, error } = result

  if (error) {
    return <p className="p-8 text-muted-foreground text-sm">Error loading dashboard.</p>
  }

  const userName = user.user_metadata?.full_name || 'User'
  const isEmpty = !dashboardData || dashboardData.length === 0

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <DashboardBanner userName={userName} userId={user.id} />

      <div className="w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-10 md:py-14">
        {isEmpty ? (
          <EmptyState
            variant="dashboard"
            icon={BookOpen}
            title="Ready to start?"
            description="Create your first premium classroom or join an existing one using a code from your teacher."
            actions={
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="px-8 py-6 rounded-2xl shadow-lg hover:shadow-navy/20 transition-all">
                  <Plus size={18} />
                  <span className="font-black text-[15px]">Create a class</span>
                </Button>
                
                <Button variant="outline" size="lg" className="px-8 py-6 rounded-2xl bg-white hover:bg-zinc-50 border-zinc-200 transition-all font-bold">
                  <LinkIcon size={18} />
                  <span className="text-[15px]">Join with code</span>
                </Button>
              </div>
            }
          />
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between px-2">
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-navy/40">
                Your Classrooms · {dashboardData.length}
              </p>
            </div>
            <ClassList dashboardData={dashboardData} />
          </div>
        )}
      </div>
    </div>
  )
}
