// 
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

function parseCriteria(raw: unknown): RubricCriterion[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (c): c is RubricCriterion =>
      typeof c === 'object' &&
      c !== null &&
      typeof c.id === 'string' &&
      typeof c.name === 'string' &&
      typeof c.points === 'number'
  )
}

export async function getRubricsList() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: rubricsData } = await supabase
    .from('rubrics')
    .select('*')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })

  const rubrics: Rubric[] = (rubricsData || []).map((r: RubricRow) => {
    const { criteria, ...rest } = r
    return {
      ...rest,
      criteria: parseCriteria(criteria)
    }
  })
  return { user, rubrics }
}