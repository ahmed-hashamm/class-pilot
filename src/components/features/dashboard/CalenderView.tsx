"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"

type Assignment = {
  id: string;
  title: string;
  due_date: string;
  points: number;
  classes: { name: string; id: string } | null;
  isDone: boolean;
};

interface CalenderViewProps {
  assignments: Assignment[];
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalenderView({ assignments }: CalenderViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Move forward/back months
  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Generate boxes for exactly 42 slots (6 weeks)
  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - firstDayOfMonth + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      return dayNumber;
    }
    return null;
  });

  // Get assignments for a given day
  const getAssignmentsForDay = (day: number) => {
    // We adjust month to be 1-indexed and pad properly for local ISO comparison
    const targetDate = new Date(currentYear, currentMonth, day);
    // get local date string YYYY-MM-DD
    const pad = (n: number) => n.toString().padStart(2, "0");
    const dateStr = `${targetDate.getFullYear()}-${pad(targetDate.getMonth() + 1)}-${pad(targetDate.getDate())}`;

    return assignments.filter((a) => a.due_date.startsWith(dateStr));
  };

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  return (
    <div className="flex flex-col">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 px-6 border-b">
        <span className="font-bold text-xl text-navy">
          {monthName} {currentYear}
        </span>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
            className="mr-2 text-sm font-semibold rounded-lg text-slate-700 h-auto py-1.5 px-3"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={prevMonth}
            className="p-2 h-auto text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft size={20} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextMonth}
            className="p-2 h-auto text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 border-b">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-[12px] tracking-wider font-bold text-muted-foreground uppercase opacity-70"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid of Days */}
      <div className="grid grid-cols-7 auto-rows-[130px] bg-slate-100 gap-[1px] border-b">
        {days.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="bg-white/80 min-h-[130px]" />;

          const dayAssignments = getAssignmentsForDay(day);
          const isToday =
            new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();

          return (
            <div
              key={day}
              className={`bg-white min-h-[130px] p-2 flex flex-col gap-2 ${
                isToday ? "bg-blue-50/20" : ""
              }`}
            >
              <div className="flex items-center justify-end w-full">
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-sm text-sm font-semibold ${
                    isToday ? "bg-navy text-yellow rounded-md" : "text-slate-700"
                  }`}
                >
                  {day}
                </span>
              </div>

              {/* Assignment stack */}
              <div className="flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden max-h-[85px] custom-scrollbar">
                {dayAssignments.map((a) => {
                  const href = a.classes ? `/classes/${a.classes.id}/assignments/${a.id}` : '#';
                  
                  return (
                    <Link
                      key={a.id}
                      href={href}
                      title={a.title}
                      className={`px-2 py-1.5 rounded-md text-[11px] font-medium truncate border flex items-center gap-1.5 transition-shadow hover:shadow-sm ${
                        a.isDone
                          ? "bg-green-50 border-green-200 text-green-700 hover:border-green-300"
                          : "bg-white border-slate-200 text-slate-800 hover:border-slate-300"
                      }`}
                    >
                      {a.isDone ? (
                        <CheckCircle2 size={13} className="text-green-600 flex-shrink-0" />
                      ) : (
                        <Circle size={13} className="text-yellow flex-shrink-0" />
                      )}
                      <span className="truncate">{a.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
