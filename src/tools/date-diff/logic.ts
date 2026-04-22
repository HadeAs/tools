export interface DateDiffResult {
  years: number
  months: number
  days: number
  totalDays: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
  isPast: boolean
}

export function dateDiff(dateA: string, dateB: string): DateDiffResult {
  const a = new Date(dateA)
  const b = new Date(dateB)
  if (isNaN(a.getTime())) throw new Error('日期 A 无效')
  if (isNaN(b.getTime())) throw new Error('日期 B 无效')

  const [start, end] = a <= b ? [a, b] : [b, a]
  const isPast = b < a

  const totalMs = end.getTime() - start.getTime()
  const totalDays = Math.floor(totalMs / 86_400_000)
  const totalHours = Math.floor(totalMs / 3_600_000)
  const totalMinutes = Math.floor(totalMs / 60_000)
  const totalSeconds = Math.floor(totalMs / 1_000)

  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()
  let days = end.getDate() - start.getDate()

  if (days < 0) {
    months--
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate()
  }
  // Second pass: handles cases where start-day > last-day-of-borrowed-month (e.g. Jan 31 → Mar 1)
  if (days < 0) {
    months--
    days += new Date(end.getFullYear(), end.getMonth() - 1, 0).getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }

  return { years, months, days, totalDays, totalHours, totalMinutes, totalSeconds, isPast }
}

export function today(): string {
  return new Date().toISOString().slice(0, 10)
}
