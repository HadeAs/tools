'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { TIMEZONES, convertToZone, getOffset } from './logic'

function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function TimezoneConverter() {
  const [datetimeLocal, setDatetimeLocal] = useState(() => toDatetimeLocal(new Date()))
  const [sourceZone, setSourceZone] = useState('Asia/Shanghai')

  const date = useMemo(() => {
    if (!datetimeLocal) return null
    // Parse the datetime-local string as a time in the source timezone
    // We first parse it as local time, then shift to the intended source timezone
    const local = new Date(datetimeLocal)
    if (isNaN(local.getTime())) return null
    // Get offset of source zone vs UTC at that local time
    const utcDate = new Date(local.toLocaleString('en-US', { timeZone: 'UTC' }))
    const srcDate = new Date(local.toLocaleString('en-US', { timeZone: sourceZone }))
    const diff = utcDate.getTime() - srcDate.getTime()
    return new Date(local.getTime() + diff)
  }, [datetimeLocal, sourceZone])

  const conversions = useMemo(() => {
    if (!date) return []
    return TIMEZONES.map(tz => ({
      ...tz,
      formatted: convertToZone(date, tz.value),
      offset: getOffset(date, tz.value),
    }))
  }, [date])

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">日期时间</p>
            <input
              type="datetime-local"
              value={datetimeLocal}
              onChange={e => setDatetimeLocal(e.target.value)}
              className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">来源时区</p>
            <select
              value={sourceZone}
              onChange={e => setSourceZone(e.target.value)}
              className="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {TIMEZONES.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>
          <Button variant="outline" size="sm" onClick={() => setDatetimeLocal(toDatetimeLocal(new Date()))}>
            现在
          </Button>
        </div>

        {date && (
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">时区</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">偏移</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">时间</th>
                </tr>
              </thead>
              <tbody>
                {conversions.map((tz, i) => (
                  <tr key={tz.value} className={`${i % 2 === 0 ? '' : 'bg-muted/20'} ${tz.value === sourceZone ? 'font-medium text-primary' : ''}`}>
                    <td className="px-4 py-2.5">{tz.label}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{tz.offset}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{tz.formatted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
