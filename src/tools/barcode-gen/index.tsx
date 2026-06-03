'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import {
  FORMAT_LIST,
  defaultOptions,
  validateInput,
  type Options,
  type BarcodeFormat,
} from './logic'

export default function BarcodeGen() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [input, setInput] = usePersistedState('tool:barcode-gen:input', 'Hello, World!')
  const [opts, setOpts] = usePersistedState<Options>('tool:barcode-gen:opts', defaultOptions)
  const [error, setError] = useState('')
  const [downloaded, setDownloaded] = useState(false)

  const currentFormat = FORMAT_LIST.find(f => f.value === opts.format)!

  const renderBarcode = useCallback(async () => {
    const validationError = validateInput(input, opts.format)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const JsBarcode = (await import('jsbarcode')).default
      if (!svgRef.current) return
      JsBarcode(svgRef.current, input.trim(), {
        format: opts.format,
        lineColor: opts.lineColor,
        background: opts.background,
        width: opts.width,
        height: opts.height,
        displayValue: opts.displayValue,
        fontSize: opts.fontSize,
        margin: opts.margin,
        valid: (valid: boolean) => {
          if (!valid) setError('条码内容不符合格式要求')
        },
      })
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成失败')
    }
  }, [input, opts])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    renderBarcode()
  }, [renderBarcode])

  const downloadSvg = () => {
    if (!svgRef.current) return
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svgRef.current)
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `barcode-${opts.format.toLowerCase()}.svg`
    a.click()
    URL.revokeObjectURL(url)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 1500)
  }

  const downloadPng = () => {
    if (!svgRef.current) return
    const svg = svgRef.current
    const canvas = document.createElement('canvas')
    const scale = 2 // Retina
    canvas.width = svg.clientWidth * scale
    canvas.height = svg.clientHeight * scale
    const ctx = canvas.getContext('2d')!
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const img = new Image()
    img.onload = () => {
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0)
      const a = document.createElement('a')
      a.download = `barcode-${opts.format.toLowerCase()}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    const encoded = new TextEncoder().encode(svgStr)
    const binary = Array.from(encoded).map(b => String.fromCharCode(b)).join('')
    img.src = 'data:image/svg+xml;base64,' + btoa(binary)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-5">
        {/* 格式选择 */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">条码格式</p>
          <div className="flex flex-wrap gap-1.5">
            {FORMAT_LIST.map(f => (
              <Button
                key={f.value}
                size="sm"
                variant={opts.format === f.value ? 'default' : 'outline'}
                className="h-7 px-2.5 text-xs"
                onClick={() => setOpts({ ...opts, format: f.value as BarcodeFormat })}
              >
                {f.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{currentFormat.hint}</p>
        </div>

        {/* 输入 */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            条码内容
          </label>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={currentFormat.placeholder}
            spellCheck={false}
            className="h-9 w-full rounded-md border bg-background px-3 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>

        {/* 样式选项 */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">条码颜色</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={opts.lineColor}
                onChange={e => setOpts({ ...opts, lineColor: e.target.value })}
                className="h-8 w-10 cursor-pointer rounded border p-0.5"
              />
              <span className="font-mono text-xs">{opts.lineColor}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">背景颜色</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={opts.background}
                onChange={e => setOpts({ ...opts, background: e.target.value })}
                className="h-8 w-10 cursor-pointer rounded border p-0.5"
              />
              <span className="font-mono text-xs">{opts.background}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">高度 ({opts.height}px)</label>
            <input
              type="range" min={30} max={200} value={opts.height}
              onChange={e => setOpts({ ...opts, height: Number(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">宽度倍率 ({opts.width}×)</label>
            <input
              type="range" min={1} max={4} step={0.5} value={opts.width}
              onChange={e => setOpts({ ...opts, width: Number(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">边距 ({opts.margin}px)</label>
            <input
              type="range" min={0} max={30} value={opts.margin}
              onChange={e => setOpts({ ...opts, margin: Number(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">字体大小 ({opts.fontSize}px)</label>
            <input
              type="range" min={8} max={24} value={opts.fontSize}
              onChange={e => setOpts({ ...opts, fontSize: Number(e.target.value) })}
              className="w-full accent-primary"
              disabled={!opts.displayValue}
            />
          </div>

          <div className="flex items-end pb-1">
            <label className="flex cursor-pointer items-center gap-1.5 text-xs select-none">
              <input
                type="checkbox"
                checked={opts.displayValue}
                onChange={() => setOpts({ ...opts, displayValue: !opts.displayValue })}
                className="accent-primary"
              />
              显示文字
            </label>
          </div>
        </div>

        {/* 预览 */}
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">预览</p>
          <div
            className="flex min-h-32 items-center justify-center rounded-lg border p-4"
            style={{ background: error ? undefined : opts.background }}
          >
            {error ? (
              <p className="text-sm text-muted-foreground">输入有效内容后将显示条码</p>
            ) : (
              <svg ref={svgRef} />
            )}
          </div>

          {!error && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={downloadSvg}>
                {downloaded ? '已下载！' : '下载 SVG'}
              </Button>
              <Button variant="outline" size="sm" onClick={downloadPng}>
                下载 PNG
              </Button>
            </div>
          )}
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
