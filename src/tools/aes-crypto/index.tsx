'use client'

import { useState, useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { aesEncrypt, aesDecrypt, type AesMode } from './logic'

export default function AesCrypto() {
  const [mode, setMode] = useState<AesMode>('encrypt')
  const [input, setInput] = usePersistedState('tool:aes:input', '')
  const [key, setKey] = usePersistedState('tool:aes:key', '')
  const [copied, setCopied] = useState(false)

  const { output, error } = useMemo(() => {
    if (!input.trim() || !key.trim()) return { output: '', error: '' }
    try {
      const output = mode === 'encrypt' ? aesEncrypt(input, key) : aesDecrypt(input, key)
      return { output, error: '' }
    } catch (e) {
      return { output: '', error: e instanceof Error ? e.message : '操作失败' }
    }
  }, [input, key, mode])

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="flex gap-2">
          {(['encrypt', 'decrypt'] as AesMode[]).map(m => (
            <Button
              key={m}
              variant={mode === m ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode(m)}
            >
              {m === 'encrypt' ? '加密' : '解密'}
            </Button>
          ))}
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">密钥 (Key)</p>
          <input
            type="text"
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="输入加密密钥..."
            className="w-full rounded-md border bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {mode === 'encrypt' ? '明文' : '密文'}
            </p>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={mode === 'encrypt' ? '输入要加密的文本...' : '输入要解密的密文...'}
              className="h-48 w-full rounded-md border bg-background px-3 py-2 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {mode === 'encrypt' ? '密文' : '明文'}
              </p>
              {output && <Button variant="ghost" size="sm" onClick={copy}>{copied ? '已复制！' : '复制'}</Button>}
            </div>
            {error
              ? <p className="text-sm text-destructive">{error}</p>
              : <pre className="h-48 overflow-auto rounded-md border bg-muted px-3 py-2 font-mono text-sm whitespace-pre-wrap break-all">{output}</pre>
            }
          </div>
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
