'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface RubricCriterion {
  id: string
  name: string
  description?: string
  points: number
}

export interface Rubric {
  id: string
  name: string
  total_points: number
  criteria: RubricCriterion[] | any
  created_at: string
}

/**
 * Fetches the rubrics list for the current user.
 */
export async function getRubricsList() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: rubrics } = await supabase
    .from('rubrics')
    .select('id, name, total_points, criteria, created_at')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false }) as { data: Rubric[] | null }

  return { user, rubrics: rubrics || [] }
}
