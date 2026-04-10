import { getTodoPageData } from "@/lib/db_data_fetching/todo";
import {
  CheckCircle2, Inbox, Clock, AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/ui";
import { TodoSection, SummaryPill } from "@/components/features/todo";

export default async function TodoPage() {
  const { user, done, missing, assigned, myGroupIds } = await getTodoPageData();

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 flex flex-col gap-6">
      <PageHeader
        title="My Assignments"
        description="Track your individual and team progress"
        icon={CheckCircle2}
        backHref="/dashboard"
        backLabel="Back to dashboard"
      />

      {/* Summary badges */}
      <div className="flex gap-3 flex-wrap">
        <SummaryPill label="Assigned" count={assigned.length} variant="navy" />
        <SummaryPill label="Missing" count={missing.length} variant="red" />
        <SummaryPill label="Done" count={done.length} variant="green" />
      </div>

      <div className="flex flex-col gap-12">
        {/* Assigned Section */}
        <TodoSection
          title="Assigned"
          icon={<Clock size={16} />}
          items={assigned}
          emptyIcon={<Inbox size={32} />}
          emptyTitle="All caught up!"
          emptyDesc="No upcoming deadlines."
          status="assigned"
          userId={user.id}
          myGroupIds={myGroupIds}
        />

        {missing.length > 0 && (
          <TodoSection
            title="Missing"
            icon={<AlertCircle size={16} />}
            items={missing}
            emptyIcon={<CheckCircle2 size={32} />}
            emptyTitle="Nothing missing"
            emptyDesc="Great job!"
            status="missing"
            userId={user.id}
            myGroupIds={myGroupIds}
          />
        )}

        <TodoSection
          title="Done"
          icon={<CheckCircle2 size={16} />}
          items={done}
          emptyIcon={<Inbox size={32} />}
          emptyTitle="No completed work yet"
          emptyDesc="Submit an assignment to see it here."
          status="done"
          userId={user.id}
          myGroupIds={myGroupIds}
        />
      </div>
    </div>
  );
}
