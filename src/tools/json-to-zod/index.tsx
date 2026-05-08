'use client'

import { useState, useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { jsonToZod, inferTypeLine, defaultOptions, type Options } from './logic'

const PLACEHOLDER = `{
  "user": {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "roles": ["admin", "editor"],
    "address": {
      "city": "Beijing",
      "zip": "100000"
    },
    "active": true,
    "score": 9.5
  }
}`

export default function JsonToZod() {
  const [input, setInput] = usePersistedState('tool:json-to-zod:input', '')
  const [opts, setOpts] = usePersistedState<Options>('tool:json-to-zod:opts', defaultOptions)
  const [showInfer, setShowInfer] = useState(true)
  const [copied, setCopied] = useState(false)

  const { output, error } = useMemo(() => jsonToZod(input, opts), [input, opts])

  const fullOutput = useMemo(() => {
    if (!output) return ''
    if (!showInfer) return output
    return output + '\n\n' + inferTypeLine(opts.rootName, opts.addExport)
  }, [output, showInfer, opts.rootName, opts.addExport])

  const copy = async () => {
    if (!fullOutput) return
    await navigator.clipboard.writeText(fullOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        {/* 选项栏 */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-muted-foreground whitespace-nowrap">根 Schema 名</label>
            <input
              value={opts.rootName}
              onChange={e => setOpts({ ...opts, rootName: e.target.value || 'root' })}
              className="h-7 w-24 rounded border bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="h-4 w-px bg-border" />

          {(
            [
              ['addExport',      'export'],
              ['optionalFields', '可选字段 (?)'],
              ['inferInt',       '整数 → .int()'],
            ] as [keyof Options, string][]
          ).map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center gap-1.5 text-xs select-none">
              <input
                type="checkbox"
                checked={opts[key] as boolean}
                onChange={() => setOpts({ ...opts, [key]: !opts[key] })}
                className="accent-primary"
              />
              {label}
            </label>
          ))}

          <label className="flex cursor-pointer items-center gap-1.5 text-xs select-none">
            <input
              type="checkbox"
              checked={showInfer}
              onChange={() => setShowInfer(v => !v)}
              className="accent-primary"
            />
            附加 type 推断
          </label>
        </div>

        {/* 编辑区 */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">输入 JSON</p>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={PLACEHOLDER}
              spellCheck={false}
              className="h-80 w-full rounded-md border bg-background px-3 py-2 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Zod Schema</p>
              {fullOutput && (
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={copy}>
                  {copied ? '已复制！' : '复制'}
                </Button>
              )}
            </div>
            {error ? (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : (
              <pre className="h-80 overflow-auto rounded-md border bg-muted px-3 py-2 font-mono text-sm whitespace-pre">
                {fullOutput || (
                  <span className="text-muted-foreground">Zod Schema 将在这里显示…</span>
                )}
              </pre>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          需在项目中安装 <code className="rounded bg-muted px-1">zod</code>（<code className="rounded bg-muted px-1">npm i zod</code>）。所有转换在浏览器本地完成。
        </p>
      </div>
    </ToolErrorBoundary>
  )
}
