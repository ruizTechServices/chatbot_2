/**
 * Formats milliseconds into a human-readable time string (HH:MM:SS)
 * @param ms Time in milliseconds
 * @returns Formatted time string
 */
export function formatMsToTimeString(ms: number): string {
  // Ensure we're working with a positive number
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  // Pad with zeros for consistent format
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Formats a time object into a human-readable time string (HH:MM:SS)
 * @param time Object containing hours, minutes, seconds
 * @returns Formatted time string
 */
export function formatTimeObjectToString(time: { hours: number; minutes: number; seconds: number }): string {
  return `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`;
}
