/**
 * Formats a number of seconds into a MM:SS string.
 * @param seconds The total number of seconds.
 * @returns A string in the format "MM:SS".
 */
export function formatTime(seconds: number): string {
  if (seconds === Infinity || seconds < 0) return "";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
