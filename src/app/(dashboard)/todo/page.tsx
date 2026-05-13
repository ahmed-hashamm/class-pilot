import { getTodoPageData } from "@/lib/db_data_fetching/todo";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui";
import TodoPageClient from "@/components/features/todo/TodoPageClient";

export default async function TodoPage() {
  const { user, done, missing, assigned, myGroupIds, teacherActive, teacherEnded, hasTeacherClasses } = await getTodoPageData();

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 flex flex-col gap-6">
      <PageHeader
        title="My Assignments"
        description="Track your individual and team progress"
        icon={<CheckCircle2 className="text-navy" size={24} />}
        backHref="/dashboard"
        backLabel="Back to dashboard"
      />

      <TodoPageClient
        done={done}
        missing={missing}
        assigned={assigned}
        userId={user.id}
        myGroupIds={myGroupIds}
        teacherActive={teacherActive}
        teacherEnded={teacherEnded}
        hasTeacherClasses={hasTeacherClasses}
      />
    </div>
  );
}
