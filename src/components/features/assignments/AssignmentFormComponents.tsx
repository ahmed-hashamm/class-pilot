"use client";

import { UploadCloud, FileText, AlignLeft, Paperclip } from "lucide-react";
import { FormSection, FileChip } from "@/components/ui";

const inputClass = `w-full bg-white border border-border rounded-xl px-4 py-3 text-[14px] text-foreground 
  focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition shadow-sm`;

export function AssignmentBasics({ initialData }: { initialData?: any }) {
  return (
    <div className="flex flex-col gap-5">
      <FormSection label="Title" description="The primary name for this assignment">
        <div className="relative">
          <FileText size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" />
          <input 
            id="title" 
            name="title" 
            required 
            defaultValue={initialData?.title || ""} 
            placeholder="e.g. Midterm Essay" 
            className={`${inputClass} pl-10`} 
          />
        </div>
      </FormSection>

      <FormSection label="Instructions" description="Describe what students need to accomplish">
        <textarea 
          id="description" 
          name="description" 
          defaultValue={initialData?.description || ""} 
          placeholder="Detailed instructions..." 
          rows={6} 
          className={`${inputClass} resize-none py-4`} 
        />
      </FormSection>
    </div>
  );
}

export function AssignmentAttachments({ newFiles, existingFiles, setNewFiles, setExistingFiles }: any) {
  return (
    <FormSection label="Attachments" description="Reference materials or templates">
      <div className="flex flex-col gap-4">
        <label className="relative flex flex-col items-center justify-center gap-2 
          border-2 border-dashed border-border rounded-2xl py-8 cursor-pointer 
          hover:border-navy/30 hover:bg-navy/5 transition-all bg-secondary/30 group">
          <UploadCloud size={20} className="text-navy/40 group-hover:scale-110 transition" />
          <span className="text-[13px] font-bold text-foreground">Add files</span>
          <input 
            type="file" 
            multiple 
            className="hidden" 
            onChange={(e) => e.target.files && setNewFiles([...newFiles, ...Array.from(e.target.files)])} 
          />
        </label>

        {(existingFiles.length > 0 || newFiles.length > 0) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {existingFiles.map((file: any, i: number) => (
              <FileChip
                key={`existing-${i}`}
                name={file.name}
                onRemove={() => setExistingFiles(existingFiles.filter((_: any, idx: number) => idx !== i))}
              />
            ))}
            {newFiles.map((file: any, i: number) => (
              <FileChip
                key={`new-${i}`}
                name={file.name}
                onRemove={() => setNewFiles(newFiles.filter((_: any, idx: number) => idx !== i))}
              />
            ))}
          </div>
        )}
      </div>
    </FormSection>
  );
}
