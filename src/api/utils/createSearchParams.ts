export type Query = Record<string, string | number | boolean | undefined | string[]>;
export function createSearchParams(obj?: Query): string {
  if (!obj) return '';
  const filteredEntries = Object.entries(obj)
    .filter(([key, value]) => value || value === 0)
    .map(([key, value]) => [key, String(value)]);
  return new URLSearchParams(filteredEntries).toString();
}
