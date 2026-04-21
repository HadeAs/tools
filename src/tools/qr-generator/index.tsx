'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { QRCodeSVG } from 'qrcode.react'
import { ToolErrorBoundary } from '@/components/error-boundary'

export default function QrGenerator() {
  const [input, setInput] = useState('')
  const [value, setValue] = useState('')

  const generate = () => setValue(input.trim())

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">URL or Text</p>
          <div className="flex gap-2">
            <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()} placeholder="https://example.com" className="font-mono text-sm" />
            <Button onClick={generate} disabled={!input}>Generate</Button>
          </div>
        </div>
        {value && (
          <div className="flex justify-center rounded border bg-white p-6">
            <QRCodeSVG value={value} size={200} />
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
