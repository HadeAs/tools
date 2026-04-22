'use client'

import { useState, useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ToolLayout } from '@/components/tool-layout'

const EXAMPLE = '{"name":"DevTools","version":"1.0","features":["format","minify","validate"],"active":true,"count":42,"config":null}'

// ── JSON tree components ──────────────────────────────────────────────────────

function Primitive({ value }: { value: string | number | boolean | null }) {
  if (value === null)
    return <span className="text-violet-600 dark:text-violet-400">null</span>
  if (typeof value === 'boolean')
    return <span className="text-violet-600 dark:text-violet-400">{String(value)}</span>
  if (typeof value === 'number')
    return <span className="text-amber-600 dark:text-amber-400">{String(value)}</span>
  return <span className="text-green-600 dark:text-green-400">{JSON.stringify(value)}</span>
}

function JsonNode({
  value,
  keyName,
  depth,
  isLast,
}: {
  value: unknown
  keyName?: string
  depth: number
  isLast: boolean
}) {
  const [open, setOpen] = useState(depth < 2)
  const comma = isLast ? null : <span className="text-muted-foreground">,</span>

  const keyEl = keyName !== undefined ? (
    <>
      <span className="text-blue-600 dark:text-blue-400">{JSON.stringify(keyName)}</span>
      <span className="text-muted-foreground">{': '}</span>
    </>
  ) : null

  // Primitive value
  if (value === null || typeof value !== 'object') {
    return (
      <div className="leading-6">
        {keyEl}
        <Primitive value={value as string | number | boolean | null} />
        {comma}
      </div>
    )
  }

  const isArr = Array.isArray(value)
  const ob = isArr ? '[' : '{'
  const cb = isArr ? ']' : '}'
  const entries = isArr
    ? (value as unknown[]).map((v, i, a) => ({ key: String(i), val: v, last: i === a.length - 1 }))
    : Object.entries(value as Record<string, unknown>).map(([k, v], i, a) => ({ key: k, val: v, last: i === a.length - 1 }))

  // Empty object/array
  if (entries.length === 0) {
    return (
      <div className="leading-6">
        {keyEl}
        <span className="text-muted-foreground">{ob}{cb}</span>
        {comma}
      </div>
    )
  }

  // Collapsed
  if (!open) {
    return (
      <div className="leading-6">
        {keyEl}
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1 rounded px-1.5 py-0 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <span className="text-[10px]">▶</span>
          <span>{ob}</span>
          <span className="text-xs opacity-70">
            {isArr ? `${entries.length} items` : `${entries.length} keys`}
          </span>
          <span>{cb}</span>
        </button>
        {comma}
      </div>
    )
  }

  // Expanded
  return (
    <div>
      <div className="leading-6">
        {keyEl}
        <button
          onClick={() => setOpen(false)}
          className="inline-flex items-center gap-1 rounded px-0.5 text-muted-foreground hover:text-foreground transition-colors"
          title="点击折叠"
        >
          <span className="text-[10px]">▼</span>
        </button>
        <span>{ob}</span>
      </div>
      <div className="ml-4 border-l border-border/40 pl-3">
        {entries.map(({ key, val, last }) => (
          <JsonNode
            key={key}
            keyName={isArr ? undefined : key}
            value={val}
            depth={depth + 1}
            isLast={last}
          />
        ))}
      </div>
      <div className="leading-6">{cb}{comma}</div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function JSONFormatter() {
  const [input, setInput] = usePersistedState('tool:json-formatter:input', '')
  const [copied, setCopied] = useState(false)
  const [minified, setMinified] = useState(false)

  const parseResult = useMemo(() => {
    const t = input.trim()
    if (!t) return { value: undefined, error: '' }
    try { return { value: JSON.parse(t), error: '' } }
    catch (e) { return { value: undefined, error: (e as Error).message } }
  }, [input])

  const { value: parsed, error: parseError } = parseResult
  const trimmed = input.trim()
  const isValid: boolean | null = trimmed ? parseError === '' : null
  const hasOutput = parsed !== undefined

  const copyOutput = async () => {
    const text = minified
      ? JSON.stringify(parsed)
      : JSON.stringify(parsed, null, 2)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const outputContent = hasOutput ? (
    minified ? (
      <pre className="min-h-[240px] overflow-auto rounded-md border bg-muted/30 p-3 font-mono text-sm break-all whitespace-pre-wrap">
        {JSON.stringify(parsed)}
      </pre>
    ) : (
      <div className="min-h-[240px] overflow-auto rounded-md border bg-muted/30 p-3 font-mono text-sm">
        <JsonNode value={parsed} depth={0} isLast={true} />
      </div>
    )
  ) : (
    <Textarea readOnly value="" className="min-h-[240px] font-mono text-sm" placeholder="结果显示在此..." />
  )

  return (
    <ToolLayout
      input={
        <div className="space-y-2">
          <Textarea
            placeholder="在此粘贴 JSON..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="min-h-[240px] font-mono text-sm"
          />
          {isValid !== null && (
            <Badge variant={isValid ? 'default' : 'destructive'}>
              {isValid ? 'JSON 合法' : 'JSON 非法'}
            </Badge>
          )}
          {parseError && <p className="text-xs text-destructive">{parseError}</p>}
        </div>
      }
      output={outputContent}
      actions={
        <>
          <Button variant={!minified ? 'default' : 'outline'} onClick={() => setMinified(false)} disabled={!input}>格式化</Button>
          <Button variant={minified ? 'default' : 'outline'} onClick={() => setMinified(true)} disabled={!input}>压缩</Button>
          <Button variant="outline" onClick={copyOutput} disabled={!hasOutput}>{copied ? '已复制！' : '复制'}</Button>
          <Button variant="ghost" onClick={() => setInput(EXAMPLE)}>加载示例</Button>
          <Button variant="ghost" onClick={() => { setInput(''); setMinified(false) }}>清除</Button>
        </>
      }
    />
  )
}
