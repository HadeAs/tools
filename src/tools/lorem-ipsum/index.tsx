'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { generate } from './logic'

const TYPES = [
  { value: 'words',      label: '单词' },
  { value: 'sentences',  label: '句子' },
  { value: 'paragraphs', label: '段落' },
] as const
type Type = typeof TYPES[number]['value']

const COUNTS = [1, 3, 5, 10]

export default function LoremIpsum() {
  const [type, setType]     = useState<Type>('paragraphs')
  const [count, setCount]   = useState(3)
  const [lang, setLang]     = useState<'en' | 'zh'>('en')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const run = () => setOutput(generate(type, count, lang))

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="max-w-xl space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">类型</p>
            <div className="flex gap-1.5">
              {TYPES.map(t => (
                <button key={t.value} onClick={() => setType(t.value)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    type === t.value ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:border-primary/50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">数量</p>
            <div className="flex gap-1.5">
              {COUNTS.map(n => (
                <button key={n} onClick={() => setCount(n)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    count === n ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:border-primary/50'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">语言</p>
            <div className="flex gap-1.5">
              {(['en', 'zh'] as const).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    lang === l ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:border-primary/50'
                  }`}
                >
                  {l === 'en' ? 'English' : '中文'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={run} className="w-full">生成</Button>

        {output && (
          <div className="space-y-2">
            <Textarea readOnly value={output} className="min-h-[240px] text-sm leading-relaxed" />
            <Button variant="outline" onClick={copy}>{copied ? '已复制！' : '复制'}</Button>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
