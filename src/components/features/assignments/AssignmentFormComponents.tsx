"use client";

import { Paperclip, X, UploadCloud, FileText, AlignLeft } from "lucide-react";

const inputClass = `w-full bg-white border border-border rounded-xl px-4 py-3 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition`;
const labelClass = `text-[11px] font-bold tracking-[.18em] uppercase text-navy`;

export function AssignmentBasics({ initialData }: { initialData?: any }) {
  return (
    <>
      <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2"><FileText size={14} className="text-navy" /><label htmlFor="title" className={labelClass}>Title</label></div>
        <input id="title" name="title" required defaultValue={initialData?.title || ""} placeholder="Assignment title" className={inputClass} />
      </div>
      <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2"><AlignLeft size={14} className="text-navy" /><label htmlFor="description" className={labelClass}>Instructions</label></div>
        <textarea id="description" name="description" defaultValue={initialData?.description || ""} placeholder="What should students do?" rows={5} className={`${inputClass} resize-none`} />
      </div>
    </>
  );
}

export function AssignmentAttachments({ newFiles, existingFiles, setNewFiles, setExistingFiles }: any) {
  return (
    <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2"><Paperclip size={14} className="text-navy" /><span className={labelClass}>Attachments</span></div>
      <label className="relative flex items-center gap-3 border-2 border-dashed border-border rounded-xl px-4 h-12 cursor-pointer hover:border-navy/30 hover:bg-secondary/50 transition">
        <UploadCloud size={15} className="text-muted-foreground" />
        <span className="text-[13px] text-muted-foreground">Click to upload reference files</span>
        <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && setNewFiles([...newFiles, ...Array.from(e.target.files)])} />
      </label>
      {existingFiles.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current</p>
          <div className="flex flex-wrap gap-2">
            {existingFiles.map((file: any, i: number) => (
              <div key={i} className="inline-flex items-center gap-2 bg-secondary border border-border rounded-lg px-3 py-1.5 text-[12px] font-medium">
                <Paperclip size={11} className="text-navy" /><span className="truncate max-w-[140px]">{file.name}</span>
                <button type="button" onClick={() => setExistingFiles(existingFiles.filter((_: any, idx: number) => idx !== i))} className="text-muted-foreground hover:text-red-500 cursor-pointer bg-transparent border-none px-1"><X size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
      {newFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {newFiles.map((file: any, i: number) => (
            <div key={i} className="inline-flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-1.5 text-[12px] font-medium">
              <Paperclip size={11} className="text-navy-light" /><span className="truncate max-w-[140px]">{file.name}</span>
              <button type="button" onClick={() => setNewFiles(newFiles.filter((_: any, idx: number) => idx !== i))} className="text-muted-foreground hover:text-red-500 cursor-pointer bg-transparent border-none px-1"><X size={12} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
