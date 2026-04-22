'use client'

import { useState, useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { dateAdd, nowIso, TIME_UNITS, type TimeUnit, type Operation } from './logic'

export default function DateAddTool() {
  const [dateStr, setDateStr] = usePersistedState('tool:date-add:date', '')
  const [amount, setAmount] = usePersistedState('tool:date-add:amount', '1')
  const [unit, setUnit] = usePersistedState<TimeUnit>('tool:date-add:unit', 'days')
  const [op, setOp] = useState<Operation>('add')
  const [copied, setCopied] = useState(false)

  const { result, error } = useMemo(() => {
    if (!dateStr.trim() || !amount.trim()) return { result: null, error: '' }
    const n = Number(amount)
    if (isNaN(n) || n < 0) return { result: null, error: '请输入有效的数值' }
    try { return { result: dateAdd(dateStr, n, unit, op), error: '' } }
    catch (e) { return { result: null, error: e instanceof Error ? e.message : '计算失败' } }
  }, [dateStr, amount, unit, op])

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="max-w-lg space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">起始日期时间</p>
          <div className="flex gap-2">
            <Input
              value={dateStr}
              onChange={e => setDateStr(e.target.value)}
              placeholder="2024-01-01 或 2024-01-01T12:00:00"
              className="font-mono text-sm"
            />
            <Button variant="outline" size="sm" onClick={() => setDateStr(nowIso())}>现在</Button>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">操作</p>
          <div className="flex gap-2">
            {(['add', 'subtract'] as Operation[]).map(o => (
              <Button
                key={o}
                variant={op === o ? 'default' : 'outline'}
                size="sm"
                onClick={() => setOp(o)}
              >
                {o === 'add' ? '+ 加' : '− 减'}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">数量</p>
            <Input
              value={amount}
              onChange={e => setAmount(e.target.value)}
              type="number"
              min={0}
              className="font-mono"
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">单位</p>
            <select
              value={unit}
              onChange={e => setUnit(e.target.value as TimeUnit)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {TIME_UNITS.map(({ key, label }) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {result && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">结果</p>
            <div className="divide-y rounded-lg border">
              {[
                ['本地时间', result.formatted],
                ['ISO 8601', result.iso],
                ['Unix 时间戳', String(Math.floor(result.result.getTime() / 1000))],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center gap-3 px-3 py-2">
                  <span className="w-20 shrink-0 text-xs text-muted-foreground">{label}</span>
                  <code className="flex-1 break-all font-mono text-sm">{val}</code>
                  <Button variant="ghost" size="sm" onClick={() => copy(val)}>
                    {copied ? '✓' : '复制'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
