'use client'

import { useState, useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ToolLayout } from '@/components/tool-layout'
import { jsonToCsv, csvToJson } from './logic'

const EXAMPLE_JSON = '[{"name":"Alice","age":30,"city":"Beijing"},{"name":"Bob","age":25,"city":"Shanghai"}]'
const EXAMPLE_CSV  = 'name,age,city\nAlice,30,Beijing\nBob,25,Shanghai'

export default function JsonCsv() {
  const [input, setInput] = usePersistedState('tool:json-csv:input', '')
  const [copied, setCopied] = useState(false)

  const { output, error, label } = useMemo(() => {
    const t = input.trim()
    if (!t) return { output: '', error: '', label: '' }
    if (t.startsWith('[') || t.startsWith('{')) {
      try { return { output: jsonToCsv(t), error: '', label: 'JSON → CSV' } }
      catch (e) { return { output: '', error: (e as Error).message, label: 'JSON → CSV' } }
    } else {
      try { return { output: csvToJson(t), error: '', label: 'CSV → JSON' } }
      catch (e) { return { output: '', error: (e as Error).message, label: 'CSV → JSON' } }
    }
  }, [input])

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolLayout
      input={
        <div className="space-y-2">
          <Textarea
            placeholder="粘贴 JSON 数组或 CSV 文本，自动识别格式..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="min-h-[220px] font-mono text-sm"
          />
          {label && !error && (
            <p className="text-xs text-muted-foreground">已识别：{label}</p>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      }
      output={
        <Textarea readOnly value={output} className="min-h-[220px] font-mono text-sm" placeholder="结果显示在此..." />
      }
      actions={
        <>
          <Button variant="outline" onClick={copy} disabled={!output}>{copied ? '已复制！' : '复制'}</Button>
          <Button variant="ghost" onClick={() => setInput(EXAMPLE_JSON)}>JSON 示例</Button>
          <Button variant="ghost" onClick={() => setInput(EXAMPLE_CSV)}>CSV 示例</Button>
          <Button variant="ghost" onClick={() => setInput('')}>清除</Button>
        </>
      }
    />
  )
}
