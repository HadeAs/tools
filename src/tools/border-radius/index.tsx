'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { generateBorderRadiusCSS, generateFullCSS, DEFAULT_CONFIG, type RadiusConfig, type RadiusUnit } from './logic'

type Corner = 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft'
const CORNERS: { key: Corner; label: string }[] = [
  { key: 'topLeft',     label: '左上' },
  { key: 'topRight',    label: '右上' },
  { key: 'bottomRight', label: '右下' },
  { key: 'bottomLeft',  label: '左下' },
]

export default function BorderRadiusGenerator() {
  const [config, setConfig] = useState<RadiusConfig>({ ...DEFAULT_CONFIG })
  const [linked, setLinked] = useState(true)
  const [copied, setCopied] = useState(false)

  const radius = generateBorderRadiusCSS(config)
  const fullCSS = generateFullCSS(config)
  const max = config.unit === '%' ? 50 : 200

  const updateCorner = (corner: Corner, value: number) => {
    if (linked) {
      setConfig(c => ({ ...c, topLeft: value, topRight: value, bottomRight: value, bottomLeft: value }))
    } else {
      setConfig(c => ({ ...c, [corner]: value }))
    }
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
        <div className="flex h-48 items-center justify-center rounded-xl border bg-muted/30">
          <div
            className="h-28 w-44 bg-primary/20 border-2 border-primary/40 transition-all duration-200"
            style={{ borderRadius: radius }}
          />
        </div>

        {/* Unit + Link toggle */}
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {(['px', '%'] as RadiusUnit[]).map(u => (
              <Button key={u} size="sm" variant={config.unit === u ? 'default' : 'outline'}
                onClick={() => setConfig(c => ({ ...c, unit: u, topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 }))}>
                {u}
              </Button>
            ))}
          </div>
          <button
            onClick={() => setLinked(l => !l)}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border transition-colors ${linked ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border'}`}
          >
            {linked ? '🔗 联动' : '🔓 独立'}
          </button>
        </div>

        {/* Corner sliders */}
        <div className="grid gap-3 sm:grid-cols-2">
          {CORNERS.map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{label}</span>
                <span className="font-mono">{config[key]}{config.unit}</span>
              </div>
              <input type="range" min={0} max={max} value={config[key]}
                onChange={e => updateCorner(key, Number(e.target.value))} className="w-full" />
            </div>
          ))}
        </div>

        {/* Output */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">CSS</p>
            <Button variant="ghost" size="sm" onClick={copy}>{copied ? '已复制！' : '复制'}</Button>
          </div>
          <pre className="rounded-md border bg-muted px-3 py-2 font-mono text-sm">{fullCSS}</pre>
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
