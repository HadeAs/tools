'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { md5Hash, sha1Hash, sha256Hash } from './logic'

const algorithms = ['MD5', 'SHA-1', 'SHA-256'] as const
type Algorithm = typeof algorithms[number]

export default function HashGenerator() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<Record<Algorithm, string>>({ MD5: '', 'SHA-1': '', 'SHA-256': '' })
  const [copied, setCopied] = useState<Algorithm | null>(null)

  const generate = async () => {
    const [md5, sha1, sha256] = await Promise.all([
      md5Hash(input),
      sha1Hash(input),
      sha256Hash(input),
    ])
    setResults({ MD5: md5, 'SHA-1': sha1, 'SHA-256': sha256 })
  }

  const copy = async (algo: Algorithm) => {
    await navigator.clipboard.writeText(results[algo])
    setCopied(algo)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Input</p>
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="输入要哈希的文本..." className="min-h-[120px] font-mono text-sm" />
        </div>
        <Button onClick={generate} disabled={!input}>生成哈希</Button>
        {algorithms.some(a => results[a]) && (
          <div className="space-y-3">
            {algorithms.map(algo => results[algo] && (
              <div key={algo} className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{algo}</p>
                <div className="flex gap-2">
                  <code className="flex-1 rounded border bg-muted px-3 py-2 text-xs font-mono break-all">{results[algo]}</code>
                  <Button variant="outline" size="sm" onClick={() => copy(algo)}>{copied === algo ? '已复制！' : '复制'}</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
