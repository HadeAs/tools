'use client'

import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { QRCodeCanvas } from 'qrcode.react'
import { ToolErrorBoundary } from '@/components/error-boundary'

export default function QrGenerator() {
  const [input, setInput] = useState('')
  const [value, setValue] = useState('')
  const canvasRef = useRef<HTMLDivElement>(null)

  const generate = () => setValue(input.trim())

  const download = () => {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'qrcode.png'
    a.click()
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">URL 或文本</p>
          <div className="flex gap-2">
            <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()} placeholder="https://example.com" className="font-mono text-sm" />
            <Button onClick={generate} disabled={!input}>生成</Button>
          </div>
        </div>
        {value && (
          <div className="space-y-3">
            <div ref={canvasRef} className="flex justify-center rounded border bg-white p-6">
              <QRCodeCanvas value={value} size={200} />
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
