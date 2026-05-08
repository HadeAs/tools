'use client'

import { useState, useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { jsonToXml, defaultOptions, type Options } from './logic'

const PLACEHOLDER = `{
  "library": {
    "name": "City Library",
    "books": [
      { "title": "Clean Code", "author": "Robert C. Martin", "year": 2008 },
      { "title": "The Pragmatic Programmer", "author": "Andrew Hunt", "year": 1999 }
    ],
    "open": true,
    "address": null
  }
}`

export default function JsonToXml() {
  const [input, setInput] = usePersistedState('tool:json-to-xml:input', '')
  const [opts, setOpts] = usePersistedState<Options>('tool:json-to-xml:opts', defaultOptions)
  const [copied, setCopied] = useState(false)

  const { output, error } = useMemo(() => jsonToXml(input, opts), [input, opts])

  const copy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        {/* 选项栏 */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-muted-foreground whitespace-nowrap">根标签</label>
            <input
              value={opts.rootTag}
              onChange={e => setOpts({ ...opts, rootTag: e.target.value || 'root' })}
              className="h-7 w-24 rounded border bg-background px-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-xs text-muted-foreground whitespace-nowrap">数组子元素</label>
            <input
              value={opts.arraySuffix}
              onChange={e => setOpts({ ...opts, arraySuffix: e.target.value || 'item' })}
              className="h-7 w-20 rounded border bg-background px-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-1.5">
            <label className="text-xs text-muted-foreground whitespace-nowrap">缩进</label>
            <div className="flex gap-1">
              {([0, 2, 4] as const).map(n => (
                <Button
                  key={n}
                  size="sm"
                  variant={opts.indent === n ? 'default' : 'outline'}
                  className="h-7 w-8 px-0 text-xs"
                  onClick={() => setOpts({ ...opts, indent: n })}
                >
                  {n === 0 ? '压' : n}
                </Button>
              ))}
            </div>
          </div>

          <div className="h-4 w-px bg-border" />

          <label className="flex cursor-pointer items-center gap-1.5 text-xs select-none">
            <input
              type="checkbox"
              checked={opts.declaration}
              onChange={() => setOpts({ ...opts, declaration: !opts.declaration })}
              className="accent-primary"
            />
            XML 声明
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
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">XML</p>
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
                  <span className="text-muted-foreground">XML 将在这里显示…</span>
                )}
              </pre>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          数组元素统一用「数组子元素」标签包裹；特殊字符（&lt; &gt; &amp; &quot;）自动转义。
        </p>
      </div>
    </ToolErrorBoundary>
  )
}
