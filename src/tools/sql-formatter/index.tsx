'use client'

import { useState, useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { formatSQL, DIALECTS, type SqlDialect } from './logic'

export default function SqlFormatterTool() {
  const [input, setInput] = usePersistedState('tool:sql-formatter:input', '')
  const [dialect, setDialect] = useState<SqlDialect>('sql')
  const [copied, setCopied] = useState(false)

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' }
    try { return { output: formatSQL(input, dialect), error: '' } }
    catch (e) { return { output: '', error: e instanceof Error ? e.message : '格式化失败' } }
  }, [input, dialect])

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">方言：</span>
          {DIALECTS.map(d => (
            <Button
              key={d.value}
              variant={dialect === d.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDialect(d.value)}
            >
              {d.label}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">输入 SQL</p>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="SELECT u.id,u.name,o.total FROM users u JOIN orders o ON u.id=o.user_id WHERE u.active=1 ORDER BY o.total DESC"
              className="h-64 w-full rounded-md border bg-background px-3 py-2 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">格式化结果</p>
              {output && <Button variant="ghost" size="sm" onClick={copy}>{copied ? '已复制！' : '复制'}</Button>}
            </div>
            {error
              ? <p className="text-sm text-destructive">{error}</p>
              : <pre className="h-64 overflow-auto rounded-md border bg-muted px-3 py-2 font-mono text-sm whitespace-pre">{output}</pre>
            }
          </div>
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
