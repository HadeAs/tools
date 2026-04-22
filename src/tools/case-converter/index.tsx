'use client'

import { useState, useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Textarea } from '@/components/ui/textarea'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { toCamel, toPascal, toSnake, toKebab, toUpper, toLower } from './logic'

const conversions = [
  { label: 'camelCase',  fn: toCamel },
  { label: 'PascalCase', fn: toPascal },
  { label: 'snake_case', fn: toSnake },
  { label: 'kebab-case', fn: toKebab },
  { label: 'UPPER_CASE', fn: toUpper },
  { label: 'lowercase',  fn: toLower },
]

export default function CaseConverter() {
  const [input, setInput] = usePersistedState('tool:case-converter:input', '')
  const [copied, setCopied] = useState<string | null>(null)

  const results = useMemo(() =>
    input.trim()
      ? conversions.map(({ label, fn }) => ({ label, result: fn(input) }))
      : null,
    [input]
  )

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">输入</p>
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="输入要转换的文本..."
            className="min-h-[100px] font-mono text-sm"
          />
        </div>
        {results && (
          <div className="grid gap-2 sm:grid-cols-2">
            {results.map(({ label, result }) => (
              <div key={label} className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                <div className="flex gap-2">
                  <code className="flex-1 overflow-auto rounded border bg-muted px-3 py-2 text-sm font-mono break-all">
                    {result}
                  </code>
                  <button
                    onClick={() => copy(result, label)}
                    className="shrink-0 rounded border px-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  >
                    {copied === label ? '✓' : '复制'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
