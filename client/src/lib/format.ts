// Date and time formatting helpers used across the app

// Turns milliseconds into m:ss, e.g. 187000 -> "3:07"
export function formatTrackLength(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Turns milliseconds into "Xh Ym" or just "Ym" when under an hour
export function formatDuration(ms: number): string {
  const totalMinutes = Math.round(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours === 0 ? `${minutes}m` : `${hours}h ${minutes}m`;
}

// Converts a 24-hour number to a readable label, e.g. 15 -> "3pm"
export function formatHour(hour: number): string {
  if (hour === 0) return '12am';
  if (hour === 12) return '12pm';
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`;
}

// Short date like "May 12"
export function formatShortDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

// Weekday + date like "Mon, May 12"
export function formatWeekdayDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// Clock time like "3:45 PM"
export function formatClockTime(ts: number): string {
  return new Date(ts).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}
