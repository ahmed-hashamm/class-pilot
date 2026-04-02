"use client"

interface RubricCriterion {
  id: string;
  name: string;
  points: number;
}

interface RubricScoringListProps {
  criteria: RubricCriterion[];
  scores: Record<string, number>;
  onScoreChange: (id: string, value: number) => void;
}

export function RubricScoringList({ criteria, scores, onScoreChange }: RubricScoringListProps) {
  if (criteria.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-bold tracking-[.2em] uppercase text-navy/40 pl-1">
        Rubric Criteria
      </p>
      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar pr-0.5">
          {criteria.map((c, i) => (
            <div key={c.id}
              className={`flex items-center gap-4 px-5 py-4
                 hover:bg-navy/[0.02] transition-colors
                ${i < criteria.length - 1 ? 'border-b border-border/60' : ''}`}>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-black text-foreground">{c.name}</p>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Max {c.points} pts</p>
              </div>
              <div className="relative">
                <input
                  type="number" 
                  step="0.1" 
                  max={c.points} 
                  placeholder="0"
                  value={scores[c.id] ?? ""}
                  className="w-20 bg-secondary/50 border border-border rounded-xl px-3 py-2.5
                    text-[14px] font-black text-center text-navy
                    focus:outline-none focus:ring-4 focus:ring-navy/5 focus:border-navy transition-all"
                  onChange={(e) => {
                    const rawVal = parseFloat(e.target.value) || 0
                    const val = Math.min(Math.max(0, rawVal), c.points)
                    
                    if (rawVal > c.points) e.target.value = c.points.toString()
                    if (rawVal < 0) e.target.value = "0"

                    onScoreChange(c.id, val)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
