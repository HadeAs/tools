'use client'

import { useMemo, useState } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { convert, type ConvDirection } from './logic'

export default function SimpTrad() {
  const [input, setInput] = usePersistedState('tool:simp-trad:input', '')
  const [direction, setDirection] = useState<ConvDirection>('cn-to-tw')
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => {
    if (!input.trim()) return ''
    try { return convert(input, direction) }
    catch { return '' }
  }, [input, direction])

  const swap = () => {
    setDirection(d => d === 'cn-to-tw' ? 'tw-to-cn' : 'cn-to-tw')
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button size="sm" variant={direction === 'cn-to-tw' ? 'default' : 'outline'}
            onClick={() => setDirection('cn-to-tw')}>
            简体 → 繁体
          </Button>
          <Button size="sm" variant="ghost" onClick={swap}>⇄</Button>
          <Button size="sm" variant={direction === 'tw-to-cn' ? 'default' : 'outline'}
            onClick={() => setDirection('tw-to-cn')}>
            繁体 → 简体
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {direction === 'cn-to-tw' ? '简体中文' : '繁體中文'}
            </p>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={direction === 'cn-to-tw' ? '输入简体中文...' : '輸入繁體中文...'}
              className="h-56 w-full rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {direction === 'cn-to-tw' ? '繁體中文' : '简体中文'}
              </p>
              {output && <Button variant="ghost" size="sm" onClick={copy}>{copied ? '已复制！' : '复制'}</Button>}
            </div>
            <div className="h-56 overflow-auto rounded-md border bg-muted px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed">
              {output || <span className="text-muted-foreground">结果显示在这里</span>}
            </div>
          </div>
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
