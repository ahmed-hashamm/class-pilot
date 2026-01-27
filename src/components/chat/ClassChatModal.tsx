'use client'

import { useState } from 'react'
import ClassChat from './ClassChat'
import { MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ClassChatModalProps {
  classId: string
}

export default function ClassChatModal({ classId }: ClassChatModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-white shadow-lg hover:bg-accent-foreground transition-all duration-500"
      >
        <MessageCircle size={18} />
        Ask Class AI
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="relative w-full sm:max-w-lg h-[80vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-semibold text-gray-800">
                Class Assistant
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </Button>
            </div>

            {/* Chat */}
            <div className="flex-1 overflow-hidden">
              <ClassChat classId={classId} />
            </div>

          </div>
        </div>
      )}
    </>
  )
}
