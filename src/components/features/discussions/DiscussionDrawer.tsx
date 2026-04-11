'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { DiscussionTopic } from '@/lib/validations/discussion'
import { useDiscussion } from '@/lib/hooks/useDiscussion'
import DiscussionPanel from './DiscussionPanel'
import { cn } from '@/lib/utils'
import { HEIGHT_TRANSITION } from '@/lib/animations'

interface DiscussionDrawerProps {
  classId: string
  topic: DiscussionTopic
  userId: string
  isTeacher: boolean
}

const TOPIC_LABELS: Record<DiscussionTopic, string> = {
  assignments: 'Work Discussion',
  materials: 'Materials Discussion',
  groups: 'Group Discussion',
}

export default function DiscussionDrawer({ classId, topic, userId, isTeacher }: DiscussionDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { messages } = useDiscussion(classId, topic, userId)

  return (
    <div className="lg:hidden w-full">
      {/* Accordion Container - In-flow */}
      <div className={cn(
        "bg-white border-y border-navy/[0.15] overflow-hidden flex flex-col transition-all duration-300",
        isOpen ? "mb-8 pb-4" : "mb-4"
      )}>
        {/* Toggle Bar / Header Click Area - Visual Reference Style */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="h-[50px] flex items-center px-2 cursor-pointer hover:bg-navy/[0.01] active:bg-navy/[0.02] transition-colors shrink-0"
        >
          <div className="flex-1 flex items-center gap-4">
            <span className="text-[11px] font-black tracking-[0.15em] text-navy/30 uppercase whitespace-nowrap">
              {TOPIC_LABELS[topic]}
            </span>
            <div className="h-[1px] flex-1 bg-navy/[0.04]" />
            <div className="flex items-center gap-3">
              {/* <div className="bg-navy/[0.04] text-navy/60 text-[11px] font-bold h-6 px-2.5 rounded-full flex items-center justify-center min-w-[24px]">
                {messages.length}
              </div> */}
              <div className="text-navy/30 transition-transform duration-300">
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area - Slides down */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              variants={HEIGHT_TRANSITION}
              initial="initial"
              animate="animate"
              exit="exit"
              className="overflow-hidden px-2"
            >
              <div className="pt-2">
                <DiscussionPanel
                  classId={classId}
                  topic={topic}
                  userId={userId}
                  isTeacher={isTeacher}
                  hideHeader={true}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
