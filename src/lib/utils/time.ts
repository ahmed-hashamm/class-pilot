/**
 * Formats a number of seconds into a human-readable duration.
 * @param seconds The total number of seconds.
 * @returns A string in the format "Dd Hh Mm Ss", "Hh Mm Ss", or "MM:SS".
 */
export function formatTime(seconds: number): string {
  if (seconds === Infinity || seconds < 0) return "";
  
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) {
    return `${days}d ${hours}h ${mins}m ${secs}s`;
  }
  
  if (hours > 0) {
    return `${hours}h ${mins}m ${secs}s`;
  }

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
