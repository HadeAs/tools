'use client'

import { useState, useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ToolLayout } from '@/components/tool-layout'
import { encodeEntities, decodeEntities } from './logic'

const EXAMPLE = '<div class="hello">it\'s a <b>test</b> & more</div>'

export default function HtmlEntities() {
  const [input, setInput] = usePersistedState('tool:html-entities:input', '')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' }
    try {
      return { output: mode === 'encode' ? encodeEntities(input) : decodeEntities(input), error: '' }
    } catch (e) {
      return { output: '', error: (e as Error).message }
    }
  }, [input, mode])

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
            placeholder="输入文本或 HTML 实体..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      }
      output={
        <Textarea readOnly value={output} className="min-h-[200px] font-mono text-sm" placeholder="结果显示在此..." />
      }
      actions={
        <>
          <Button variant={mode === 'encode' ? 'default' : 'outline'} onClick={() => setMode('encode')}>编码</Button>
          <Button variant={mode === 'decode' ? 'default' : 'outline'} onClick={() => setMode('decode')}>解码</Button>
          <Button variant="outline" onClick={copy} disabled={!output}>{copied ? '已复制！' : '复制'}</Button>
          <Button variant="ghost" onClick={() => setInput(EXAMPLE)}>加载示例</Button>
          <Button variant="ghost" onClick={() => setInput('')}>清除</Button>
        </>
      }
    />
  )
}
