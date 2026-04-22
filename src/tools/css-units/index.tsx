'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { convertAll, UNITS, fmt, type CssUnit } from './logic'

export default function CssUnits() {
  const [value, setValue] = useState('16')
  const [from, setFrom] = useState<CssUnit>('px')
  const [baseFontSize, setBaseFontSize] = useState('16')
  const [viewportW, setViewportW] = useState('1440')
  const [viewportH, setViewportH] = useState('900')

  const results = useMemo(() => {
    const n = parseFloat(value)
    if (isNaN(n)) return null
    try {
      return convertAll({
        value: n, from,
        baseFontSize: parseFloat(baseFontSize) || 16,
        viewportW: parseFloat(viewportW) || 1440,
        viewportH: parseFloat(viewportH) || 900,
      })
    } catch { return null }
  }, [value, from, baseFontSize, viewportW, viewportH])

  return (
    <ToolErrorBoundary>
      <div className="max-w-xl space-y-5">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">输入值</p>
          <div className="flex gap-2">
            <Input value={value} onChange={e => setValue(e.target.value)} className="font-mono" placeholder="16" />
            <div className="flex flex-wrap gap-1.5">
              {UNITS.map(u => (
                <button key={u} onClick={() => setFrom(u)}
                  className={`rounded-md border px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
                    from === u ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:border-primary/50'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        <details className="group">
          <summary className="cursor-pointer list-none text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground">
            基准设置 <span className="font-normal normal-case">(根字号 / 视口)</span>
          </summary>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[
              { label: '根字号 (px)', value: baseFontSize, set: setBaseFontSize },
              { label: '视口宽 (px)', value: viewportW, set: setViewportW },
              { label: '视口高 (px)', value: viewportH, set: setViewportH },
            ].map(({ label, value, set }) => (
              <div key={label} className="space-y-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <Input value={value} onChange={e => set(e.target.value)} className="font-mono text-sm" />
              </div>
            ))}
          </div>
        </details>

        {results && (
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">换算结果</p>
            <div className="divide-y rounded-lg border">
              {UNITS.map(u => (
                <div key={u} className={`flex items-center justify-between px-4 py-2.5 ${u === from ? 'bg-primary/5' : ''}`}>
                  <code className="font-mono text-sm font-medium">{u}</code>
                  <code className="font-mono text-sm">{fmt(results[u])}<span className="ml-0.5 text-muted-foreground">{u}</span></code>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
