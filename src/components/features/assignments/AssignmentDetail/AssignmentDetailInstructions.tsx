import AttachmentButton from "@/components/features/classes/buttons/AttachmentButton";
import { Assignment } from "@/lib/types/schema";

interface AssignmentDetailInstructionsProps {
  assignment: Assignment;
}

export default function AssignmentDetailInstructions({ assignment }: AssignmentDetailInstructionsProps) {
  const attachments = assignment.attachment_paths || [];
  
  const getDisplayName = (path: string) => {
    const fileName = path.split("/").pop() || "File";
    return fileName.includes("-") ? fileName.split("-").slice(1).join("-") : fileName;
  };

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      <div className="flex flex-col gap-2.5">
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-navy/40 pl-1">Instructions</p>
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <p className="whitespace-pre-wrap break-words text-[14px] leading-relaxed text-foreground/80">
            {assignment.description || assignment.content || "No instructions provided."}
          </p>
        </div>
      </div>
      
      {attachments.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-navy/40 pl-1">Attachments</p>
          <div className="flex flex-wrap gap-2">
            {attachments.map((path: string) => (
              <AttachmentButton 
                key={path} 
                path={path} 
                type="assignment" 
                label={getDisplayName(path)} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
