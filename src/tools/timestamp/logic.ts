export function unixToDate(unix: number): string {
  return new Date(unix * 1000).toISOString()
}

export function dateToUnix(dateStr: string): number {
  const ts = new Date(dateStr).getTime()
  if (isNaN(ts)) throw new Error('Invalid date')
  return Math.floor(ts / 1000)
}

export function nowUnix(): number {
  return Math.floor(Date.now() / 1000)
}
