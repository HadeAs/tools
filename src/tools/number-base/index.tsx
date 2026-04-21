'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { convertBase, type BaseResult } from './logic'

const bases = [
  { label: '二进制', base: 2, prefix: '0b' },
  { label: '八进制', base: 8, prefix: '0o' },
  { label: '十进制', base: 10, prefix: '' },
  { label: '十六进制', base: 16, prefix: '0x' },
]

const resultKeys: { key: keyof BaseResult; label: string }[] = [
  { key: 'binary', label: '二进制 (2)' },
  { key: 'octal', label: '八进制 (8)' },
  { key: 'decimal', label: '十进制 (10)' },
  { key: 'hex', label: '十六进制 (16)' },
]

export default function NumberBase() {
  const [input, setInput] = useState('')
  const [fromBase, setFromBase] = useState(10)
  const [result, setResult] = useState<BaseResult | null>(null)
  const [error, setError] = useState('')

  const convert = () => {
    try {
      setResult(convertBase(input, fromBase))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : '转换失败')
      setResult(null)
    }
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4 max-w-lg">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">输入进制</p>
          <div className="flex flex-wrap gap-2">
            {bases.map(({ label, base }) => (
              <Button key={base} variant={fromBase === base ? 'default' : 'outline'} size="sm" onClick={() => setFromBase(base)}>
                {label}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">数值</p>
          <p className="text-xs text-muted-foreground">支持负数，如 -255</p>
          <div className="flex gap-2">
            <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && convert()} placeholder={`输入${bases.find(b => b.base === fromBase)?.label}数值...`} className="font-mono" />
            <Button onClick={convert} disabled={!input}>转换</Button>
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {result && (
          <div className="space-y-2">
            {resultKeys.map(({ key, label }) => (
              <div key={key} className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                <code className="block rounded border bg-muted px-3 py-2 text-sm font-mono">{result[key]}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
