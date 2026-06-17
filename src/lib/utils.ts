import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { parseISO, isValid } from "date-fns";

/**
 * Safely parses dates, especially fixing iOS Safari "Invalid Date" 
 * for various string formats and preventing crashes.
 */
export function safeDate(dateValue: string | Date | null | undefined): Date {
  if (!dateValue) return new Date();
  if (dateValue instanceof Date) {
    return isValid(dateValue) ? dateValue : new Date();
  }
  
  let safeString = String(dateValue).trim();
  
  // Try parseISO first which is extremely robust across browsers
  let d = parseISO(safeString);
  if (isValid(d)) return d;

  // Try standard native parsing
  d = new Date(safeString);
  if (isValid(d)) return d;

  // Safari fix: Replace space with T
  safeString = safeString.replace(' ', 'T');
  d = new Date(safeString);
  if (isValid(d)) return d;

  // Safari fix: Replace hyphens with slashes (YYYY/MM/DD)
  d = new Date(safeString.replace(/-/g, '/').replace('T', ' '));
  if (isValid(d)) return d;

  // Fallback to current date to absolutely prevent crashes with date-fns format()
  return new Date();
}
