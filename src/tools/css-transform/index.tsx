'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { generateTransformCSS, generateFullCSS, DEFAULT_TRANSFORM, type TransformConfig } from './logic'

const SLIDERS: {
  label: string
  field: keyof TransformConfig
  min: number
  max: number
  step: number
  unit: string
}[] = [
  { label: '水平位移 (translateX)', field: 'translateX', min: -200, max: 200, step: 1,   unit: 'px'  },
  { label: '垂直位移 (translateY)', field: 'translateY', min: -200, max: 200, step: 1,   unit: 'px'  },
  { label: '旋转 (rotate)',         field: 'rotate',     min: -180, max: 180, step: 1,   unit: 'deg' },
  { label: 'X 缩放 (scaleX)',       field: 'scaleX',     min: 0,    max: 4,   step: 0.1, unit: 'x'   },
  { label: 'Y 缩放 (scaleY)',       field: 'scaleY',     min: 0,    max: 4,   step: 0.1, unit: 'x'   },
  { label: 'X 倾斜 (skewX)',        field: 'skewX',      min: -60,  max: 60,  step: 1,   unit: 'deg' },
  { label: 'Y 倾斜 (skewY)',        field: 'skewY',      min: -60,  max: 60,  step: 1,   unit: 'deg' },
]

export default function CssTransformTool() {
  const [config, setConfig] = useState<TransformConfig>({ ...DEFAULT_TRANSFORM })
  const [copied, setCopied] = useState(false)

  const css = generateTransformCSS(config)
  const fullCSS = generateFullCSS(config)

  const update = (field: keyof TransformConfig, value: number) => {
    setConfig(c => ({ ...c, [field]: value }))
  }

  const reset = () => setConfig({ ...DEFAULT_TRANSFORM })

  const copy = async () => {
    await navigator.clipboard.writeText(fullCSS)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        {/* Preview */}
        <div className="flex h-48 items-center justify-center rounded-xl border bg-[size:20px_20px] bg-muted/30"
          style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--muted-foreground)/0.2) 1px, transparent 1px)' }}>
          <div
            className="h-20 w-28 rounded-lg bg-primary/60 border border-primary flex items-center justify-center text-xs font-medium text-primary-foreground transition-all duration-200"
            style={{ transform: css === 'none' ? undefined : css }}
          >
            预览
          </div>
        </div>

        {/* Sliders */}
        <div className="grid gap-3 sm:grid-cols-2">
          {SLIDERS.map(({ label, field, min, max, step, unit }) => (
            <div key={field} className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="truncate">{label}</span>
                <span className="font-mono shrink-0 ml-2">{config[field]}{unit}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={config[field]}
                onChange={e => update(field, Number(e.target.value))} className="w-full" />
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={reset}>重置</Button>

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
