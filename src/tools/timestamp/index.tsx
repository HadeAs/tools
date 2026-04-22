'use client'

import { useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { dateToUnix, nowUnix } from './logic'

const TIMEZONES = [
  { label: '本地时间',          tz: undefined },
  { label: 'UTC',               tz: 'UTC' },
  { label: '北京 (UTC+8)',       tz: 'Asia/Shanghai' },
  { label: '东京 (UTC+9)',       tz: 'Asia/Tokyo' },
  { label: '纽约 (UTC-5/-4)',    tz: 'America/New_York' },
  { label: '洛杉矶 (UTC-8/-7)', tz: 'America/Los_Angeles' },
  { label: '伦敦 (UTC+0/+1)',    tz: 'Europe/London' },
  { label: '巴黎 (UTC+1/+2)',    tz: 'Europe/Paris' },
] as const

function tzFormat(ts: number, tz: string | undefined): string {
  return new Date(ts * 1000).toLocaleString('zh-CN', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  })
}

export default function TimestampConverter() {
  const [unix, setUnix] = usePersistedState('tool:timestamp:unix', '')
  const [date, setDate] = usePersistedState('tool:timestamp:date', '')

  const tsFromUnix = useMemo(() => {
    const n = Number(unix)
    return unix.trim() && !isNaN(n) ? n : null
  }, [unix])

  const { tsFromDate, dateError } = useMemo(() => {
    if (!date.trim()) return { tsFromDate: null, dateError: '' }
    try { return { tsFromDate: dateToUnix(date), dateError: '' } }
    catch (e) { return { tsFromDate: null, dateError: (e as Error).message } }
  }, [date])

  const tableTs = tsFromUnix ?? tsFromDate

  return (
    <ToolErrorBoundary>
      <div className="max-w-lg space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Unix 时间戳 → 日期</label>
          <div className="flex gap-2">
            <Input
              value={unix}
              onChange={e => setUnix(e.target.value)}
              placeholder="例如 1713700000"
              className="font-mono"
              type="number"
            />
            <Button variant="outline" onClick={() => setUnix(String(nowUnix()))}>当前</Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">日期 / ISO 8601 → Unix</label>
          <Input
            value={date}
            onChange={e => setDate(e.target.value)}
            placeholder="例如 2024-01-01T00:00:00Z"
            className="font-mono"
          />
          {dateError && <p className="text-xs text-destructive">{dateError}</p>}
          {tsFromDate !== null && (
            <div className="rounded border bg-muted px-3 py-2 font-mono text-sm">Unix: {tsFromDate}</div>
          )}
        </div>

        {tableTs !== null && !isNaN(tableTs) && (
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">多时区对比</p>
            <div className="divide-y rounded-lg border">
              {TIMEZONES.map(({ label, tz }) => (
                <div key={label} className="flex items-center justify-between px-3 py-2 text-sm">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <code className="font-mono text-xs">{tzFormat(tableTs, tz)}</code>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
