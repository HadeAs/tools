export interface CronResult {
  description: string
  nextRuns: string[]
}

const FIELD_NAMES = ['分钟', '小时', '日', '月', '星期']
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
const MONTHS = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

function describeField(value: string, index: number): string {
  if (value === '*') return `每${FIELD_NAMES[index]}`
  if (value.startsWith('*/')) return `每 ${value.slice(2)} ${FIELD_NAMES[index]}`
  if (value.includes('-')) return `${FIELD_NAMES[index]} ${value}`
  if (value.includes(',')) return `${FIELD_NAMES[index]} ${value}`
  if (index === 4) return `星期${WEEKDAYS[Number(value)] ?? value}`
  if (index === 3) return MONTHS[Number(value)] ?? value
  return `${FIELD_NAMES[index]} ${value}`
}

export function parseCron(expression: string): CronResult {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) throw new Error('Cron 表达式需要 5 个字段：分 时 日 月 周')

  const description = parts.map((p, i) => describeField(p, i)).join('，')

  const nextRuns = computeNextRuns(parts, 5)

  return { description, nextRuns }
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
