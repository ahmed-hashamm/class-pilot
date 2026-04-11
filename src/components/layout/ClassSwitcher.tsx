'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ChevronDown, GraduationCap, Users, LayoutDashboard } from 'lucide-react'
import { getClassSwitcherData, SwitcherClass } from '@/lib/db_data_fetching/class-switcher'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * A dropdown component that allows users to switch between their classes
 * without leaving the class dashboard.
 */
export default function ClassSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [classes, setClasses] = useState<SwitcherClass[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Extract classId from pathname: /dashboard/classes/[id]
  const match = pathname.match(/\/classes\/([^/]+)/);
  const currentClassId = match ? match[1] : null;

  useEffect(() => {
    async function loadClasses() {
      try {
        const data = await getClassSwitcherData()
        setClasses(data)
      } catch (err) {
        console.error('Failed to load switcher classes:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadClasses()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentClass = classes.find(c => c.id === currentClassId)

  if (isLoading || classes.length === 0) return null

  const triggerLabel = currentClass ? currentClass.name : "Switch Class"

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all group shrink-0 backdrop-blur-sm shadow-sm"
      >
        <span className="text-[13px] font-bold text-white tracking-tight">
          {triggerLabel}
        </span>
        <ChevronDown
          size={14}
          className={`text-white/50 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.3 }}
            className="absolute right-0 mt-3 w-[calc(100vw-4rem)] max-w-sm sm:w-72 bg-white border border-border shadow-[0_40px_80px_rgba(0,0,0,0.25)] rounded-2xl overflow-hidden z-[9999]"
          >
            <div className="px-4 py-3 border-b border-border bg-gray-50/50">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-navy/40">Switch Class</span>
            </div>

            <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-1">
              {classes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    router.push(`/classes/${c.id}`)
                    setIsOpen(false)
                  }}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all text-left group
                    ${c.id === currentClassId
                      ? 'bg-navy/5 border-navy/10 shadow-sm'
                      : 'hover:bg-gray-50 border-transparent'
                    } border-2`}
                >
                  <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
                    ${c.id === currentClassId
                      ? 'bg-navy text-yellow scale-105'
                      : 'bg-gray-100 text-gray-500 group-hover:bg-navy/10 group-hover:text-navy group-hover:scale-105'
                    }`}>
                    {c.isTeacher ? <GraduationCap size={18} /> : <Users size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13.5px] font-bold truncate leading-tight ${c.id === currentClassId ? 'text-navy' : 'text-foreground'}`}>
                      {c.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full border
                        ${c.isTeacher
                          ? 'bg-blue-50 border-blue-100 text-blue-600'
                          : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                        {c.isTeacher ? 'Teacher' : 'Student'}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-2 border-t border-border bg-gray-50/30">
              <button
                onClick={() => {
                  router.push('/dashboard')
                  setIsOpen(false)
                }}
                className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl hover:bg-navy hover:text-white hover:shadow-lg text-[11px] font-black uppercase tracking-[0.1em] text-navy transition-all duration-300"
              >
                <LayoutDashboard size={14} />
                Return to Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
