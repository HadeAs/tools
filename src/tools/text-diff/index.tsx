'use client'

import { useMemo } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { computeDiff } from './logic'
import { usePersistedState } from '@/hooks/use-persisted-state'

export default function TextDiff() {
  const [left, setLeft] = usePersistedState('tool:text-diff:left', '')
  const [right, setRight] = usePersistedState('tool:text-diff:right', '')

  const parts = useMemo(() => (left || right) ? computeDiff(left, right) : null, [left, right])

  const stats = useMemo(() => {
    if (!parts) return null
    const added = parts.filter(p => p.type === 'added').reduce((s, p) => s + p.value.length, 0)
    const removed = parts.filter(p => p.type === 'removed').reduce((s, p) => s + p.value.length, 0)
    return { added, removed }
  }, [parts])

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">原始文本</p>
            <Textarea value={left} onChange={e => setLeft(e.target.value)} placeholder="原始文本..." className="min-h-[200px] font-mono text-sm" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">修改后</p>
            <Textarea value={right} onChange={e => setRight(e.target.value)} placeholder="修改后文本..." className="min-h-[200px] font-mono text-sm" />
          </div>
        </div>
        {parts && stats && (
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-xs">
              <p className="font-medium text-muted-foreground uppercase tracking-wide">差异结果</p>
              <span className="text-green-700 dark:text-green-400">+{stats.added} 字符</span>
              <span className="text-red-700 dark:text-red-400">-{stats.removed} 字符</span>
              {stats.added === 0 && stats.removed === 0 && (
                <span className="text-muted-foreground">无差异</span>
              )}
            </div>
            <div className="rounded-md border bg-muted/30 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
              {parts.map((part, i) => (
                <span
                  key={i}
                  className={
                    part.type === 'added' ? 'bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100' :
                    part.type === 'removed' ? 'bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-100 line-through' : ''
                  }
                >
                  {part.value}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
