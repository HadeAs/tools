'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import {
  generateClipPathCSS, generateFullCSS, POLYGON_PRESETS, DEFAULT_SHAPES,
  type ClipShape, type ClipShapeType,
} from './logic'

const SHAPE_TABS: { key: ClipShapeType; label: string }[] = [
  { key: 'circle',  label: '圆形' },
  { key: 'ellipse', label: '椭圆' },
  { key: 'inset',   label: '内嵌' },
  { key: 'polygon', label: '多边形' },
]

export default function ClipPathGenerator() {
  const [shapeType, setShapeType] = useState<ClipShapeType>('circle')
  const [shapes, setShapes] = useState<Record<ClipShapeType, ClipShape>>({ ...DEFAULT_SHAPES })
  const [copied, setCopied] = useState(false)

  const shape = shapes[shapeType]
  const clipCSS = generateClipPathCSS(shape)
  const fullCSS = generateFullCSS(shape)

  const update = (patch: Partial<ClipShape>) => {
    setShapes(prev => ({ ...prev, [shapeType]: { ...prev[shapeType], ...patch } as ClipShape }))
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
            className="h-32 w-32 bg-primary/60 transition-all duration-300"
            style={{ clipPath: clipCSS }}
          />
        </div>

        {/* Shape tabs */}
        <div className="flex gap-2 flex-wrap">
          {SHAPE_TABS.map(({ key, label }) => (
            <Button key={key} size="sm" variant={shapeType === key ? 'default' : 'outline'}
              onClick={() => setShapeType(key)}>
              {label}
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="grid gap-3 sm:grid-cols-2">
          {shape.type === 'circle' && ([
            { label: '半径', field: 'radius', min: 0, max: 100, unit: '%' },
            { label: '中心 X', field: 'cx', min: 0, max: 100, unit: '%' },
            { label: '中心 Y', field: 'cy', min: 0, max: 100, unit: '%' },
          ] as { label: string; field: 'radius' | 'cx' | 'cy'; min: number; max: number; unit: string }[]).map(({ label, field, min, max, unit }) => (
            <div key={field} className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{label}</span><span className="font-mono">{(shape as typeof shape & Record<string, number>)[field]}{unit}</span>
              </div>
              <input type="range" min={min} max={max} value={(shape as typeof shape & Record<string, number>)[field]}
                onChange={e => update({ [field]: Number(e.target.value) })} className="w-full" />
            </div>
          ))}

          {shape.type === 'ellipse' && ([
            { label: 'X 半径', field: 'rx', min: 0, max: 100, unit: '%' },
            { label: 'Y 半径', field: 'ry', min: 0, max: 100, unit: '%' },
            { label: '中心 X', field: 'cx', min: 0, max: 100, unit: '%' },
            { label: '中心 Y', field: 'cy', min: 0, max: 100, unit: '%' },
          ] as { label: string; field: 'rx' | 'ry' | 'cx' | 'cy'; min: number; max: number; unit: string }[]).map(({ label, field, min, max, unit }) => (
            <div key={field} className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{label}</span><span className="font-mono">{(shape as typeof shape & Record<string, number>)[field]}{unit}</span>
              </div>
              <input type="range" min={min} max={max} value={(shape as typeof shape & Record<string, number>)[field]}
                onChange={e => update({ [field]: Number(e.target.value) })} className="w-full" />
            </div>
          ))}

          {shape.type === 'inset' && ([
            { label: '上', field: 'top',    min: 0, max: 50 },
            { label: '右', field: 'right',  min: 0, max: 50 },
            { label: '下', field: 'bottom', min: 0, max: 50 },
            { label: '左', field: 'left',   min: 0, max: 50 },
            { label: '圆角', field: 'radius', min: 0, max: 100 },
          ] as { label: string; field: 'top' | 'right' | 'bottom' | 'left' | 'radius'; min: number; max: number }[]).map(({ label, field, min, max }) => (
            <div key={field} className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{label}</span>
                <span className="font-mono">{(shape as typeof shape & Record<string, number>)[field]}{field === 'radius' ? 'px' : '%'}</span>
              </div>
              <input type="range" min={min} max={max} value={(shape as typeof shape & Record<string, number>)[field]}
                onChange={e => update({ [field]: Number(e.target.value) })} className="w-full" />
            </div>
          ))}

          {shape.type === 'polygon' && (
            <div className="col-span-2 space-y-3">
              <div className="flex flex-wrap gap-2">
                {Object.entries(POLYGON_PRESETS).map(([key, { label }]) => (
                  <Button key={key} size="sm"
                    variant={(shape as typeof shape & { preset: string }).preset === key ? 'default' : 'outline'}
                    onClick={() => update({ preset: key, custom: key === 'custom' ? (shape as typeof shape & { custom: string }).custom : POLYGON_PRESETS[key].points })}>
                    {label}
                  </Button>
                ))}
              </div>
              {(shape as typeof shape & { preset: string }).preset === 'custom' && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">自定义顶点（格式：x% y%, x% y%, ...）</p>
                  <textarea
                    value={(shape as typeof shape & { custom: string }).custom}
                    onChange={e => update({ custom: e.target.value })}
                    className="h-20 w-full rounded-md border bg-background px-3 py-2 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="50% 0%, 100% 100%, 0% 100%"
                  />
                </div>
              )}
            </div>
          )}
        </div>

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
