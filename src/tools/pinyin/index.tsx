'use client'

import { useMemo, useState } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { convertToPinyin, convertToArray, type ToneType } from './logic'

const TONE_OPTIONS: { value: ToneType; label: string; example: string }[] = [
  { value: 'symbol', label: '声调符号', example: 'zhōng wén' },
  { value: 'num',    label: '数字声调', example: 'zhong1 wen2' },
  { value: 'none',   label: '无声调',   example: 'zhong wen' },
]

export default function PinyinTool() {
  const [input, setInput] = usePersistedState('tool:pinyin:input', '')
  const [toneType, setToneType] = useState<ToneType>('symbol')
  const [showSplit, setShowSplit] = useState(false)
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    if (!input.trim()) return ''
    return convertToPinyin(input, toneType)
  }, [input, toneType])

  const chars = useMemo(() => {
    if (!input.trim() || !showSplit) return []
    return convertToArray(input, toneType)
  }, [input, toneType, showSplit])

  const copy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {TONE_OPTIONS.map(o => (
            <Button key={o.value} size="sm" variant={toneType === o.value ? 'default' : 'outline'}
              onClick={() => setToneType(o.value)}>
              {o.label}
              <span className="ml-1.5 text-xs opacity-60">{o.example}</span>
            </Button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">汉字输入</p>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="在此输入汉字..."
              className="h-40 w-full rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">拼音结果</p>
              {result && <Button variant="ghost" size="sm" onClick={copy}>{copied ? '已复制！' : '复制'}</Button>}
            </div>
            <div className="h-40 overflow-auto rounded-md border bg-muted px-3 py-2 text-sm leading-relaxed break-all">
              {result || <span className="text-muted-foreground">结果显示在这里</span>}
            </div>
          </div>
        </div>

        {result && (
          <div className="space-y-2">
            <button
              onClick={() => setShowSplit(s => !s)}
              className="text-xs text-primary hover:underline"
            >
              {showSplit ? '隐藏' : '显示'} 逐字对照
            </button>
            {showSplit && chars.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {input.split('').map((char, i) => (
                  <div key={i} className="flex flex-col items-center rounded-md border bg-muted px-2 py-1 min-w-[2.5rem]">
                    <span className="text-[10px] text-muted-foreground font-mono">{chars[i] || char}</span>
                    <span className="text-base">{char}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
