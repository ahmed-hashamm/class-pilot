"use client";

import { Settings2, Users, Calendar, Award } from "lucide-react";
import { Checkbox, Select, FeatureButton } from "@/components/ui";
import { PinToggle } from "../feed/PinToggle";

import { SUBMISSION_TYPES } from "@/lib/data/assignments";

const inputClass = `w-full bg-white border border-border rounded-xl px-4 py-3 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition`;
const labelClass = `text-[11px] font-bold tracking-[.18em] uppercase text-navy`;

interface AssignmentConfigProps {
  isGroupProject: boolean;
  setIsGroupProject: (v: boolean) => void;
  rubrics: any[];
  initialData?: any;
  pinned: boolean;
  onToggle: (v: boolean) => void;
  onClear?: () => void;
  isEditing: boolean;
  dueDate: string;
  setDueDate: (v: string) => void;
  points: number;
  setPoints: (v: number) => void;
  submissionType: string;
  setSubmissionType: (v: string) => void;
  rubricId: string;
  setRubricId: (v: string) => void;
}

export function AssignmentConfig({ 
  isGroupProject, 
  setIsGroupProject, 
  rubrics, 
  initialData,
  pinned,
  onToggle,
  onClear,
  isEditing,
  dueDate, setDueDate,
  points, setPoints,
  submissionType, setSubmissionType,
  rubricId, setRubricId
}: AssignmentConfigProps) {
  return (
    <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-5 text-navy">
      <div className="flex items-center gap-2 pb-3 border-b border-border"><Settings2 size={13} className="text-navy" /><span className="text-[11px] font-black uppercase tracking-[.18em] text-navy">Config</span></div>
      <div className="flex items-center justify-between py-2 px-3 bg-secondary border border-border rounded-xl">
        <div className="flex items-center gap-2"><Users size={13} className={isGroupProject ? "text-navy" : "text-muted-foreground"} /><label htmlFor="isGroupProject" className="text-[12px] font-bold text-navy cursor-pointer">Group project</label></div>
        <Checkbox id="isGroupProject" checked={isGroupProject} onCheckedChange={(c: boolean) => setIsGroupProject(c)} className="data-[state=checked]:bg-navy data-[state=checked]:border-navy" />
      </div>
      
      <div className="flex flex-col gap-2">
        <label htmlFor="dueDate" className="flex items-center gap-1.5 text-[10px] font-bold tracking-[.18em] uppercase text-navy/50"><Calendar size={11} /> Due date</label>
        <input id="dueDate" name="dueDate" type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={`${inputClass} text-[13px] py-2`} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="points" className="flex items-center gap-1.5 text-[10px] font-bold tracking-[.18em] uppercase text-navy/50"><Award size={11} /> Points</label>
        <input id="points" name="points" type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} className={`${inputClass} text-[13px] py-2`} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="submissionType" className="text-[10px] font-bold uppercase tracking-[.18em] text-navy/50">Submission type</label>
        <Select name="submissionType" value={submissionType} onChange={(e) => setSubmissionType(e.target.value)}>
          {SUBMISSION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="rubricId" className="text-[10px] font-bold uppercase tracking-[.18em] text-navy/50">Rubric</label>
        <Select name="rubricId" value={rubricId} onChange={(e) => setRubricId(e.target.value)}>
          <option value="">None</option>
          {rubrics.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </Select>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <PinToggle 
          pinned={pinned} 
          onToggle={onToggle} 
        />
        {!isEditing && onClear && (
          <FeatureButton
            label="Clear"
            variant="ghost"
            onClick={onClear}
            className="text-muted-foreground hover:text-navy"
          />
        )}
      </div>
    </div>
  );
}
