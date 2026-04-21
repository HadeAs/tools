'use client'

import { useState } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { parseColor, type ColorResult } from './logic'

export default function ColorConverter() {
  const [input, setInput] = usePersistedState('tool:color-converter:input', '')
  const [error, setError] = useState('')
  const [result, setResult] = useState<ColorResult | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const convert = (value = input) => {
    try {
      setResult(parseColor(value))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : '无效颜色')
      setResult(null)
    }
  }

  const onPickerChange = (hex: string) => {
    setInput(hex)
    convert(hex)
  }

  const copy = async (val: string) => {
    await navigator.clipboard.writeText(val)
    setCopied(val)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">颜色值</p>
          <p className="text-xs text-muted-foreground">支持 #rrggbb、rgb(r,g,b)、hsl(h,s,l)，或直接用取色器选色</p>
          <div className="flex gap-2">
            <label
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border overflow-hidden"
              title="取色器"
            >
              <input
                type="color"
                className="h-full w-full cursor-pointer border-none p-0 opacity-0 absolute"
                value={result?.hex ?? '#ffffff'}
                onChange={e => onPickerChange(e.target.value)}
              />
              <div
                className="h-full w-full"
                style={{ backgroundColor: result?.hex ?? '#ffffff' }}
              />
            </label>
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && convert()}
              placeholder="#ff0000 / rgb(255,0,0) / hsl(0,100,50)"
              className="font-mono text-sm"
            />
            <Button onClick={() => convert()} disabled={!input}>转换</Button>
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {result && (
          <div className="space-y-3">
            <div className="rounded border overflow-hidden" style={{ height: 80, backgroundColor: result.hex }} />
            {[['HEX', result.hex], ['RGB', result.rgb], ['HSL', result.hsl]].map(([label, val]) => (
              <div key={label} className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                <div className="flex gap-2">
                  <code className="flex-1 rounded border bg-muted px-3 py-2 text-sm font-mono">{val}</code>
                  <Button variant="outline" size="sm" onClick={() => copy(val)}>{copied === val ? '已复制！' : '复制'}</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
