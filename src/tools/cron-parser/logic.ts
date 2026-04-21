export interface CronResult {
  description: string
  nextRuns: string[]
}

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const MONTHS = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

function describeMinute(v: string): string {
  if (v === '*') return ''
  if (v.startsWith('*/')) return `每 ${v.slice(2)} 分钟`
  if (v.includes(',')) return `第 ${v} 分钟`
  if (v.includes('-')) return `第 ${v} 分钟`
  return `第 ${v} 分钟`
}

function describeHour(v: string): string {
  if (v === '*') return ''
  if (v.startsWith('*/')) return `每隔 ${v.slice(2)} 小时`
  if (v.includes(',')) return `${v} 时`
  if (v.includes('-')) return `${v} 时`
  return `${v} 时`
}

function describeDay(v: string): string {
  if (v === '*') return ''
  if (v.startsWith('*/')) return `每隔 ${v.slice(2)} 天`
  if (v.includes(',')) return `每月 ${v} 号`
  if (v.includes('-')) return `每月 ${v} 号`
  return `每月 ${v} 号`
}

function describeMonth(v: string): string {
  if (v === '*') return ''
  if (v.startsWith('*/')) return `每隔 ${v.slice(2)} 个月`
  const n = Number(v)
  return isNaN(n) ? v : MONTHS[n] ?? v
}

function describeWeekday(v: string): string {
  if (v === '*') return ''
  if (v.includes(',')) return v.split(',').map(w => WEEKDAYS[Number(w)] ?? w).join('/')
  if (v.includes('-')) return `${WEEKDAYS[Number(v.split('-')[0])] ?? v.split('-')[0]} 至 ${WEEKDAYS[Number(v.split('-')[1])] ?? v.split('-')[1]}`
  return WEEKDAYS[Number(v)] ?? v
}

export function parseCron(expression: string): CronResult {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) throw new Error('Cron 表达式需要 5 个字段：分 时 日 月 周')

  const [min, hour, day, month, weekday] = parts
  const allStar = [min, hour, day, month, weekday].every(p => p === '*')

  let description: string
  if (allStar) {
    description = '每分钟执行一次'
  } else if (min.startsWith('*/') && hour === '*' && day === '*' && month === '*' && weekday === '*') {
    description = `每 ${min.slice(2)} 分钟执行一次`
  } else {
    const segments = [
      describeMonth(month),
      describeDay(day),
      describeWeekday(weekday),
      describeHour(hour),
      describeMinute(min),
    ].filter(Boolean)
    description = segments.join(' ') + ' 执行'
  }

  return { description, nextRuns: computeNextRuns(parts, 5) }
}

function computeNextRuns(parts: string[], count: number): string[] {
  const [minPart, hourPart, dayPart, monthPart, weekPart] = parts
  const results: string[] = []
  let date = new Date()
  date.setSeconds(0, 0)
  date.setMinutes(date.getMinutes() + 1)

  let attempts = 0
  while (results.length < count && attempts < 100000) {
    attempts++
    if (!matchField(monthPart, date.getMonth() + 1, 1, 12)) { date.setMonth(date.getMonth() + 1); date.setDate(1); date.setHours(0); date.setMinutes(0); continue }
    if (!matchField(dayPart, date.getDate(), 1, 31) || !matchField(weekPart, date.getDay(), 0, 6)) { date.setDate(date.getDate() + 1); date.setHours(0); date.setMinutes(0); continue }
    if (!matchField(hourPart, date.getHours(), 0, 23)) { date.setHours(date.getHours() + 1); date.setMinutes(0); continue }
    if (!matchField(minPart, date.getMinutes(), 0, 59)) { date.setMinutes(date.getMinutes() + 1); continue }
    results.push(date.toLocaleString('zh-CN'))
    date.setMinutes(date.getMinutes() + 1)
  }
  return results
}

function matchField(field: string, value: number, min: number, max: number): boolean {
  if (field === '*') return true
  if (field.startsWith('*/')) {
    const step = parseInt(field.slice(2))
    return (value - min) % step === 0
  }
  if (field.includes(',')) return field.split(',').some(f => matchField(f.trim(), value, min, max))
  if (field.includes('-')) {
    const [lo, hi] = field.split('-').map(Number)
    return value >= lo && value <= hi
  }
  return parseInt(field) === value
}
