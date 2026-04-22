'use client'

import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { QRCodeCanvas } from 'qrcode.react'
import { ToolErrorBoundary } from '@/components/error-boundary'

export default function QrGenerator() {
  const [input,   setInput]   = useState('')
  const [value,   setValue]   = useState('')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const canvasRef = useRef<HTMLDivElement>(null)

  const generate = () => setValue(input.trim())

  const download = () => {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url; a.download = 'qrcode.png'; a.click()
  }

  return (
    <ToolErrorBoundary>
      <div className="max-w-sm space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">URL 或文本</p>
          <div className="flex gap-2">
            <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()} placeholder="https://example.com" className="font-mono text-sm" />
            <Button onClick={generate} disabled={!input}>生成</Button>
          </div>
        </div>

        <div className="flex gap-4">
          {[
            { label: '前景色', value: fgColor, set: setFgColor },
            { label: '背景色', value: bgColor, set: setBgColor },
          ].map(({ label, value, set }) => (
            <div key={label} className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">{label}</label>
              <div className="relative h-7 w-7 overflow-hidden rounded border">
                <div className="absolute inset-0" style={{ backgroundColor: value }} />
                <input type="color" value={value} onChange={e => set(e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0" />
              </div>
              <code className="font-mono text-xs">{value}</code>
            </div>
          ))}
        </div>

        {value && (
          <div className="space-y-3">
            <div ref={canvasRef} className="flex justify-center rounded-xl border p-6" style={{ backgroundColor: bgColor }}>
              <QRCodeCanvas value={value} size={200} fgColor={fgColor} bgColor={bgColor} />
            </div>
            <div className="flex justify-center">
              <Button variant="outline" onClick={download}>下载 PNG</Button>
            </div>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
