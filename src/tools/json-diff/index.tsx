'use client'

import { useMemo, useState } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { diffJson, isSame } from './logic'

export default function JsonDiff() {
  const [left, setLeft] = usePersistedState('tool:json-diff:left', '')
  const [right, setRight] = usePersistedState('tool:json-diff:right', '')

  const { lines, leftError, rightError } = useMemo(() => {
    if (!left.trim() && !right.trim()) return { lines: null, leftError: '', rightError: '' }
    let leftError = ''
    let rightError = ''
    try { JSON.parse(left) } catch { leftError = 'JSON 格式错误' }
    try { JSON.parse(right) } catch { rightError = 'JSON 格式错误' }
    if (leftError || rightError || !left.trim() || !right.trim()) {
      return { lines: null, leftError, rightError }
    }
    try { return { lines: diffJson(left, right), leftError: '', rightError: '' } }
    catch { return { lines: null, leftError: '解析失败', rightError: '' } }
  }, [left, right])

  const same = useMemo(() => {
    if (!lines) return false
    try { return isSame(left, right) } catch { return false }
  }, [lines, left, right])

  const addedCount = lines?.filter(l => l.type === 'added').length ?? 0
  const removedCount = lines?.filter(l => l.type === 'removed').length ?? 0

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">JSON A</p>
            <textarea
              value={left}
              onChange={e => setLeft(e.target.value)}
              placeholder={'{\n  "name": "Alice",\n  "age": 30\n}'}
              className="h-48 w-full rounded-md border bg-background px-3 py-2 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {leftError && <p className="text-xs text-destructive">{leftError}</p>}
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">JSON B</p>
            <textarea
              value={right}
              onChange={e => setRight(e.target.value)}
              placeholder={'{\n  "name": "Alice",\n  "age": 31\n}'}
              className="h-48 w-full rounded-md border bg-background px-3 py-2 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {rightError && <p className="text-xs text-destructive">{rightError}</p>}
          </div>
        </div>

        {lines && (
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              {same ? (
                <span className="text-green-500 font-medium">✓ 两个 JSON 完全相同</span>
              ) : (
                <>
                  <span className="text-red-500">− {removedCount} 行删除</span>
                  <span className="text-green-500">+ {addedCount} 行新增</span>
                </>
              )}
            </div>
            <div className="rounded-md border font-mono text-sm overflow-auto max-h-[400px]">
              {lines.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.type === 'added'
                      ? 'bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-0.5'
                      : line.type === 'removed'
                      ? 'bg-red-500/10 text-red-700 dark:text-red-400 px-3 py-0.5'
                      : 'px-3 py-0.5 text-muted-foreground'
                  }
                >
                  <span className="mr-2 select-none opacity-50 text-xs w-4 inline-block">
                    {line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '}
                  </span>
                  <span className="whitespace-pre">{line.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
