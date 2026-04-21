'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { hexToRgb, rgbToHex, rgbToHsl } from './logic'

export default function ColorConverter() {
  const [hex, setHex] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ hex: string; rgb: string; hsl: string } | null>(null)

  const convert = () => {
    try {
      const rgb = hexToRgb(hex.startsWith('#') ? hex : `#${hex}`)
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      const normalized = rgbToHex(rgb.r, rgb.g, rgb.b)
      setResult({
        hex: normalized,
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      })
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid color')
      setResult(null)
    }
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Hex Color</p>
          <div className="flex gap-2">
            <Input value={hex} onChange={e => setHex(e.target.value)} onKeyDown={e => e.key === 'Enter' && convert()} placeholder="#ff0000" className="font-mono text-sm" />
            <Button onClick={convert} disabled={!hex}>Convert</Button>
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {result && (
          <div className="space-y-3">
            <div className="rounded border overflow-hidden" style={{ height: 80, backgroundColor: result.hex }} />
            {[['HEX', result.hex], ['RGB', result.rgb], ['HSL', result.hsl]].map(([label, val]) => (
              <div key={label} className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                <code className="block rounded border bg-muted px-3 py-2 text-sm font-mono">{val}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
