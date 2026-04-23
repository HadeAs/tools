export type TimeZoneEntry = { label: string; value: string }

export const TIMEZONES: TimeZoneEntry[] = [
  { label: 'UTC', value: 'UTC' },
  { label: '北京 / 上海 (CST, +8)', value: 'Asia/Shanghai' },
  { label: '香港 (HKT, +8)', value: 'Asia/Hong_Kong' },
  { label: '东京 (JST, +9)', value: 'Asia/Tokyo' },
  { label: '新加坡 (SGT, +8)', value: 'Asia/Singapore' },
  { label: '迪拜 (GST, +4)', value: 'Asia/Dubai' },
  { label: '伦敦 (GMT/BST)', value: 'Europe/London' },
  { label: '巴黎 / 柏林 (CET/CEST)', value: 'Europe/Paris' },
  { label: '莫斯科 (MSK, +3)', value: 'Europe/Moscow' },
  { label: '纽约 (EST/EDT)', value: 'America/New_York' },
  { label: '芝加哥 (CST/CDT)', value: 'America/Chicago' },
  { label: '洛杉矶 (PST/PDT)', value: 'America/Los_Angeles' },
  { label: '圣保罗 (BRT, -3)', value: 'America/Sao_Paulo' },
  { label: '悉尼 (AEST/AEDT)', value: 'Australia/Sydney' },
]

export function convertToZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    weekday: 'short',
  }).format(date)
}

export function getOffset(date: Date, timeZone: string): string {
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone }))
  const diff = (tzDate.getTime() - utcDate.getTime()) / 60000
  const sign = diff >= 0 ? '+' : '-'
  const abs = Math.abs(diff)
  const h = String(Math.floor(abs / 60)).padStart(2, '0')
  const m = String(abs % 60).padStart(2, '0')
  return `UTC${sign}${h}:${m}`
}
