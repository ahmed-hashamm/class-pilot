'use client'

import { FeatureButton } from '@/components/ui'

interface SubmissionFormFooterProps {
  loading: boolean
  hasExisting: boolean
  canSubmit: boolean
  onCancel: () => void
}

/**
 * Standardizes the action buttons (Submit/Update vs. Cancel) with consistent styling.
 */
export function SubmissionFormFooter({ 
  loading, 
  hasExisting, 
  canSubmit, 
  onCancel 
}: SubmissionFormFooterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
      <FeatureButton 
        type="submit"
        label={hasExisting ? "Update Work" : "Turn In Assignment"}
        variant="primary"
        loading={loading}
        disabled={!canSubmit || loading}
        className="flex-1 h-[56px] text-[15px]" 
      />
      <FeatureButton 
        type="button"
        label="Cancel"
        variant="outline"
        onClick={onCancel}
        disabled={loading}
        className="flex-1 h-[56px] text-[15px]"
      />
    </div>
  )
}
