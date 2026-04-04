/**
 * @file RubricCriteriaList.tsx
 * @description List component for managing rubric criteria. Allows adding, updating, and removing criteria.
 */
"use client";

import { Trash2, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Criterion {
  id: string;
  name: string;
  description: string;
  points: number;
}

interface RubricCriteriaListProps {
  criteria: Criterion[];
  setCriteria: (criteria: Criterion[]) => void;
}

const inputClass = `w-full bg-white border border-border rounded-xl px-4 py-3
  text-[14px] text-foreground placeholder:text-muted-foreground
  focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition`;

const labelClass = `text-[11px] font-bold tracking-[.18em] uppercase text-navy`;

export function RubricCriteriaList({ criteria, setCriteria }: RubricCriteriaListProps) {
  const addCriterion = () => setCriteria([
    ...criteria,
    { id: crypto.randomUUID(), name: '', description: '', points: 10 },
  ]);

  const removeCriterion = (id: string) => {
    if (criteria.length > 1) setCriteria(criteria.filter((c) => c.id !== id));
  };

  const updateCriterion = (id: string, field: keyof Criterion, value: string | number) =>
    setCriteria(criteria.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border">
        <div>
          <h2 className="font-black text-[17px] tracking-tight">Grading criteria</h2>
          <p className="text-[13px] text-muted-foreground">
            Define how this assignment will be evaluated
          </p>
        </div>
        <Button
          type="button"
          onClick={addCriterion}
          variant="outline"
          className="text-foreground hover:text-navy hover:border-navy/30 px-4 py-2.5"
        >
          <Plus size={14} /> Add criterion
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {criteria.map((criterion, index) => (
          <div
            key={criterion.id}
            className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-4 hover:border-navy/20 transition relative"
          >
            {/* Index badge */}
            <div className="absolute -top-3 -left-3 size-6 bg-navy text-yellow rounded-full flex items-center justify-center text-[11px] font-black">
              {index + 1}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Name */}
              <div className="sm:col-span-3 flex flex-col gap-1.5">
                <label className={labelClass}>Criterion name</label>
                <input
                  value={criterion.name}
                  onChange={(e) => updateCriterion(criterion.id, 'name', e.target.value)}
                  required
                  placeholder="e.g. Grammar & Punctuation"
                  className={inputClass}
                />
              </div>

              {/* Points */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Max points</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={criterion.points}
                  onChange={(e) =>
                    updateCriterion(criterion.id, 'points', parseFloat(e.target.value) || 0)
                  }
                  required
                  className={`${inputClass} text-center font-bold`}
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-[.18em] uppercase text-navy">
                <Info size={11} /> Description
                <span className="font-medium text-muted-foreground normal-case tracking-normal">
                  (optional)
                </span>
              </label>
              <textarea
                value={criterion.description}
                onChange={(e) => updateCriterion(criterion.id, 'description', e.target.value)}
                rows={2}
                placeholder="Describe what a student must do to earn full points…"
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Remove */}
            {criteria.length > 1 && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeCriterion(criterion.id)}
                  className="text-[12px] font-semibold text-muted-foreground hover:text-red-500 hover:bg-red-50"
                  size="sm"
                >
                  <Trash2 size={13} /> Remove
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
