'use client'

import { useMemo, useState } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { generateJWT, DEFAULT_PAYLOAD, type Algorithm } from './logic'

const ALGORITHMS: Algorithm[] = ['HS256', 'HS384', 'HS512']

export default function JwtGenerator() {
  const [payload, setPayload] = usePersistedState('tool:jwt-gen:payload', DEFAULT_PAYLOAD)
  const [secret, setSecret] = usePersistedState('tool:jwt-gen:secret', 'your-256-bit-secret')
  const [alg, setAlg] = useState<Algorithm>('HS256')
  const [copied, setCopied] = useState(false)

  const { token, error } = useMemo(() => {
    if (!payload.trim() || !secret.trim()) return { token: '', error: '' }
    try { return { token: generateJWT(payload, secret, alg), error: '' } }
    catch (e) { return { token: '', error: e instanceof Error ? e.message : '生成失败' } }
  }, [payload, secret, alg])

  const copy = async () => {
    if (!token) return
    await navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="flex gap-2">
          {ALGORITHMS.map(a => (
            <Button key={a} variant={alg === a ? 'default' : 'outline'} size="sm" onClick={() => setAlg(a)}>
              {a}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Payload (JSON)</p>
              <textarea
                value={payload}
                onChange={e => setPayload(e.target.value)}
                className="h-40 w-full rounded-md border bg-background px-3 py-2 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Secret Key</p>
              <input
                type="text"
                value={secret}
                onChange={e => setSecret(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">生成的 Token</p>
              {token && <Button variant="ghost" size="sm" onClick={copy}>{copied ? '已复制！' : '复制'}</Button>}
            </div>
            {error
              ? <p className="text-sm text-destructive">{error}</p>
              : token
              ? (
                <div className="rounded-md border bg-muted p-3 font-mono text-xs break-all leading-relaxed">
                  <span className="text-red-500">{token.split('.')[0]}</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-amber-500">{token.split('.')[1]}</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-blue-500">{token.split('.')[2]}</span>
                </div>
              )
              : <div className="h-32 rounded-md border bg-muted" />
            }
          </div>
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
