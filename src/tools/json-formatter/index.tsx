'use client'

import { useState } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ToolLayout } from '@/components/tool-layout'
import { formatJSON, minifyJSON, validateJSON } from './logic'

const EXAMPLE = '{"name":"DevTools","version":"1.0","features":["format","minify","validate"]}'

function highlightJson(json: string): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return esc(json).replace(
    /("(?:\\u[0-9a-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match) && /:$/.test(match))
        return `<span class="text-blue-600 dark:text-blue-400">${match}</span>`
      if (/^"/.test(match))
        return `<span class="text-green-600 dark:text-green-400">${match}</span>`
      if (/true|false|null/.test(match))
        return `<span class="text-violet-600 dark:text-violet-400">${match}</span>`
      return `<span class="text-amber-600 dark:text-amber-400">${match}</span>`
    }
  )
}

export default function JSONFormatter() {
  const [input, setInput] = usePersistedState('tool:json-formatter:input', '')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [highlight, setHighlight] = useState(false)

  const handle = (fn: (s: string) => string) => {
    try { setOutput(fn(input)); setError('') }
    catch (e) { setError((e as Error).message); setOutput('') }
  }

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const isValid = input ? validateJSON(input) : null

  const outputPane = output ? (
    highlight ? (
      <pre
        className="min-h-[240px] overflow-auto rounded-md border bg-muted/30 p-3 font-mono text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: highlightJson(output) }}
      />
    ) : (
      <Textarea readOnly value={output} className="min-h-[240px] font-mono text-sm" />
    )
  ) : (
    <Textarea readOnly value="" className="min-h-[240px] font-mono text-sm" placeholder="结果显示在此..." />
  )

  return (
    <ToolLayout
      input={
        <div className="space-y-2">
          <Textarea placeholder="在此粘贴 JSON..." value={input} onChange={e => setInput(e.target.value)} className="min-h-[240px] font-mono text-sm" />
          {isValid !== null && (
            <Badge variant={isValid ? 'default' : 'destructive'}>{isValid ? 'JSON 合法' : 'JSON 非法'}</Badge>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      }
      output={
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">输出</p>
            {output && (
              <button onClick={() => setHighlight(h => !h)}
                className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${highlight ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {highlight ? '高亮 ON' : '高亮 OFF'}
              </button>
            )}
          </div>
          {outputPane}
        </div>
      }
      actions={
        <>
          <Button onClick={() => handle(formatJSON)} disabled={!input}>格式化</Button>
          <Button variant="outline" onClick={() => handle(minifyJSON)} disabled={!input}>压缩</Button>
          <Button variant="outline" onClick={copyOutput} disabled={!output}>{copied ? '已复制！' : '复制'}</Button>
          <Button variant="ghost" onClick={() => setInput(EXAMPLE)}>加载示例</Button>
          <Button variant="ghost" onClick={() => { setInput(''); setOutput(''); setError('') }}>清除</Button>
        </>
      }
    />
  )
}
