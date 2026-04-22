'use client'

import { useState, useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { testRegex, replaceRegex } from './logic'

const EXAMPLE_PATTERN = '\\b\\w+@\\w+\\.\\w+\\b'
const EXAMPLE_INPUT   = 'Contact us at hello@example.com or support@devtools.io'

type Tab = 'match' | 'replace'

export default function RegexTester() {
  const [pattern, setPattern] = usePersistedState('tool:regex-tester:pattern', '')
  const [flags,   setFlags]   = usePersistedState('tool:regex-tester:flags', 'g')
  const [input,   setInput]   = usePersistedState('tool:regex-tester:input', '')
  const [replace, setReplace] = useState('$&')
  const [tab, setTab] = useState<Tab>('match')

  const result = useMemo(() => {
    if (!pattern || !input) return null
    return testRegex(pattern, input, flags)
  }, [pattern, flags, input])

  const replaced = useMemo(() => {
    if (tab !== 'replace' || !pattern || !input) return ''
    try { return replaceRegex(pattern, input, flags, replace) }
    catch { return '' }
  }, [tab, pattern, input, flags, replace])

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

  const hasGroups = result && result.groups.some(g => g.length > 0)

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">正则表达式</label>
            <Input value={pattern} onChange={e => setPattern(e.target.value)} placeholder="例如 \d+" className="font-mono" />
          </div>
          <div className="w-24 space-y-1">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">标志位</label>
            <Input value={flags} onChange={e => setFlags(e.target.value)} placeholder="g, i, m" className="font-mono" />
          </div>
        </div>

        {result?.error && <p className="text-xs text-destructive">{result.error}</p>}

        <div className="space-y-1">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">测试字符串</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="输入要测试的文本..." className="min-h-[120px] font-mono text-sm" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b">
          {(['match', 'replace'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 pb-2 text-xs font-medium transition-colors ${tab === t ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t === 'match' ? '匹配结果' : '替换'}
            </button>
          ))}
        </div>

        {tab === 'match' && input && result && !result.error && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">匹配数</span>
              <Badge variant={result.matches.length > 0 ? 'default' : 'secondary'}>{result.matches.length}</Badge>
            </div>
            <div className="rounded-md border bg-muted/50 p-3 font-mono text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlighted }} />

            {hasGroups && (
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">捕获组</p>
                <div className="overflow-auto rounded-md border">
                  <table className="w-full text-xs">
                    <thead className="bg-muted text-left">
                      <tr>
                        <th className="px-3 py-1.5 font-medium">匹配</th>
                        <th className="px-3 py-1.5 font-medium">完整</th>
                        {result.groups[0]?.map((_, i) => (
                          <th key={i} className="px-3 py-1.5 font-medium">组 {i + 1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y font-mono">
                      {result.matches.map((m, i) => (
                        <tr key={i} className="hover:bg-muted/50">
                          <td className="px-3 py-1.5 text-muted-foreground">#{i + 1}</td>
                          <td className="px-3 py-1.5">{m}</td>
                          {result.groups[i].map((g, j) => (
                            <td key={j} className="px-3 py-1.5 text-green-600 dark:text-green-400">{g ?? <span className="text-muted-foreground">undefined</span>}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'replace' && (
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">替换为 <span className="font-normal normal-case text-muted-foreground">（支持 $1 $2 引用捕获组）</span></label>
              <Input value={replace} onChange={e => setReplace(e.target.value)} className="font-mono" placeholder="$&" />
            </div>
            {replaced && (
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">替换结果</p>
                <pre className="min-h-[80px] whitespace-pre-wrap break-words rounded-md border bg-muted/50 p-3 font-mono text-sm">{replaced}</pre>
              </div>
            )}
          </div>
        )}

        <Button variant="ghost" size="sm" onClick={() => { setPattern(EXAMPLE_PATTERN); setInput(EXAMPLE_INPUT) }}>
          加载示例
        </Button>
      </div>
    </ToolErrorBoundary>
  )
}
