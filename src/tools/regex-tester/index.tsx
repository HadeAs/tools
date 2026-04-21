'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { testRegex } from './logic'

const EXAMPLE_PATTERN = '\\b\\w+@\\w+\\.\\w+\\b'
const EXAMPLE_INPUT = 'Contact us at hello@example.com or support@devtools.io'

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [input, setInput] = useState('')

  const result = useMemo(() => {
    if (!pattern || !input) return null
    return testRegex(pattern, input, flags)
  }, [pattern, flags, input])

  const highlighted = useMemo(() => {
    if (!result || result.error || result.indices.length === 0) return input
    let offset = 0
    let out = input
    result.matches.forEach((match, i) => {
      const idx = result.indices[i] + offset
      const tag = `<mark class="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">${match}</mark>`
      out = out.slice(0, idx) + tag + out.slice(idx + match.length)
      offset += tag.length - match.length
    })
    return out
  }, [result, input])

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pattern</label>
            <Input value={pattern} onChange={e => setPattern(e.target.value)} placeholder="e.g. \d+" className="font-mono" />
          </div>
          <div className="w-24 space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Flags</label>
            <Input value={flags} onChange={e => setFlags(e.target.value)} placeholder="g, i, m" className="font-mono" />
          </div>
        </div>

        {result?.error && <p className="text-xs text-destructive">{result.error}</p>}

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Test String</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to test against..." className="min-h-[140px] font-mono text-sm" />
        </div>

        {input && result && !result.error && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Matches</span>
              <Badge variant={result.matches.length > 0 ? 'default' : 'secondary'}>{result.matches.length}</Badge>
            </div>
            <div
              className="rounded-md border bg-muted/50 p-3 font-mono text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </div>
        )}

        <Button variant="ghost" size="sm" onClick={() => { setPattern(EXAMPLE_PATTERN); setInput(EXAMPLE_INPUT) }}>
          Load Example
        </Button>
      </div>
    </ToolErrorBoundary>
  )
}
