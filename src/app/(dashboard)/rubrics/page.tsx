import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, FileText, ChevronRight, Pencil, ChevronLeft } from 'lucide-react'

interface RubricCriterion {
  id: string;
  name: string;
  description?: string;
  points: number;
}

interface Rubric {
  id: string;
  name: string;
  total_points: number;
  criteria: RubricCriterion[] | any;
  created_at: string;
}

export default async function RubricsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: rubrics } = await supabase
    .from('rubrics')
    .select('*')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false }) as { data: Rubric[] | null }

  return (
    // Max-width 4xl and mx-auto centers the entire block
    <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* 1. TOP NAVIGATION */}
            <div className="flex items-center justify-between">
        <Link 
          href="/dashboard" 
          className="flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors gap-1"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </Link>
        {/* <Link href={`/rubrics/${rubric.id}/edit`} className="flex items-center p-2 border rounded-md text-sm font-medium bg-white text-orange-600 hover:text-white hover:bg-orange-600 transition-colors gap-2">
          <Pencil size={14} />
          Edit Rubric
        </Link> */}
      </div>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Rubrics</h1>
          <p className="text-muted-foreground mt-1">Manage your evaluation standards in one place.</p>
        </div>
        <Link className='w-full md:w-fit' href="/rubrics/create">
          <Button className="bg-orange-600 hover:bg-orange-700 shadow-sm gap-2">
            <Plus size={18} />
            New Rubric
          </Button>
        </Link>
      </div>

      {/* List View Section */}
      {rubrics && rubrics.length > 0 ? (
        <div className="flex flex-col gap-3">
          {rubrics.map((rubric) => (
            <Link key={rubric.id} href={`/rubrics/${rubric.id}`}>
              <Card className="group hover:border-orange-200 transition-all hover:shadow-md cursor-pointer overflow-hidden">
                <div className="flex items-center p-4 sm:p-6 gap-4">
                  
                  {/* Icon/Avatar */}
                  <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-100 transition-colors">
                    <FileText size={24} />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {rubric.name}
                      </h3>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                        {Array.isArray(rubric.criteria) ? rubric.criteria.length : 0} criteria
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Created {new Date(rubric.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Points Display */}
                  <div className="text-right shrink-0">
                    <div className="text-xl font-bold text-gray-900 tabular-nums">
                      {rubric.total_points}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      Points
                    </div>
                  </div>

                  {/* Arrow indicating clickability */}
                  <div className="text-gray-300 group-hover:text-orange-400 transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="border-dashed border-2">
          <CardContent className="py-20 flex flex-col items-center text-center">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="text-gray-300" size={40} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No rubrics found</h3>
            <p className="text-gray-500 mb-6 max-w-xs">
              Start by creating your first grading rubric to simplify your feedback process.
            </p>
            <Link href="/rubrics/create">
              <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                Create Your First Rubric
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}