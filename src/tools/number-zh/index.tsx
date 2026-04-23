'use client'

import { useMemo, useState } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { numberToZh } from './logic'

const EXAMPLES = ['1234567.89', '100000000', '0.05', '99999.99']

export default function NumberZh() {
  const [input, setInput] = usePersistedState('tool:number-zh:input', '')
  const [copied, setCopied] = useState(false)

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' }
    try { return { output: numberToZh(input), error: '' } }
    catch (e) { return { output: '', error: e instanceof Error ? e.message : '转换失败' } }
  }, [input])

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">阿拉伯数字</p>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="例如：1234567.89"
            className="w-full rounded-md border bg-background px-3 py-2 font-mono text-lg focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <div className="flex flex-wrap gap-2 pt-1">
            {EXAMPLES.map(ex => (
              <button key={ex} onClick={() => setInput(ex)}
                className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                {ex}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {output && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">中文大写</p>
              <Button variant="ghost" size="sm" onClick={copy}>{copied ? '已复制！' : '复制'}</Button>
            </div>
            <div className="rounded-lg border bg-muted px-4 py-4 text-xl font-medium tracking-wide leading-relaxed">
              {output}
            </div>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
