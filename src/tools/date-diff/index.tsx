'use client'

import { useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { dateDiff, today } from './logic'

function Stat({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-lg border bg-muted px-4 py-3 text-center">
      <p className="text-2xl font-semibold font-mono">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

export default function DateDiff() {
  const [dateA, setDateA] = usePersistedState('tool:date-diff:a', today())
  const [dateB, setDateB] = usePersistedState('tool:date-diff:b', today())

  const { result, error } = useMemo(() => {
    try { return { result: dateDiff(dateA, dateB), error: '' } }
    catch (e) { return { result: null, error: e instanceof Error ? e.message : '计算失败' } }
  }, [dateA, dateB])

  return (
    <ToolErrorBoundary>
      <div className="max-w-lg space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {([['开始日期', dateA, setDateA], ['结束日期', dateB, setDateB]] as const).map(
            ([label, val, set]) => (
              <div key={label} className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                <input
                  type="date"
                  value={val}
                  onChange={e => set(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            )
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { setDateA(today()); setDateB(today()) }}>
            重置为今天
          </Button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {result && (
          <div className="space-y-3">
            {result.isPast && (
              <p className="text-xs text-muted-foreground">（结束日期早于开始日期，已自动交换计算）</p>
            )}

            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">详细差值</p>
              <div className="grid grid-cols-3 gap-2">
                <Stat label="年" value={result.years} />
                <Stat label="月" value={result.months} />
                <Stat label="天" value={result.days} />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">总计</p>
              <div className="divide-y rounded-lg border">
                {[
                  ['总天数', result.totalDays.toLocaleString(), '天'],
                  ['总小时', result.totalHours.toLocaleString(), '小时'],
                  ['总分钟', result.totalMinutes.toLocaleString(), '分钟'],
                  ['总秒数', result.totalSeconds.toLocaleString(), '秒'],
                ].map(([label, val, unit]) => (
                  <div key={label} className="flex items-center justify-between px-3 py-2 text-sm">
                    <span className="text-muted-foreground text-xs">{label}</span>
                    <code className="font-mono">{val} {unit}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
