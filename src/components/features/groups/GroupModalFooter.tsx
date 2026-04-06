import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FeatureButton } from "@/components/ui/FeatureButton"

interface GroupModalFooterProps {
  onCancel: () => void
  onSave: () => void
  submitting: boolean
  isEditing: boolean
}

export function GroupModalFooter({
  onCancel,
  onSave,
  submitting,
  isEditing
}: GroupModalFooterProps) {
  return (
    <div className="p-6 pt-2 flex gap-3 bg-secondary/10 border-t border-border">
      <Button
        variant="ghost"
        onClick={onCancel}
        className="flex-1 py-3.5 text-muted-foreground font-black text-[12px] uppercase tracking-widest hover:bg-secondary rounded-2xl"
      >
        Cancel
      </Button>
      <FeatureButton
        onClick={onSave}
        disabled={submitting}
        loading={submitting}
        label={isEditing ? "Update" : "Create"}
        className="flex-1 py-3.5"
      />
    </div>
  )
}
