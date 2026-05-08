'use client'

import { useState, useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { jsonToTs, defaultOptions, type Options } from './logic'

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

export default function JsonToTs() {
  const [input, setInput] = usePersistedState('tool:json-to-ts:input', '')
  const [opts, setOpts] = usePersistedState<Options>('tool:json-to-ts:opts', defaultOptions)
  const [copied, setCopied] = useState(false)

  const { output, error } = useMemo(() => jsonToTs(input, opts), [input, opts])

  const copy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const toggle = (key: keyof Options) => {
    if (key === 'rootName') return
    setOpts({ ...opts, [key]: !opts[key] })
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        {/* 选项栏 */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 根接口名称 */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-muted-foreground whitespace-nowrap">根接口名</label>
            <input
              value={opts.rootName}
              onChange={e => setOpts({ ...opts, rootName: e.target.value || 'Root' })}
              className="h-7 w-24 rounded border bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="h-4 w-px bg-border" />

          {/* interface / type 切换 */}
          <div className="flex gap-1">
            {(['interface', 'type'] as const).map(k => (
              <Button
                key={k}
                size="sm"
                variant={
                  (k === 'interface') === opts.useInterface ? 'default' : 'outline'
                }
                className="h-7 px-2.5 text-xs"
                onClick={() => setOpts({ ...opts, useInterface: k === 'interface' })}
              >
                {k}
              </Button>
            ))}
          </div>

          <div className="h-4 w-px bg-border" />

          {/* 复选项 */}
          {(
            [
              ['addExport', 'export'],
              ['optionalFields', '可选字段 (?)'],
            ] as [keyof Options, string][]
          ).map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center gap-1.5 text-xs select-none">
              <input
                type="checkbox"
                checked={opts[key] as boolean}
                onChange={() => toggle(key)}
                className="accent-primary"
              />
              {label}
            </label>
          ))}
        </div>

        {/* 编辑区 */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* 输入 */}
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              输入 JSON
            </p>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={PLACEHOLDER}
              spellCheck={false}
              className="h-80 w-full rounded-md border bg-background px-3 py-2 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* 输出 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                TypeScript
              </p>
              {output && (
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
                {output || (
                  <span className="text-muted-foreground">TypeScript 类型将在这里显示…</span>
                )}
              </pre>
            )}
          </div>
        </div>

        {/* 说明 */}
        <p className="text-xs text-muted-foreground">
          支持嵌套对象、数组、联合类型推断；所有转换在浏览器本地完成，数据不会上传。
        </p>
      </div>
    </ToolErrorBoundary>
  )
}
