import AttachmentButton from "@/components/features/classes/buttons/AttachmentButton";
import { Assignment } from "@/lib/types/schema";

interface AssignmentDetailInstructionsProps {
  assignment: Assignment;
}

export default function AssignmentDetailInstructions({ assignment }: AssignmentDetailInstructionsProps) {
  const attachments = assignment.attachment_paths || [];

  return (
    <div className="flex flex-col gap-6 w-full text-left min-w-0">
      <div className="flex flex-col gap-2.5 w-full min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-navy/40 pl-1">Instructions</p>
        <div className="bg-white border border-border rounded-2xl p-4 sm:p-6 shadow-sm w-full min-w-0 overflow-hidden">
          <p className="whitespace-pre-wrap break-words text-[14px] leading-relaxed text-foreground/80 w-full">
            {assignment.description || assignment.content || "No instructions provided."}
          </p>
        </div>
      </div>
      
      {attachments.length > 0 && (
        <div className="flex flex-col gap-2.5 w-full min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-navy/40 pl-1">Attachments</p>
          <div className="flex flex-col gap-2 w-full min-w-0">
            {attachments.map((path: string) => (
              <AttachmentButton 
                key={path} 
                path={path} 
                type="assignment" 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
