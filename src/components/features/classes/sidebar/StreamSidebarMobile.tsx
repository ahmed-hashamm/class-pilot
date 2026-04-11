'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui'
import { HEIGHT_TRANSITION } from '@/lib/animations'
import ClassCodeCard from './ClassCodeCard'
import DueSoonCard from './DueSoonCard'
import StickyNotes from './StickyNotes'

interface StreamSidebarMobileProps {
  classId: string
  classCode: string
  isTeacher: boolean
  isCodeHidden: boolean
  assignments: any[]
}

/**
 * Refined tab-style mobile sidebar.
 * Optimized for a full-width, seamless navigation feel.
 */
export default function StreamSidebarMobile({
  classId,
  classCode,
  isTeacher,
  isCodeHidden,
  assignments,
}: StreamSidebarMobileProps) {
  const [activeBox, setActiveBox] = useState<'code' | 'due' | 'notes' | null>(null)

  const boxes = [
    { id: 'code', label: 'Class Code' },
    { id: 'due', label: 'Due Soon' },
    { id: 'notes', label: 'My Notes' },
  ] as const

  return (
    <div className="flex flex-col gap-2 mb-3 lg:hidden">

      <div className="flex items-center bg-white border-b-2 border-border shadow-sm -mx-4 overflow-hidden">
        {boxes.map((box, i) => {
          const isActive = activeBox === box.id

          return (
            <React.Fragment key={box.id}>
              <motion.div className="flex-1" whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  onClick={() => setActiveBox(isActive ? null : box.id)}
                  className={`w-full py-4 h-auto text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative rounded-none
                    ${isActive ? 'text-navy' : 'text-navy/45 hover:text-navy/60'}`}
                >
                  {box.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-navy"
                      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    />
                  )}
                </Button>
              </motion.div>

              {/* Consistent, sharp separator lines */}
              {i < boxes.length - 1 && (
                <div className="h-6 border-l border-navy/[0.3] shrink-0" />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Expanded Content Area with Animation */}
      <AnimatePresence mode="wait">
        {activeBox && (
          <motion.div
            key={activeBox}
            variants={HEIGHT_TRANSITION}
            initial="initial"
            animate="animate"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="pt-1 pb-1">
              {activeBox === 'code' && (
                <ClassCodeCard
                  classCode={classCode}
                  isTeacher={isTeacher}
                  isCodeHidden={isCodeHidden}
                />
              )}
              {activeBox === 'due' && (
                <DueSoonCard assignments={assignments} />
              )}
              {activeBox === 'notes' && (
                <StickyNotes classId={classId} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
