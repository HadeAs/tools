'use client'

import { useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Input } from '@/components/ui/input'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { parseUrl } from './logic'

const FIELDS = [
  { key: 'protocol', label: '协议' },
  { key: 'hostname', label: '主机名' },
  { key: 'port',     label: '端口' },
  { key: 'pathname', label: '路径' },
  { key: 'search',   label: '查询字符串' },
  { key: 'hash',     label: '哈希' },
] as const

export default function UrlParser() {
  const [input, setInput] = usePersistedState('tool:url-parser:input', '')

  const { result, error } = useMemo(() => {
    if (!input.trim()) return { result: null, error: '' }
    try { return { result: parseUrl(input.trim()), error: '' } }
    catch (e) { return { result: null, error: e instanceof Error ? e.message : '无效 URL' } }
  }, [input])

  return (
    <ToolErrorBoundary>
      <div className="max-w-2xl space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">URL</p>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="https://example.com:8080/path?foo=bar&baz=qux#section"
            className="font-mono text-sm"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {result && (
          <div className="space-y-3">
            <div className="divide-y rounded-lg border">
              {FIELDS.map(({ key, label }) => {
                const val = result[key]
                if (!val) return null
                return (
                  <div key={key} className="flex items-baseline gap-3 px-3 py-2">
                    <span className="w-24 shrink-0 text-xs text-muted-foreground">{label}</span>
                    <code className="break-all font-mono text-sm">{val}</code>
                  </div>
                )
              })}
            </div>

            {result.params.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">查询参数</p>
                <div className="divide-y rounded-lg border">
                  {result.params.map(({ key, value }) => (
                    <div key={key} className="flex items-baseline gap-3 px-3 py-2">
                      <code className="w-32 shrink-0 break-all font-mono text-sm text-primary">{key}</code>
                      <code className="break-all font-mono text-sm">{value}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
