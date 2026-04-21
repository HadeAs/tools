'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { decodeJWT, type JWTDecoded } from './logic'
import { usePersistedState } from '@/hooks/use-persisted-state'

function formatUnix(ts: number): string {
  return new Date(ts * 1000).toLocaleString('zh-CN')
}

function ExpiryBadge({ payload }: { payload: Record<string, unknown> }) {
  const exp = typeof payload.exp === 'number' ? payload.exp : null
  const iat = typeof payload.iat === 'number' ? payload.iat : null
  if (!exp) return null

  const now = Math.floor(Date.now() / 1000)
  const expired = now > exp
  const diffSec = Math.abs(exp - now)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  const timeDesc = diffDay > 0
    ? `${diffDay} 天`
    : diffHour > 0
    ? `${diffHour} 小时`
    : `${diffMin} 分钟`

  return (
    <div className="space-y-2">
      <div className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${expired ? 'bg-destructive/10 text-destructive' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}`}>
        <span>{expired ? '⚠ 已过期' : '✓ 有效'}</span>
        <span className="font-normal opacity-80">
          {expired ? `（${timeDesc}前到期）` : `（还有 ${timeDesc} 到期）`}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground sm:grid-cols-2">
        {iat && <span>签发时间：{formatUnix(iat)}</span>}
        <span>过期时间：{formatUnix(exp)}</span>
      </div>
    </div>
  )
}

export default function JwtDecoder() {
  const [input, setInput] = usePersistedState('tool:jwt-decoder:input', '')
  const [decoded, setDecoded] = useState<JWTDecoded | null>(null)
  const [error, setError] = useState('')

  const decode = () => {
    try {
      setDecoded(decodeJWT(input.trim()))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : '无效的 JWT')
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
            <ExpiryBadge payload={decoded.payload} />
            {(['header', 'payload'] as const).map(part => (
              <div key={part} className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{part === 'header' ? '头部' : '载荷'}</p>
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
