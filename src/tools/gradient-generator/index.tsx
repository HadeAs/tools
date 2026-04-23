'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { generateCSS, generateFullCSS, DEFAULT_CONFIG, type GradientConfig, type GradientType, type ColorStop } from './logic'

let nextId = 3

export default function GradientGenerator() {
  const [config, setConfig] = useState<GradientConfig>(() => ({
    ...DEFAULT_CONFIG,
    stops: DEFAULT_CONFIG.stops.map(s => ({ ...s })),
  }))
  const [copied, setCopied] = useState(false)

  const css = generateCSS(config)
  const fullCSS = generateFullCSS(config)

  const updateStop = useCallback((id: string, field: keyof ColorStop, value: string | number) => {
    setConfig(c => ({ ...c, stops: c.stops.map(s => s.id === id ? { ...s, [field]: value } : s) }))
  }, [])

  const addStop = useCallback(() => {
    const id = String(nextId++)
    setConfig(c => ({ ...c, stops: [...c.stops, { id, color: '#ffffff', position: 50 }] }))
  }, [])

  const removeStop = useCallback((id: string) => {
    setConfig(c => ({ ...c, stops: c.stops.filter(s => s.id !== id) }))
  }, [])

  const copy = async () => {
    await navigator.clipboard.writeText(fullCSS)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        {/* Preview */}
        <div
          className="h-32 w-full rounded-xl border"
          style={{ background: css }}
        />

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-start">
          {/* Type */}
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">类型</p>
            <div className="flex gap-1">
              {(['linear', 'radial', 'conic'] as GradientType[]).map(t => (
                <Button
                  key={t}
                  variant={config.type === t ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setConfig(c => ({ ...c, type: t }))}
                >
                  {t === 'linear' ? '线性' : t === 'radial' ? '径向' : '锥形'}
                </Button>
              ))}
            </div>
          </div>

          {/* Angle */}
          {config.type !== 'radial' && (
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                角度: {config.angle}°
              </p>
              <input
                type="range"
                min={0}
                max={360}
                value={config.angle}
                onChange={e => setConfig(c => ({ ...c, angle: Number(e.target.value) }))}
                className="w-32"
              />
            </div>
          )}
        </div>

        {/* Color Stops */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">色标</p>
            <Button variant="outline" size="sm" onClick={addStop}>+ 添加</Button>
          </div>
          <div className="space-y-2">
            {config.stops.map(stop => (
              <div key={stop.id} className="flex items-center gap-3">
                <input
                  type="color"
                  value={stop.color}
                  onChange={e => updateStop(stop.id, 'color', e.target.value)}
                  className="h-8 w-12 cursor-pointer rounded border bg-background"
                />
                <span className="font-mono text-sm w-20">{stop.color}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={stop.position}
                  onChange={e => updateStop(stop.id, 'position', Number(e.target.value))}
                  className="flex-1"
                />
                <span className="font-mono text-sm w-10 text-right">{stop.position}%</span>
                {config.stops.length > 2 && (
                  <Button variant="ghost" size="sm" onClick={() => removeStop(stop.id)} className="text-destructive hover:text-destructive">
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">CSS</p>
            <Button variant="ghost" size="sm" onClick={copy}>{copied ? '已复制！' : '复制'}</Button>
          </div>
          <pre className="rounded-md border bg-muted px-3 py-2 font-mono text-sm whitespace-pre-wrap break-all">
            {fullCSS}
          </pre>
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
