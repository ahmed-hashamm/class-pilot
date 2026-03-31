import ClassPageSkeleton from '@/components/features/classes/ClassPageSkeleton'

/**
 * Next.js loading boundary for the class dashboard.
 * Renders a high-fidelity skeleton to provide instant feedback while class data is being fetched.
 */
export default function Loading() {
  return <ClassPageSkeleton />
}
