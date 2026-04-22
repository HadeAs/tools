'use client'

import { useState, useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { convert, type Mode } from './logic'

export default function YamlJson() {
  const [input, setInput] = usePersistedState('tool:yaml-json:input', '')
  const [mode, setMode] = useState<Mode>('json-to-yaml')
  const [copied, setCopied] = useState(false)

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' }
    try { return { output: convert(input, mode), error: '' } }
    catch (e) { return { output: '', error: e instanceof Error ? e.message : '转换失败' } }
  }, [input, mode])

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="flex gap-2">
          {(['json-to-yaml', 'yaml-to-json'] as Mode[]).map(m => (
            <Button
              key={m}
              variant={mode === m ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode(m)}
            >
              {m === 'json-to-yaml' ? 'JSON → YAML' : 'YAML → JSON'}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              输入 {mode === 'json-to-yaml' ? 'JSON' : 'YAML'}
            </p>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={mode === 'json-to-yaml'
                ? '{\n  "name": "Alice",\n  "age": 30\n}'
                : 'name: Alice\nage: 30'}
              className="h-64 w-full rounded-md border bg-background px-3 py-2 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                输出 {mode === 'json-to-yaml' ? 'YAML' : 'JSON'}
              </p>
              {output && (
                <Button variant="ghost" size="sm" onClick={copy}>{copied ? '已复制！' : '复制'}</Button>
              )}
            </div>
            {error
              ? <p className="text-sm text-destructive">{error}</p>
              : <pre className="h-64 overflow-auto rounded-md border bg-muted px-3 py-2 font-mono text-sm whitespace-pre-wrap">{output}</pre>
            }
          </div>
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
