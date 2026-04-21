'use client'

import { useState, useMemo } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { computeDiff } from './logic'

export default function TextDiff() {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')

  const parts = useMemo(() => (left || right) ? computeDiff(left, right) : null, [left, right])

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Original</p>
            <Textarea value={left} onChange={e => setLeft(e.target.value)} placeholder="Original text..." className="min-h-[200px] font-mono text-sm" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Modified</p>
            <Textarea value={right} onChange={e => setRight(e.target.value)} placeholder="Modified text..." className="min-h-[200px] font-mono text-sm" />
          </div>
        </div>
        {parts && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Diff</p>
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
