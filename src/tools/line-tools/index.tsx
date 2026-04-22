'use client'

import { useState, useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { processLines, type LineOp } from './logic'

const OPS: { key: LineOp; label: string; desc: string }[] = [
  { key: 'sort-asc',     label: '升序排序',   desc: 'A → Z' },
  { key: 'sort-desc',    label: '降序排序',   desc: 'Z → A' },
  { key: 'dedupe',       label: '去重',        desc: '删除重复行' },
  { key: 'remove-empty', label: '删除空行',   desc: '移除空白行' },
  { key: 'trim',         label: '去除空格',   desc: '裁剪每行首尾' },
  { key: 'reverse',      label: '反转',        desc: '行顺序反转' },
  { key: 'shuffle',      label: '随机打乱',   desc: '随机排序' },
]

export default function LineTools() {
  const [input, setInput] = usePersistedState('tool:line-tools:input', '')
  const [op, setOp] = useState<LineOp>('sort-asc')
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => {
    if (!input) return ''
    return processLines(input, op)
  }, [input, op])

  const lineCount = input ? input.split('\n').length : 0

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">操作</p>
          <div className="flex flex-wrap gap-2">
            {OPS.map(({ key, label, desc }) => (
              <button
                key={key}
                onClick={() => setOp(key)}
                title={desc}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                  op === key
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'bg-card hover:border-primary/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              输入 {lineCount > 0 && <span className="normal-case font-normal">({lineCount} 行)</span>}
            </p>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={'banana\napple\ncherry\napple\n\nbanana'}
              className="h-64 w-full rounded-md border bg-background px-3 py-2 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                输出 {output && <span className="normal-case font-normal">({output.split('\n').length} 行)</span>}
              </p>
              {output && (
                <Button variant="ghost" size="sm" onClick={copy}>{copied ? '已复制！' : '复制'}</Button>
              )}
            </div>
            <pre className="h-64 overflow-auto rounded-md border bg-muted px-3 py-2 font-mono text-sm whitespace-pre-wrap">{output}</pre>
          </div>
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
