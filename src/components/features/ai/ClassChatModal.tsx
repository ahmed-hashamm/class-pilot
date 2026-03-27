'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ClassChat from './ClassChat'
import { MessageCircle, X, Sparkles } from 'lucide-react'
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2
          rounded-xl bg-navy px-5 py-3 text-white shadow-lg
          hover:bg-navy/90
          transition-all cursor-pointer border-none
          group"
      >
        <Sparkles size={16} className="text-yellow" />
        <span className="text-[13px] font-semibold">Ask Class AI</span>
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
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Modal */}
            <motion.div 
              variants={MODAL_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={SPRING_TRANSITION}
              className="relative w-full sm:max-w-lg h-[75vh]
                bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl
                flex flex-col overflow-hidden"
            >

              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 z-10 size-8 rounded-lg
                  bg-secondary border border-border
                  flex items-center justify-center
                  text-muted-foreground hover:text-foreground hover:bg-secondary/80
                  transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>

              {/* Chat */}
              <ClassChat classId={classId} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
