'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { unixToDate, dateToUnix, nowUnix } from './logic'

export default function TimestampConverter() {
  const [unix, setUnix] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState('')

  const handleUnixToDate = () => {
    try { setDate(unixToDate(Number(unix))); setError('') }
    catch (e) { setError((e as Error).message) }
  }

  const handleDateToUnix = () => {
    try { setUnix(String(dateToUnix(date))); setError('') }
    catch (e) { setError((e as Error).message) }
  }

  return (
    <ToolErrorBoundary>
      <div className="max-w-lg space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Unix Timestamp</label>
          <div className="flex gap-2">
            <Input value={unix} onChange={e => setUnix(e.target.value)} placeholder="e.g. 1713700000" className="font-mono" type="number" />
            <Button onClick={handleUnixToDate} disabled={!unix}>→ Date</Button>
            <Button variant="outline" onClick={() => setUnix(String(nowUnix()))}>Now</Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date / ISO 8601</label>
          <div className="flex gap-2">
            <Input value={date} onChange={e => setDate(e.target.value)} placeholder="e.g. 2024-01-01T00:00:00Z" className="font-mono" />
            <Button onClick={handleDateToUnix} disabled={!date}>→ Unix</Button>
          </div>
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </ToolErrorBoundary>
  )
}
