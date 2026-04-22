'use client'

import { useState, useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { testRegex } from './logic'

const EXAMPLE_PATTERN = '\\b\\w+@\\w+\\.\\w+\\b'
const EXAMPLE_INPUT = 'Contact us at hello@example.com or support@devtools.io'

export default function RegexTester() {
  const [pattern, setPattern] = usePersistedState('tool:regex-tester:pattern', '')
  const [flags, setFlags] = usePersistedState('tool:regex-tester:flags', 'g')
  const [input, setInput] = usePersistedState('tool:regex-tester:input', '')

  const result = useMemo(() => {
    if (!pattern || !input) return null
    return testRegex(pattern, input, flags)
  }, [pattern, flags, input])

  const highlighted = useMemo(() => {
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    if (!result || result.error || result.indices.length === 0) return esc(input)
    const parts: string[] = []
    let last = 0
    result.matches.forEach((match, i) => {
      const start = result.indices[i]
      if (start > last) parts.push(esc(input.slice(last, start)))
      parts.push(`<mark class="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">${esc(match)}</mark>`)
      last = start + match.length
    })
    if (last < input.length) parts.push(esc(input.slice(last)))
    return parts.join('')
  }, [result, input])

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">正则表达式</label>
            <Input value={pattern} onChange={e => setPattern(e.target.value)} placeholder="例如 \d+" className="font-mono" />
          </div>
          <div className="w-24 space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">标志位</label>
            <Input value={flags} onChange={e => setFlags(e.target.value)} placeholder="g, i, m" className="font-mono" />
          </div>
        </div>

        {result?.error && <p className="text-xs text-destructive">{result.error}</p>}

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">测试字符串</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="输入要测试的文本..." className="min-h-[140px] font-mono text-sm" />
        </div>

        {input && result && !result.error && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">匹配结果</span>
              <Badge variant={result.matches.length > 0 ? 'default' : 'secondary'}>{result.matches.length}</Badge>
            </div>
            <div
              className="rounded-md border bg-muted/50 p-3 font-mono text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </div>
        )}

        <Button variant="ghost" size="sm" onClick={() => { setPattern(EXAMPLE_PATTERN); setInput(EXAMPLE_INPUT) }}>
          加载示例
        </Button>
      </div>
    </ToolErrorBoundary>
  )
}
