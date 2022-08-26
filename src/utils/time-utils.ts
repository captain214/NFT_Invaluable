export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;

export function getDiffTime(
  start: string | number | Date,
  end: string | number | Date,
  offsetInMinutes = 0
): { minutes: number; hours: number; days: number } {
  const startTime = new Date(start);
  const endTime = new Date(end);
  const minutes =
    Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60)) + offsetInMinutes;
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  return { minutes, hours, days };
}
