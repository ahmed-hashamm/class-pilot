import { getCreateAssignmentData } from "@/lib/data/assignments";
import CreateAssignmentForm from "@/components/assignment/CreateAssignmentForm";
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
    <div className="min-h-screen bg-secondary/40 pb-12">
      {/* Top nav */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href={`/classes/${id}?tab=work`}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold
              text-muted-foreground hover:text-navy transition-colors">
            <ChevronLeft size={15} />
            Back to class
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-widest
              text-muted-foreground">
              Draft assignment
            </span>
            <span className="size-2 rounded-full bg-yellow animate-pulse" />
          </div>
        </div>
      </div>

      {/* Page header */}
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-6">
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
      </div>

      <main className="max-w-5xl mx-auto px-4">
        <CreateAssignmentForm classId={id} userId={user.id} rubrics={rubrics} />
      </main>
    </div>
  );
}