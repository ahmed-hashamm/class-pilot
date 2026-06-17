import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely parses dates, especially fixing iOS Safari "Invalid Date" 
 * for "YYYY-MM-DD HH:mm:ss" formats by replacing space with "T".
 */
export function safeDate(dateValue: string | Date | null | undefined): Date {
  if (!dateValue) return new Date();
  if (dateValue instanceof Date) return dateValue;
  const safeString = typeof dateValue === 'string' ? dateValue.replace(' ', 'T') : String(dateValue);
  return new Date(safeString);
}
