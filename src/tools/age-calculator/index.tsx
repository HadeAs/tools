'use client'

import { useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { calculateAge, today } from './logic'

export default function AgeCalculator() {
  const [birthday, setBirthday] = usePersistedState('tool:age-calculator:birthday', '')
  const [reference, setReference] = usePersistedState('tool:age-calculator:reference', today())

  const { result, error } = useMemo(() => {
    if (!birthday.trim()) return { result: null, error: '' }
    try { return { result: calculateAge(birthday, reference || undefined), error: '' } }
    catch (e) { return { result: null, error: e instanceof Error ? e.message : '计算失败' } }
  }, [birthday, reference])

  return (
    <ToolErrorBoundary>
      <div className="max-w-lg space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">出生日期</p>
            <input
              type="date"
              value={birthday}
              onChange={e => setBirthday(e.target.value)}
              max={today()}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              参考日期 <span className="normal-case font-normal text-muted-foreground">（留空=今天）</span>
            </p>
            <input
              type="date"
              value={reference}
              onChange={e => setReference(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {result && (
          <div className="space-y-3">
            {result.isBirthdayToday && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-center">
                <p className="text-sm font-medium text-primary">🎂 今天是生日！</p>
              </div>
            )}

            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">年龄</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['岁', result.years],
                  ['月', result.months],
                  ['天', result.days],
                ].map(([label, val]) => (
                  <div key={label} className="rounded-lg border bg-muted px-4 py-3 text-center">
                    <p className="text-2xl font-semibold font-mono">{val}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="divide-y rounded-lg border">
              {[
                ['总天数', `${result.totalDays.toLocaleString()} 天`],
                ['总周数', `${result.totalWeeks.toLocaleString()} 周`],
                ['下次生日', result.nextBirthdayDate],
                ['距下次生日', result.daysUntilNextBirthday === 0 ? '就是今天' : `${result.daysUntilNextBirthday} 天后`],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center justify-between px-3 py-2 text-sm">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <code className="font-mono text-sm">{val}</code>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
