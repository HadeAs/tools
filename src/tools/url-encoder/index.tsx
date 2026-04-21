'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ToolLayout } from '@/components/tool-layout'
import { encodeURL, decodeURL } from './logic'

const EXAMPLE = 'https://example.com/search?q=hello world&lang=en'

export default function URLEncoder() {
  const [input, setInput] = useState('')
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

  return (
    <ToolLayout
      input={
        <div className="space-y-2">
          <Textarea
            placeholder="Enter URL or encoded string..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      }
      output={
        <Textarea readOnly value={output} className="min-h-[200px] font-mono text-sm" placeholder="Output appears here..." />
      }
      actions={
        <>
          <Button onClick={() => handle(encodeURL)} disabled={!input}>Encode</Button>
          <Button variant="outline" onClick={() => handle(decodeURL)} disabled={!input}>Decode</Button>
          <Button variant="outline" onClick={copyOutput} disabled={!output}>{copied ? 'Copied!' : 'Copy'}</Button>
          <Button variant="ghost" onClick={() => setInput(EXAMPLE)}>Load Example</Button>
          <Button variant="ghost" onClick={() => { setInput(''); setOutput(''); setError('') }}>Clear</Button>
        </>
      }
    />
  )
}
