/**
 * @file AIGeneratorPanel.tsx
 * @description A panel within the rubric builder that lets teachers generate rubric criteria via AI.
 */
"use client";

import { Sparkles, Wand2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateAIGradingCriteria } from "@/actions/ClassFeaturesActions";
import { FeatureButton } from "@/components/ui/FeatureButton";

const inputClass = `w-full bg-white border border-border rounded-xl px-4 py-3
  text-[14px] text-foreground placeholder:text-muted-foreground
  focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition`;

const labelClass = `text-[11px] font-bold tracking-[.18em] uppercase text-navy`;

interface Criterion {
  id: string;
  name: string;
  description: string;
  points: number;
}

interface AIGeneratorPanelProps {
  onSuccess: (criteria: Criterion[], title: string) => void;
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
}

export function AIGeneratorPanel({ onSuccess, isGenerating, setIsGenerating }: AIGeneratorPanelProps) {
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiTitle, setAiTitle] = useState("");
  const [aiDescription, setAiDescription] = useState("");

  const handleGenerateAI = async () => {
    if (!aiTitle || !aiDescription) {
      toast.error('Please provide assignment details');
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error: aiError } = await generateAIGradingCriteria({
        title: aiTitle,
        description: aiDescription,
      });

      if (aiError) throw new Error(aiError);
      if (!data) throw new Error('No data received');

      const formattedCriteria = data.map((c: any) => ({
        id: crypto.randomUUID(),
        name: c.name,
        description: c.description,
        points: c.points,
      }));

      onSuccess(formattedCriteria, aiTitle);
      setIsAiPanelOpen(false);
      toast.success('Rubric generated successfully!');
    } catch (err: any) {
      toast.error('AI generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`bg-navy/5 border ${isAiPanelOpen ? 'border-navy/20 shadow-lg' : 'border-dashed border-navy/20'} rounded-2xl overflow-hidden transition-all`}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
        onKeyDown={(e) => e.key === 'Enter' && setIsAiPanelOpen(!isAiPanelOpen)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-navy/5 transition group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="size-10 shrink-0 rounded-xl bg-navy/10 flex items-center justify-center text-navy">
            <Sparkles size={18} />
          </div>
          <div className="text-left">
            <h3 className="font-black text-[14px] text-foreground">AI Rubric Generator</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Generate criteria automatically from your assignment details</p>
          </div>
        </div>
        <div className={`p-3 rounded-xl text-xs sm:text-sm whitespace-nowrap font-bold transition-all ${isAiPanelOpen ? 'bg-navy text-white' : 'bg-navy/10 text-navy group-hover:bg-navy group-hover:text-white'}`}>
          {isAiPanelOpen ? 'Close' : 'Try it'}
        </div>
      </div>

      {isAiPanelOpen && (
        <div className="p-6 flex flex-col gap-5 bg-white border-t border-border">
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Assignment context title</label>
            <input
              value={aiTitle}
              onChange={(e) => setAiTitle(e.target.value)}
              placeholder="e.g. Victorian Poetry Analysis Essay"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Assignment instructions/description</label>
            <textarea
              value={aiDescription}
              onChange={(e) => setAiDescription(e.target.value)}
              placeholder="Paste your assignment instructions here. Include what you want students to focus on..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div className="flex items-center justify-end pt-2">
            <FeatureButton
              type="button"
              onClick={handleGenerateAI}
              disabled={isGenerating || !aiTitle || !aiDescription}
              loading={isGenerating}
              loadingLabel="Generating..."
              label="Generate Grading Criteria"
              icon={Wand2}
              className="px-6 py-3"
            />
          </div>
        </div>
      )}
    </div>
  );
}
