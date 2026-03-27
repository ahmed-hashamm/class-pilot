import { getUserDashboardData } from '@/lib/db_data_fetching/dashboard'
import DashboardBanner from '@/components/features/dashboard/DashboardBanner'
import ClassCard from '@/components/features/dashboard/ClassCard'

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
    <div className="min-h-screen bg-background">
      <DashboardBanner userName={userName} userId={user.id} />

      <div className="w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-8">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-center
            py-20 border-2 border-dashed border-border rounded-2xl bg-white">

            <div className="size-16 rounded-2xl bg-navy/8 border border-navy/15
              flex items-center justify-center mb-5">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="3" y="5" width="22" height="18" rx="4" stroke="#043873" strokeWidth="1.8" />
                <path d="M9 11h10M9 15h7" stroke="#043873" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="21" cy="21" r="6" fill="white" stroke="#043873" strokeWidth="1.5" />
                <path d="M21 18v3l2 1" stroke="#043873" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>

            <h2 className="font-black text-[22px] tracking-tight mb-2">
              No classes yet
            </h2>
            <p className="text-[14px] text-muted-foreground max-w-xs mb-8 leading-relaxed">
              Create your first classroom or join one using a class code from your teacher.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <button className="inline-flex items-center gap-2 bg-navy text-white
                font-semibold text-[14px] px-6 py-3 rounded-lg
                hover:bg-navy/90 hover:-translate-y-0.5 transition-all
                cursor-pointer border-none">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                Create a class
              </button>
              <button className="inline-flex items-center gap-2 bg-secondary border border-border
                text-foreground font-semibold text-[14px] px-6 py-3 rounded-lg
                hover:border-navy/30 hover:-translate-y-0.5 transition-all cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Join a class
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {dashboardData.map((item: any) => (
              <ClassCard
                key={item.class_id}
                classId={item.class_id}
                classData={item.classes}
                role={item.role}
                isPinned={item.is_pinned}
                studentCount={item.student_count || 0}
                assignments={item.assignments || []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
