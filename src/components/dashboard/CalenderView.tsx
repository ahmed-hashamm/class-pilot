'use client'

import React, { useState } from 'react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth,
  addMonths,
  subMonths
} from 'date-fns'
import { cn } from '@/lib/utils'
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Assignment {
  id: string
  title: string
  due_date: string
  points: number
  isDone: boolean
  classes: { id: number; name: string } | null
}

interface CalendarViewProps {
  assignments: Assignment[]
}

export default function CalendarView({ assignments }: CalendarViewProps) {
  // 1. Manage the current view date in state
  const [viewDate, setViewDate] = useState(new Date())
  const today = new Date()
  
  const monthStart = startOfMonth(viewDate)
  const monthEnd = endOfMonth(viewDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  })

  // Navigation handlers
  const nextMonth = () => setViewDate(addMonths(viewDate, 1))
  const prevMonth = () => setViewDate(subMonths(viewDate, 1))
  const goToToday = () => setViewDate(new Date())

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Month Header with Navigation */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {format(viewDate, 'MMMM yyyy')}
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            {isSameMonth(viewDate, today) 
              ? `Today is ${format(today, 'EEEE, MMMM do')}`
              : `Viewing ${format(viewDate, 'MMMM')}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
          >
            Today
          </button>
          <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Days of the Week Header */}
      <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div 
            key={day} 
            className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-slate-100">
        {days.map((day) => {
          const dayAssignments = assignments.filter((assignment) =>
            isSameDay(new Date(assignment.due_date), day)
          )
          const isToday = isSameDay(day, today)
          const isCurrentMonth = isSameMonth(day, monthStart)

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[100px] bg-white p-2 transition-all hover:bg-slate-50/50 group",
                !isCurrentMonth && "bg-slate-50/30"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={cn(
                  "text-sm font-bold w-8 h-8 flex items-center justify-center rounded-lg transition-colors",
                  isToday 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                    : "text-slate-400 group-hover:text-slate-600",
                  !isCurrentMonth && "opacity-20"
                )}>
                  {format(day, 'd')}
                </span>
              </div>

              <div className="space-y-1">
                {dayAssignments.slice(0, 3).map((assignment) => (
                  <Link
                    key={assignment.id}
                    href={`/classes/${assignment.classes?.id}/assignments/${assignment.id}`}
                    className={cn(
                      "flex flex-col px-2 py-1 rounded border transition-all relative overflow-hidden group/item",
                      assignment.isDone 
                        ? "border-green-100 bg-green-50/50 hover:bg-green-100/80" 
                        : "border-indigo-100 bg-indigo-50/40 hover:bg-indigo-100"
                    )}
                  >
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className={cn(
                        "text-[8px] font-bold uppercase truncate leading-none",
                        assignment.isDone ? "text-green-600" : "text-indigo-500"
                      )}>
                        {assignment.classes?.name || 'Assignment'}
                      </span>
                      {assignment.isDone && (
                        <CheckCircle2 size={10} className="text-green-600 shrink-0" />
                      )}
                    </div>
                    
                    <span className={cn(
                      "text-[10px] font-semibold truncate leading-tight",
                      assignment.isDone 
                        ? "text-green-700 line-through opacity-70" 
                        : "text-slate-700"
                    )}>
                      {assignment.title}
                    </span>
                  </Link>
                ))}
                
                {dayAssignments.length > 3 && (
                  <div className="text-[9px] font-bold text-slate-400 pl-1">
                    + {dayAssignments.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {assignments.length === 0 && (
        <div className="p-20 flex flex-col items-center justify-center text-center bg-white">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
            <BookOpen className="text-slate-300" size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Assignments Yet</h3>
          <p className="text-slate-500 max-w-xs text-sm">
            Your calendar is looking clear. Upcoming deadlines will appear here.
          </p>
        </div>
      )}
    </div>
  )
}