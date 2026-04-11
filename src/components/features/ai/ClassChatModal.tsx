'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ClassChat from './ClassChat'
import { MessageCircle, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui'
import { MODAL_VARIANTS, FADE_IN, SPRING_TRANSITION } from '@/lib/animations'

interface ClassChatModalProps {
  classId: string
}

export default function ClassChatModal({ classId }: ClassChatModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center
          rounded-full bg-navy px-4 py-3.5 text-white shadow-xl
          hover:bg-navy/90 border-none cursor-pointer
          group transition-all duration-300"
      >
        <Sparkles size={18} className="text-yellow shrink-0" />
        <motion.span
          variants={{
            rest: { width: 0, opacity: 0, marginLeft: 0 },
            hover: { width: 'auto', opacity: 1, marginLeft: 10 }
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="text-[13px] font-bold tracking-wide overflow-hidden whitespace-nowrap"
        >
          Ask Class AI
        </motion.span>
      </motion.button>


      {/* Modal Overlay */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <motion.div
              variants={FADE_IN}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Modal */}
            <motion.div
              variants={MODAL_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                duration: 0.35,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="relative w-full sm:max-w-lg h-[85vh]
                bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl
                flex flex-col overflow-hidden"
            >

              {/* Chat Content */}
              <ClassChat
                classId={classId}
                onClose={() => setOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
