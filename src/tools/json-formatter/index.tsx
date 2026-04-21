'use client'

import { useState } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ToolLayout } from '@/components/tool-layout'
import { formatJSON, minifyJSON, validateJSON } from './logic'

const EXAMPLE = '{"name":"DevTools","version":"1.0","features":["format","minify","validate"]}'

export default function JSONFormatter() {
  const [input, setInput] = usePersistedState('tool:json-formatter:input', '')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

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
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      }
      output={
        <Textarea readOnly value={output} className="min-h-[240px] font-mono text-sm" placeholder="结果显示在此..." />
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
