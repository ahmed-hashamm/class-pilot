'use server'

import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'
import { redirect } from 'next/navigation'

type RubricRow = Database['public']['Tables']['rubrics']['Row']

interface RubricCriterion {
  id: string
  name: string
  description?: string
  points: number
}

export type Rubric = Omit<RubricRow, 'criteria'> & {
  criteria: RubricCriterion[]
}

/**
 * Fetches the rubrics list for the current user.
 */
export async function getRubricsList() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: rubricsData } = await supabase
    .from('rubrics')
    .select('*')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })

  const rubrics: Rubric[] = (rubricsData || []).map(r => ({
    ...r,
    criteria: (r.criteria as unknown) as RubricCriterion[]
  }))

  return { user, rubrics }
}
