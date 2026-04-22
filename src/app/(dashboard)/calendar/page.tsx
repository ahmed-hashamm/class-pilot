import { getCalendarPageData } from "@/lib/db_data_fetching/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { PageHeader } from "@/components/ui";
import CalendarPageClient from "@/components/features/calendar/CalendarPageClient";

export default async function CalendarPage() {
  const { 
    studentAssignments, 
    teacherAssignments,
    done,
    missing,
    assigned,
    teacherActive,
    teacherEnded,
    hasTeacherClasses 
  } = await getCalendarPageData();

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 flex flex-col gap-4">
      <PageHeader
        title="Calendar"
        description="Schedule and upcoming deadlines"
        icon={<CalendarIcon className="text-navy" size={24} />}
        backHref="/dashboard"
        backLabel="Dashboard"
      />

      <CalendarPageClient
        studentAssignments={studentAssignments}
        teacherAssignments={teacherAssignments}
        done={done}
        missing={missing}
        assigned={assigned}
        teacherActive={teacherActive}
        teacherEnded={teacherEnded}
        hasTeacherClasses={hasTeacherClasses}
      />
    </div>
  );
}
