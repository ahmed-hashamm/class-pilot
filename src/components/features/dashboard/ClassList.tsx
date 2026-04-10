'use client'

import { motion } from 'framer-motion'
import { ClassCard } from '@/components/features/dashboard/ClassCard/index'
import { STAGGER_CONTAINER, STAGGER_ITEM } from '@/lib/animations'

interface ClassListProps {
  dashboardData: any[]
}

export default function ClassList({ dashboardData }: ClassListProps) {
  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="initial"
      animate="animate"
      className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
    >
      {dashboardData.map((item: any) => (
        <motion.div key={item.class_id} variants={STAGGER_ITEM}>
          <ClassCard
            classId={item.class_id}
            classData={item.classes}
            role={item.role}
            isPinned={item.is_pinned}
            studentCount={item.student_count || 0}
            assignments={item.assignments || []}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
