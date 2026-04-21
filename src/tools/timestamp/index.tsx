'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { unixToDate, dateToUnix, nowUnix } from './logic'

export default function TimestampConverter() {
  const [unix, setUnix] = useState('')
  const [date, setDate] = useState('')
  const [unixResult, setUnixResult] = useState('')
  const [dateResult, setDateResult] = useState('')
  const [error, setError] = useState('')

  const handleUnixToDate = () => {
    try { setDateResult(unixToDate(Number(unix))); setError('') }
    catch (e) { setError((e as Error).message) }
  }

  const handleDateToUnix = () => {
    try { setUnixResult(String(dateToUnix(date))); setError('') }
    catch (e) { setError((e as Error).message) }
  }

  return (
    <ToolErrorBoundary>
      <div className="max-w-lg space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Unix 时间戳 → 日期</label>
          <div className="flex gap-2">
            <Input value={unix} onChange={e => setUnix(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleUnixToDate()} placeholder="例如 1713700000" className="font-mono" type="number" />
            <Button onClick={handleUnixToDate} disabled={!unix}>转换</Button>
            <Button variant="outline" onClick={() => setUnix(String(nowUnix()))}>当前时间</Button>
          </div>
          {dateResult && (
            <div className="rounded border bg-muted px-3 py-2 font-mono text-sm">{dateResult}</div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">日期 / ISO 8601 → Unix</label>
          <div className="flex gap-2">
            <Input value={date} onChange={e => setDate(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleDateToUnix()} placeholder="例如 2024-01-01T00:00:00Z" className="font-mono" />
            <Button onClick={handleDateToUnix} disabled={!date}>转换</Button>
          </div>
          {unixResult && (
            <div className="rounded border bg-muted px-3 py-2 font-mono text-sm">{unixResult}</div>
          )}
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </ToolErrorBoundary>
  )
}
