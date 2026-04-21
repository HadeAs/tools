export function formatJSON(input: string): string {
  return JSON.stringify(JSON.parse(input), null, 2)
}

export function minifyJSON(input: string): string {
  return JSON.stringify(JSON.parse(input))
}

export function validateJSON(input: string): boolean {
  try { JSON.parse(input); return true } catch { return false }
}
