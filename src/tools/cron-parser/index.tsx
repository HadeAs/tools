'use client'

import { useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { parseCron, type CronResult } from './logic'

const PRESETS = [
  { label: '每分钟',    value: '* * * * *' },
  { label: '每小时',    value: '0 * * * *' },
  { label: '每天 0 点', value: '0 0 * * *' },
  { label: '每周一 9 点', value: '0 9 * * 1' },
  { label: '每月 1 号', value: '0 0 1 * *' },
]

export default function CronParser() {
  const [input, setInput] = usePersistedState('tool:cron-parser:input', '')

  const { result, error } = useMemo((): { result: CronResult | null; error: string } => {
    if (!input.trim()) return { result: null, error: '' }
    try { return { result: parseCron(input.trim()), error: '' } }
    catch (e) { return { result: null, error: e instanceof Error ? e.message : '解析失败' } }
  }, [input])

  return (
    <ToolErrorBoundary>
      <div className="space-y-4 max-w-xl">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cron 表达式</p>
          <p className="text-xs text-muted-foreground font-mono">分钟 小时 日 月 星期</p>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="例如 0 9 * * 1"
            className="font-mono"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(({ label, value }) => (
            <Button key={value} variant="outline" size="sm" onClick={() => setInput(value)}>
              {label}
            </Button>
          ))}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {result && (
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">含义</p>
              <div className="rounded border bg-muted px-3 py-2 text-sm">{result.description}</div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">最近 5 次执行时间</p>
              <div className="space-y-1">
                {result.nextRuns.map((run, i) => (
                  <div key={i} className="rounded border bg-muted px-3 py-2 font-mono text-sm">{run}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
