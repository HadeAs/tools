'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { toCamel, toPascal, toSnake, toKebab, toUpper, toLower } from './logic'

const conversions = [
  { label: 'camelCase', fn: toCamel },
  { label: 'PascalCase', fn: toPascal },
  { label: 'snake_case', fn: toSnake },
  { label: 'kebab-case', fn: toKebab },
  { label: 'UPPER_CASE', fn: toUpper },
  { label: 'lowercase', fn: toLower },
]

export default function CaseConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [activeLabel, setActiveLabel] = useState('')
  const [copied, setCopied] = useState(false)

  const convert = (label: string, fn: (s: string) => string) => {
    setOutput(fn(input))
    setActiveLabel(label)
  }

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Input</p>
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to convert..." className="min-h-[120px] font-mono text-sm" />
        </div>
        <div className="flex flex-wrap gap-2">
          {conversions.map(({ label, fn }) => (
            <Button key={label} variant={activeLabel === label ? 'default' : 'outline'} onClick={() => convert(label, fn)} disabled={!input} className="font-mono">
              {label}
            </Button>
          ))}
        </div>
        {output && (
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Output</p>
              <Textarea readOnly value={output} className="min-h-[120px] font-mono text-sm" />
            </div>
            <Button variant="outline" size="sm" onClick={copyOutput}>{copied ? 'Copied!' : 'Copy'}</Button>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
