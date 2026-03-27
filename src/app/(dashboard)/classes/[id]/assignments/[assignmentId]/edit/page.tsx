import { getEditAssignmentData } from '@/lib/data/assignments'
import Link from 'next/link'
import { ChevronLeft, Pencil } from 'lucide-react'
import CreateAssignmentForm from '@/components/assignment/CreateAssignmentForm'

export default async function EditAssignmentPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string; assignmentId: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { id, assignmentId } = await params
    const resolvedSearchParams = await searchParams;
    const fromTab = resolvedSearchParams?.from || 'stream';

    const { user, rubrics, initialData } = await getEditAssignmentData(id, assignmentId)

    return (
        <div className="max-w-5xl mx-auto p-6 flex flex-col gap-8">
            {/* Back */}
            <Link
                href={`/classes/${id}/assignments/${assignmentId}?from=${fromTab}`}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold
          text-muted-foreground hover:text-navy transition-colors w-fit">
                <ChevronLeft size={15} /> Back to assignment
            </Link>

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-navy flex items-center justify-center">
                    <Pencil size={15} className="text-yellow" />
                </div>
                <div>
                    <h1 className="font-black text-[20px] tracking-tight">Edit assignment</h1>
                    <p className="text-[13px] text-muted-foreground">
                        Changes will be visible to students immediately.
                    </p>
                </div>
            </div>

            <CreateAssignmentForm
                classId={id}
                userId={user.id}
                rubrics={rubrics}
                initialData={initialData}
            />
        </div>
    )
}