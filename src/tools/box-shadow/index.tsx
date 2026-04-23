'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { generateBoxShadowCSS, generateFullCSS, DEFAULT_SHADOW, type Shadow } from './logic'

let nextId = 2

export default function BoxShadowGenerator() {
  const [shadows, setShadows] = useState<Shadow[]>([{ ...DEFAULT_SHADOW }])
  const [selected, setSelected] = useState<string>('1')
  const [copied, setCopied] = useState(false)

  const current = shadows.find(s => s.id === selected) ?? shadows[0]
  const css = generateBoxShadowCSS(shadows)
  const fullCSS = generateFullCSS(shadows)

  const update = useCallback((field: keyof Shadow, value: Shadow[keyof Shadow]) => {
    setShadows(prev => prev.map(s => s.id === selected ? { ...s, [field]: value } : s))
  }, [selected])

  const addShadow = () => {
    const id = String(nextId++)
    const newShadow: Shadow = { ...DEFAULT_SHADOW, id }
    setShadows(prev => [...prev, newShadow])
    setSelected(id)
  }

  const removeShadow = (id: string) => {
    setShadows(prev => {
      const next = prev.filter(s => s.id !== id)
      if (selected === id && next.length > 0) setSelected(next[next.length - 1].id)
      return next
    })
  }

  const copy = async () => {
    await navigator.clipboard.writeText(fullCSS)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        {/* Preview */}
        <div className="flex h-40 items-center justify-center rounded-xl border bg-muted/30">
          <div
            className="h-20 w-32 rounded-lg bg-background"
            style={{ boxShadow: css }}
          />
        </div>

        {/* Shadow layers */}
        <div className="flex flex-wrap gap-2">
          {shadows.map(s => (
            <div key={s.id} className="flex items-center gap-1">
              <button
                onClick={() => setSelected(s.id)}
                className={`rounded-md px-3 py-1 text-sm border transition-colors ${selected === s.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:bg-muted'}`}
              >
                <span className="inline-block h-2 w-2 rounded-full mr-1.5" style={{ background: s.color, opacity: s.opacity / 100 }} />
                阴影 {s.id}
              </button>
              {shadows.length > 1 && (
                <button onClick={() => removeShadow(s.id)} className="text-muted-foreground hover:text-destructive text-xs px-1">×</button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addShadow}>+ 添加</Button>
        </div>

        {/* Controls */}
        {current && (
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              { label: '水平偏移', field: 'hOffset', min: -100, max: 100, unit: 'px' },
              { label: '垂直偏移', field: 'vOffset', min: -100, max: 100, unit: 'px' },
              { label: '模糊半径', field: 'blur',    min: 0,    max: 100, unit: 'px' },
              { label: '扩散半径', field: 'spread',  min: -50,  max: 50,  unit: 'px' },
              { label: '不透明度', field: 'opacity', min: 0,    max: 100, unit: '%'  },
            ] as { label: string; field: keyof Shadow; min: number; max: number; unit: string }[]).map(({ label, field, min, max, unit }) => (
              <div key={field} className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{label}</span>
                  <span className="font-mono">{current[field] as number}{unit}</span>
                </div>
                <input type="range" min={min} max={max} value={current[field] as number}
                  onChange={e => update(field, Number(e.target.value))} className="w-full" />
              </div>
            ))}

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">颜色</p>
              <input type="color" value={current.color} onChange={e => update('color', e.target.value)}
                className="h-9 w-full cursor-pointer rounded-md border bg-background" />
            </div>

            <div className="flex items-center gap-2 pt-4">
              <input type="checkbox" id="inset" checked={current.inset} onChange={e => update('inset', e.target.checked)} className="h-4 w-4" />
              <label htmlFor="inset" className="text-sm">内阴影 (inset)</label>
            </div>
          </div>
        )}

        {/* Output */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">CSS</p>
            <Button variant="ghost" size="sm" onClick={copy}>{copied ? '已复制！' : '复制'}</Button>
          </div>
          <pre className="rounded-md border bg-muted px-3 py-2 font-mono text-sm whitespace-pre-wrap break-all">{fullCSS}</pre>
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
