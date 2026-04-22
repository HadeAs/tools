export type TimeUnit = 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds'
export type Operation = 'add' | 'subtract'

export interface DateAddResult {
  result: Date
  iso: string
  formatted: string
}

export const TIME_UNITS: { key: TimeUnit; label: string }[] = [
  { key: 'years',   label: '年' },
  { key: 'months',  label: '月' },
  { key: 'weeks',   label: '周' },
  { key: 'days',    label: '天' },
  { key: 'hours',   label: '小时' },
  { key: 'minutes', label: '分钟' },
  { key: 'seconds', label: '秒' },
]

export function dateAdd(dateStr: string, amount: number, unit: TimeUnit, op: Operation): DateAddResult {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) throw new Error('无效日期')

  const n = op === 'subtract' ? -amount : amount
  const r = new Date(d)

  switch (unit) {
    case 'years':   r.setFullYear(r.getFullYear() + n); break
    case 'months':  r.setMonth(r.getMonth() + n); break
    case 'weeks':   r.setDate(r.getDate() + n * 7); break
    case 'days':    r.setDate(r.getDate() + n); break
    case 'hours':   r.setHours(r.getHours() + n); break
    case 'minutes': r.setMinutes(r.getMinutes() + n); break
    case 'seconds': r.setSeconds(r.getSeconds() + n); break
  }

  return {
    result: r,
    iso: r.toISOString(),
    formatted: r.toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    }),
  }
}

export function nowIso(): string {
  const d = new Date()
  return `${d.toISOString().slice(0, 10)}T${d.toTimeString().slice(0, 8)}`
}
