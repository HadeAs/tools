'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import {
  createTextLayer, drawStroke, drawTextLayer, getTextBounds,
  type TextLayer, type DrawStroke, type Point,
} from './logic'

type Mode = 'select' | 'draw'

let uid = 1
const nextId = () => String(uid++)

const FONTS = [
  { value: 'sans-serif',          label: '无衬线体' },
  { value: 'serif',               label: '衬线体' },
  { value: 'monospace',           label: '等宽体' },
  { value: 'Impact, sans-serif',  label: 'Impact' },
  { value: 'Georgia, serif',      label: 'Georgia' },
]

function getCanvasPoint(e: React.MouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement): Point {
  const rect = canvas.getBoundingClientRect()
  return {
    x: (e.clientX - rect.left) * (canvas.width / rect.width),
    y: (e.clientY - rect.top)  * (canvas.height / rect.height),
  }
}

export default function ImageEditor() {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const snapshotRef = useRef<ImageData | null>(null)
  const strokePtsRef = useRef<Point[]>([])

  const [image,      setImage]      = useState<HTMLImageElement | null>(null)
  const [textLayers, setTextLayers] = useState<TextLayer[]>([])
  const [strokes,    setStrokes]    = useState<DrawStroke[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mode,       setMode]       = useState<Mode>('select')
  const [isDrawing,  setIsDrawing]  = useState(false)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null)
  const [dragOver,   setDragOver]   = useState(false)
  const [dlFormat,   setDlFormat]   = useState<'png' | 'jpeg'>('png')

  const [brushColor,   setBrushColor]   = useState('#e11d48')
  const [brushSize,    setBrushSize]    = useState(4)
  const [brushOpacity, setBrushOpacity] = useState(100)

  const selectedLayer = textLayers.find(l => l.id === selectedId) ?? null

  // ── render ──────────────────────────────────────────────────────────────
  const render = useCallback((liveStroke?: DrawStroke) => {
    const canvas = canvasRef.current
    if (!canvas || !image) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0)
    strokes.forEach(s => drawStroke(ctx, s))
    if (liveStroke) drawStroke(ctx, liveStroke)
    textLayers.forEach(l => drawTextLayer(ctx, l, canvas.width, canvas.height))

    if (selectedId) {
      const sel = textLayers.find(l => l.id === selectedId)
      if (sel) {
        const b = getTextBounds(ctx, sel, canvas.width, canvas.height)
        ctx.save()
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = Math.max(2, canvas.width / 600)
        ctx.setLineDash([8, 4])
        ctx.strokeRect(b.x - 2, b.y - 2, b.width + 4, b.height + 4)
        ctx.restore()
      }
    }
  }, [image, strokes, textLayers, selectedId])

  useEffect(() => { render() }, [render])

  // ── image load ───────────────────────────────────────────────────────────
  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setImage(img)
      setTextLayers([])
      setStrokes([])
      setSelectedId(null)
      const canvas = canvasRef.current
      if (canvas) { canvas.width = img.naturalWidth; canvas.height = img.naturalHeight }
      URL.revokeObjectURL(url)
    }
    img.src = url
  }, [])

  // ── mouse events ──────────────────────────────────────────────────────────
  const onMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const pt = getCanvasPoint(e, canvas)

    if (mode === 'draw') {
      setIsDrawing(true)
      strokePtsRef.current = [pt]
      const ctx = canvas.getContext('2d')!
      snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height)
    } else {
      // hit-test layers in reverse (top-most first)
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const hit = [...textLayers].reverse().find(layer => {
        const b = getTextBounds(ctx, layer, canvas.width, canvas.height)
        return pt.x >= b.x && pt.x <= b.x + b.width && pt.y >= b.y && pt.y <= b.y + b.height
      })
      if (hit) {
        setSelectedId(hit.id)
        setDragOffset({
          x: pt.x / canvas.width  * 100 - hit.x,
          y: pt.y / canvas.height * 100 - hit.y,
        })
      } else {
        setSelectedId(null)
        setDragOffset(null)
      }
    }
  }, [mode, textLayers])

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const pt = getCanvasPoint(e, canvas)

    if (mode === 'draw' && isDrawing) {
      strokePtsRef.current = [...strokePtsRef.current, pt]
      const ctx = canvas.getContext('2d')!
      if (snapshotRef.current) ctx.putImageData(snapshotRef.current, 0, 0)
      drawStroke(ctx, { id: 'live', points: strokePtsRef.current, color: brushColor, size: brushSize, opacity: brushOpacity })
    } else if (mode === 'select' && dragOffset && selectedId) {
      const nx = pt.x / canvas.width  * 100 - dragOffset.x
      const ny = pt.y / canvas.height * 100 - dragOffset.y
      setTextLayers(prev => prev.map(l => l.id === selectedId ? { ...l, x: nx, y: ny } : l))
    }
  }, [mode, isDrawing, dragOffset, selectedId, brushColor, brushSize, brushOpacity])

  const onMouseUp = useCallback(() => {
    if (mode === 'draw' && isDrawing && strokePtsRef.current.length > 0) {
      setStrokes(prev => [...prev, {
        id: nextId(),
        points: strokePtsRef.current,
        color: brushColor,
        size: brushSize,
        opacity: brushOpacity,
      }])
      strokePtsRef.current = []
      snapshotRef.current = null
    }
    setIsDrawing(false)
    setDragOffset(null)
  }, [mode, isDrawing, brushColor, brushSize, brushOpacity])

  // ── layer ops ─────────────────────────────────────────────────────────────
  const addTextLayer = () => {
    const layer = createTextLayer(nextId())
    setTextLayers(prev => [...prev, layer])
    setSelectedId(layer.id)
    setMode('select')
  }

  const updateLayer = (id: string, patch: Partial<TextLayer>) =>
    setTextLayers(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l))

  const removeLayer = (id: string) => {
    setTextLayers(prev => prev.filter(l => l.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const undoStroke = () => setStrokes(prev => prev.slice(0, -1))
  const clearStrokes = () => setStrokes([])

  // ── download ─────────────────────────────────────────────────────────────
  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.download = dlFormat === 'png' ? 'edited.png' : 'edited.jpg'
    a.href = canvas.toDataURL(dlFormat === 'png' ? 'image/png' : 'image/jpeg', 0.92)
    a.click()
  }

  // ── empty state ───────────────────────────────────────────────────────────
  if (!image) {
    return (
      <ToolErrorBoundary>
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) loadFile(f) }}
          onClick={() => document.getElementById('img-upload-input')?.click()}
          className={`flex h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors select-none
            ${dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-muted-foreground/50'}`}
        >
          <div className="text-4xl">🖼️</div>
          <p className="text-sm font-medium">拖拽图片到此，或点击上传</p>
          <p className="text-xs text-muted-foreground">支持 JPG、PNG、WebP、GIF</p>
          <input id="img-upload-input" type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f) }} />
        </div>
      </ToolErrorBoundary>
    )
  }

  // ── editor ────────────────────────────────────────────────────────────────
  return (
    <ToolErrorBoundary>
      <div className="space-y-3">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant={mode === 'select' ? 'default' : 'outline'} onClick={() => setMode('select')}>
            ↖ 选择 / 移动
          </Button>
          <Button size="sm" variant={mode === 'draw' ? 'default' : 'outline'} onClick={() => setMode('draw')}>
            ✏️ 手写
          </Button>
          <Button size="sm" variant="outline" onClick={addTextLayer}>
            T 添加文字
          </Button>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => { setImage(null) }}>重新上传</Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          {/* Canvas */}
          <div className="overflow-hidden rounded-lg border"
            style={{ background: 'repeating-conic-gradient(#e5e7eb 0% 25%, #f9fafb 0% 50%) 0 0 / 16px 16px' }}>
            <canvas
              ref={canvasRef}
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                cursor: mode === 'draw' ? 'crosshair' : dragOffset ? 'grabbing' : 'default',
                touchAction: 'none',
              }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            />
          </div>

          {/* Side panel */}
          <div className="space-y-3">

            {/* Draw controls */}
            {mode === 'draw' && (
              <div className="space-y-3 rounded-lg border p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">手写设置</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>笔刷大小</span><span className="font-mono">{brushSize}px</span>
                  </div>
                  <input type="range" min={1} max={80} value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} className="w-full" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>不透明度</span><span className="font-mono">{brushOpacity}%</span>
                  </div>
                  <input type="range" min={10} max={100} value={brushOpacity} onChange={e => setBrushOpacity(Number(e.target.value))} className="w-full" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="color" value={brushColor} onChange={e => setBrushColor(e.target.value)}
                    className="h-8 w-14 cursor-pointer rounded border bg-background" />
                  <span className="font-mono text-xs text-muted-foreground">{brushColor}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={undoStroke} disabled={strokes.length === 0}>撤销</Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={clearStrokes} disabled={strokes.length === 0}>清空笔画</Button>
                </div>
              </div>
            )}

            {/* Text layer list */}
            {textLayers.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">文字图层</p>
                {textLayers.map((layer, i) => (
                  <div key={layer.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors
                      ${selectedId === layer.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    onClick={() => { setSelectedId(layer.id); setMode('select') }}>
                    <span className="flex-1 truncate">{layer.text || `文字 ${i + 1}`}</span>
                    <button className="shrink-0 opacity-60 hover:opacity-100"
                      onClick={ev => { ev.stopPropagation(); removeLayer(layer.id) }}>×</button>
                  </div>
                ))}
              </div>
            )}

            {/* Selected layer properties */}
            {selectedLayer && (
              <div className="space-y-3 rounded-lg border p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">文字属性</p>

                <textarea
                  value={selectedLayer.text}
                  onChange={e => updateLayer(selectedLayer.id, { text: e.target.value })}
                  rows={2}
                  className="w-full rounded-md border bg-background px-2 py-1.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                />

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">文字颜色</p>
                    <input type="color" value={selectedLayer.color}
                      onChange={e => updateLayer(selectedLayer.id, { color: e.target.value })}
                      className="h-8 w-full cursor-pointer rounded border bg-background" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">字号: {selectedLayer.fontSize}px</p>
                    <input type="range" min={8} max={300} value={selectedLayer.fontSize}
                      onChange={e => updateLayer(selectedLayer.id, { fontSize: Number(e.target.value) })}
                      className="mt-1.5 w-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">不透明度: {selectedLayer.opacity}%</p>
                  <input type="range" min={10} max={100} value={selectedLayer.opacity}
                    onChange={e => updateLayer(selectedLayer.id, { opacity: Number(e.target.value) })}
                    className="w-full" />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 font-bold"
                    variant={selectedLayer.bold ? 'default' : 'outline'}
                    onClick={() => updateLayer(selectedLayer.id, { bold: !selectedLayer.bold })}>B</Button>
                  <Button size="sm" className="flex-1 italic"
                    variant={selectedLayer.italic ? 'default' : 'outline'}
                    onClick={() => updateLayer(selectedLayer.id, { italic: !selectedLayer.italic })}>I</Button>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">字体</p>
                  <select value={selectedLayer.fontFamily}
                    onChange={e => updateLayer(selectedLayer.id, { fontFamily: e.target.value })}
                    className="w-full rounded-md border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    style={{ fontFamily: selectedLayer.fontFamily }}>
                    {FONTS.map(f => (
                      <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">背景色</p>
                  <div className="flex items-center gap-2">
                    <input type="color" value={selectedLayer.bgColor}
                      onChange={e => updateLayer(selectedLayer.id, { bgColor: e.target.value })}
                      className="h-8 w-14 cursor-pointer rounded border bg-background" />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="text-xs text-muted-foreground">不透明度: {selectedLayer.bgOpacity}%</p>
                      <input type="range" min={0} max={100} value={selectedLayer.bgOpacity}
                        onChange={e => updateLayer(selectedLayer.id, { bgOpacity: Number(e.target.value) })}
                        className="w-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Download */}
            <div className="space-y-2 rounded-lg border p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">下载</p>
              <div className="flex gap-2">
                {(['png', 'jpeg'] as const).map(f => (
                  <Button key={f} size="sm" className="flex-1"
                    variant={dlFormat === f ? 'default' : 'outline'}
                    onClick={() => setDlFormat(f)}>
                    {f.toUpperCase()}
                  </Button>
                ))}
              </div>
              <Button size="sm" className="w-full" onClick={download}>⬇ 下载图片</Button>
            </div>
          </div>
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
