'use client'

import { useState } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ToolLayout } from '@/components/tool-layout'
import { encodeEntities, decodeEntities } from './logic'

const EXAMPLE = '<div class="hello">it\'s a <b>test</b> & more</div>'

export default function HtmlEntities() {
  const [input, setInput] = usePersistedState('tool:html-entities:input', '')
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
          <Textarea placeholder="输入文本或 HTML 实体..." value={input} onChange={e => setInput(e.target.value)} className="min-h-[200px] font-mono text-sm" />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      }
      output={<Textarea readOnly value={output} className="min-h-[200px] font-mono text-sm" placeholder="结果显示在此..." />}
      actions={
        <>
          <Button onClick={() => handle(encodeEntities)} disabled={!input}>编码</Button>
          <Button variant="outline" onClick={() => handle(decodeEntities)} disabled={!input}>解码</Button>
          <Button variant="outline" onClick={copy} disabled={!output}>{copied ? '已复制！' : '复制'}</Button>
          <Button variant="ghost" onClick={() => setInput(EXAMPLE)}>加载示例</Button>
          <Button variant="ghost" onClick={() => { setInput(''); setOutput(''); setError('') }}>清除</Button>
        </>
      }
    />
  )
}
