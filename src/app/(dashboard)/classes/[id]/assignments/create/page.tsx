import { getCreateAssignmentData } from "@/lib/db_data_fetching/assignments";
import CreateAssignmentForm from "@/components/features/assignments/CreateAssignmentForm";
import { ChevronLeft, ClipboardList } from "lucide-react";
import Link from "next/link";

export default async function CreateAssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, rubrics } = await getCreateAssignmentData(id);

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-8">
      {/* Back */}
      <Link href={`/classes/${id}?tab=work`}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold
          text-muted-foreground hover:text-navy transition-colors w-fit">
        <ChevronLeft size={15} /> Back to class
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-navy flex items-center justify-center">
          <ClipboardList size={17} className="text-yellow" />
        </div>
        <div>
          <h1 className="font-black text-[20px] tracking-tight">Create assignment</h1>
          <p className="text-[13px] text-muted-foreground">
            Fill out the details below to publish to your students.
          </p>
        </div>
      </div>

      <CreateAssignmentForm classId={id} userId={user.id} rubrics={rubrics} />
    </div>
  );
}