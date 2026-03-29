'use server'

import { createClient } from '@/lib/supabase/server'

export interface SwitcherClass {
  id: string
  name: string
  isTeacher: boolean
}

/**
 * Fetches all classes for the current user (as teacher or student)
 * for the Class Switcher component.
 */
export async function getClassSwitcherData(): Promise<SwitcherClass[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Fetch classes where user is a member
  const { data: memberClasses, error: memberError } = await supabase
    .from('class_members')
    .select('role, classes(id, name, created_by)')
    .eq('user_id', user.id)

  if (memberError) {
    console.error('Error fetching switcher member data:', memberError)
    return []
  }

  // Fetch classes where user is the creator (teacher)
  const { data: ownedClasses, error: ownedError } = await supabase
    .from('classes')
    .select('id, name, created_by')
    .eq('created_by', user.id)

  if (ownedError) {
    console.error('Error fetching switcher owned data:', ownedError)
    return []
  }

  // Combine and deduplicate
  const classMap = new Map<string, SwitcherClass>()

  ownedClasses?.forEach((c: any) => {
    classMap.set(c.id, {
      id: c.id,
      name: c.name,
      isTeacher: true
    })
  })

  memberClasses?.forEach((m: any) => {
    if (m.classes) {
      const c = m.classes
      if (!classMap.has(c.id)) {
        classMap.set(c.id, {
          id: c.id,
          name: c.name,
          isTeacher: m.role === 'teacher' || c.created_by === user.id
        })
      }
    }
  })

  return Array.from(classMap.values()).sort((a, b) => a.name.localeCompare(b.name))
}
