'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ToolLayout } from '@/components/tool-layout'
import { encode, decode } from './logic'

const EXAMPLE = 'Hello, World!'

export default function Base64Tool() {
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
            placeholder="Enter text or Base64..."
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
          <Button onClick={() => handle(encode)} disabled={!input}>Encode</Button>
          <Button variant="outline" onClick={() => handle(decode)} disabled={!input}>Decode</Button>
          <Button variant="outline" onClick={copyOutput} disabled={!output}>{copied ? 'Copied!' : 'Copy'}</Button>
          <Button variant="ghost" onClick={() => setInput(EXAMPLE)}>Load Example</Button>
          <Button variant="ghost" onClick={() => { setInput(''); setOutput(''); setError('') }}>Clear</Button>
        </>
      }
    />
  )
}
