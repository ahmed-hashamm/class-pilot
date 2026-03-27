"use client";

import { Settings2, Users, Calendar, Award } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const inputClass = `w-full bg-white border border-border rounded-xl px-4 py-3 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition`;
const labelClass = `text-[11px] font-bold tracking-[.18em] uppercase text-navy`;

export function AssignmentConfig({ isGroupProject, setIsGroupProject, rubrics, initialData }: any) {
  const defaultDueDate = initialData?.due_date ? new Date(initialData.due_date).toISOString().slice(0, 16) : "";

  return (
    <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-5">
      <div className="flex items-center gap-2 pb-3 border-b border-border"><Settings2 size={13} className="text-navy" /><span className="text-[11px] font-black uppercase tracking-[.18em] text-navy">Config</span></div>
      <div className="flex items-center justify-between py-2 px-3 bg-secondary border border-border rounded-xl">
        <div className="flex items-center gap-2"><Users size={13} className={isGroupProject ? "text-navy" : "text-muted-foreground"} /><label htmlFor="isGroupProject" className="text-[12px] font-semibold text-foreground cursor-pointer">Group project</label></div>
        <Checkbox id="isGroupProject" checked={isGroupProject} onCheckedChange={(c) => setIsGroupProject(!!c)} className="data-[state=checked]:bg-navy data-[state=checked]:border-navy" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="dueDate" className="flex items-center gap-1.5 text-[11px] font-bold tracking-[.18em] uppercase text-navy"><Calendar size={11} /> Due date</label>
        <input id="dueDate" name="dueDate" type="datetime-local" defaultValue={defaultDueDate} className={`${inputClass} text-[13px] py-2`} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="points" className="flex items-center gap-1.5 text-[11px] font-bold tracking-[.18em] uppercase text-navy"><Award size={11} /> Points</label>
        <input id="points" name="points" type="number" defaultValue={initialData?.points ?? 100} className={`${inputClass} text-[13px] py-2`} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="submissionType" className="text-[11px] font-bold uppercase text-navy">Submission type</label>
        <select name="submissionType" defaultValue={initialData?.submission_type || "file"} className={`${inputClass} text-[13px] py-2 cursor-pointer`}><option value="file">File upload</option><option value="text">Online text</option><option value="both">Both</option></select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="rubricId" className="text-[11px] font-bold uppercase text-navy">Rubric</label>
        <select name="rubricId" defaultValue={initialData?.rubric_id || ""} className={`${inputClass} text-[13px] py-2 cursor-pointer`}><option value="">None</option>{rubrics.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
      </div>
    </div>
  );
}
