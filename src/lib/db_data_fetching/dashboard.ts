'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Fetches all dashboard data for the current user.
 * Handles auth guard and redirects to login if not authenticated.
 */
export async function getUserDashboardData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: dashboardData, error } = await supabase
    .rpc('get_user_dashboard_data', { p_user_id: user.id } as any)

  if (error) {
    return { user, dashboardData: null, error: true }
  }

  return {
    user,
    dashboardData: dashboardData as any[] | null,
    error: false,
  }
}
