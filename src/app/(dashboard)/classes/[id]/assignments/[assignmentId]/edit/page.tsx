import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
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

    const classId = id
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Verify teacher
    const { data: member } = await (supabase
        .from('class_members') as any)
        .select('role')
        .eq('class_id', classId)
        .eq('user_id', user.id)
        .single()
    if (!member || member.role !== 'teacher') redirect(`/dashboard/classes/${classId}`)

    // Fetch assignment
    const { data: assignment } = await supabase
        .from('assignments')
        .select('id, title, description, due_date, points, submission_type, rubric_id, is_group_project, attachment_paths')
        .eq('id', assignmentId)
        .eq('class_id', classId)
        .single()
    if (!assignment) notFound()

    // Fetch rubrics for the select
    const { data: rubrics } = await supabase
        .from('rubrics').select('id, name')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

    const parsedAttachments = ((assignment as any)?.attachment_paths || []).map((path: string) => {
        const fileName = path.split('/').pop() || 'File'
        let cleanName = fileName.includes('-') ? fileName.split('-').slice(1).join('-') : fileName
        return { name: cleanName, url: path }
    })

    const initialData = {
        ...(assignment as any),
        attachments: parsedAttachments
    }

    return (
        <div className="max-w-5xl mx-auto p-6 flex flex-col gap-8">

            {/* Back */}
            <Link
                href={`/classes/${classId}/assignments/${assignmentId}?from=${fromTab}`}
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
                classId={classId}
                userId={user.id}
                rubrics={rubrics || []}
                initialData={initialData}
            />
        </div>
    )
}