'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { decodeJWT, type JWTDecoded } from './logic'

export default function JwtDecoder() {
  const [input, setInput] = useState('')
  const [decoded, setDecoded] = useState<JWTDecoded | null>(null)
  const [error, setError] = useState('')

  const decode = () => {
    try {
      setDecoded(decodeJWT(input.trim()))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JWT')
      setDecoded(null)
    }
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">JWT Token</p>
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="在此粘贴 JWT Token..." className="min-h-[100px] font-mono text-sm" />
        </div>
        <Button onClick={decode} disabled={!input}>解析</Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {decoded && (
          <div className="space-y-3">
            {(['header', 'payload'] as const).map(part => (
              <div key={part} className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{part}</p>
                <pre className="rounded border bg-muted px-3 py-2 text-xs font-mono overflow-auto">{JSON.stringify(decoded[part], null, 2)}</pre>
              </div>
            ))}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">签名</p>
              <code className="block rounded border bg-muted px-3 py-2 text-xs font-mono break-all">{decoded.signature}</code>
            </div>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
