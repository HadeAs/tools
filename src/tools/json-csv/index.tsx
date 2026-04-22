'use client'

import { useState } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ToolLayout } from '@/components/tool-layout'
import { jsonToCsv, csvToJson } from './logic'

const EXAMPLE_JSON = '[{"name":"Alice","age":30,"city":"Beijing"},{"name":"Bob","age":25,"city":"Shanghai"}]'
const EXAMPLE_CSV  = 'name,age,city\nAlice,30,Beijing\nBob,25,Shanghai'

export default function JsonCsv() {
  const [input, setInput] = usePersistedState('tool:json-csv:input', '')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handle = (fn: (s: string) => string) => {
    try { setOutput(fn(input)); setError('') }
    catch (e) { setError((e as Error).message); setOutput('') }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolLayout
      input={
        <div className="space-y-2">
          <Textarea placeholder="JSON 数组 或 CSV 文本..." value={input} onChange={e => setInput(e.target.value)} className="min-h-[220px] font-mono text-sm" />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      }
      output={<Textarea readOnly value={output} className="min-h-[220px] font-mono text-sm" placeholder="结果显示在此..." />}
      actions={
        <>
          <Button onClick={() => handle(jsonToCsv)} disabled={!input}>JSON → CSV</Button>
          <Button variant="outline" onClick={() => handle(csvToJson)} disabled={!input}>CSV → JSON</Button>
          <Button variant="outline" onClick={copy} disabled={!output}>{copied ? '已复制！' : '复制'}</Button>
          <Button variant="ghost" onClick={() => setInput(EXAMPLE_JSON)}>JSON 示例</Button>
          <Button variant="ghost" onClick={() => setInput(EXAMPLE_CSV)}>CSV 示例</Button>
          <Button variant="ghost" onClick={() => { setInput(''); setOutput(''); setError('') }}>清除</Button>
        </>
      }
    />
  )
}
