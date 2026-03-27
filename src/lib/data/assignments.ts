export const SUBMISSION_TYPES = [
  { value: "file", label: "File upload" },
  { value: "text", label: "Online text" },
  { value: "both", label: "Both" },
] as const;

export const ASSIGNMENT_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "submitted", label: "Submitted" },
  { value: "graded", label: "Graded" },
  { value: "failed", label: "Failed" },
] as const;
