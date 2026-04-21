'use client'

import { useState, useMemo } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { countStats } from './logic'

export default function WordCounter() {
  const [text, setText] = useState('')
  const stats = useMemo(() => countStats(text), [text])

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <Textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="在此粘贴或输入文本..."
          className="min-h-[300px] text-sm"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: '单词', value: stats.words },
            { label: '字符', value: stats.chars },
            { label: '非空格', value: stats.charsNoSpaces },
            { label: '行数', value: stats.lines },
            { label: '句子', value: stats.sentences },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border bg-card p-3 text-center">
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
