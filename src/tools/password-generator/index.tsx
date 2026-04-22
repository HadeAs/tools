'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { generatePassword, getStrength, type Strength } from './logic'

const CHAR_OPTS = [
  { key: 'uppercase', label: '大写 A-Z' },
  { key: 'lowercase', label: '小写 a-z' },
  { key: 'numbers',   label: '数字 0-9' },
  { key: 'symbols',   label: '符号 !@#…' },
] as const

const strengthStyle: Record<Strength, { label: string; bar: string; text: string }> = {
  weak:   { label: '弱', bar: 'w-1/3 bg-red-500',    text: 'text-red-500'    },
  medium: { label: '中', bar: 'w-2/3 bg-amber-500',  text: 'text-amber-500'  },
  strong: { label: '强', bar: 'w-full bg-green-500', text: 'text-green-500'  },
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [opts, setOpts]     = useState({ uppercase: true, lowercase: true, numbers: true, symbols: false })
  const [password, setPassword] = useState('')
  const [error, setError]   = useState('')
  const [copied, setCopied] = useState(false)
  const [tick, setTick]     = useState(0)  // bumped to re-roll with same settings

  const roll = useCallback(() => {
    try {
      setPassword(generatePassword({ length, ...opts }))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成失败')
      setPassword('')
    }
  }, [length, opts])

  useEffect(() => { roll() }, [roll, tick])

  const copy = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const toggle = (key: keyof typeof opts) => setOpts(o => ({ ...o, [key]: !o[key] }))
  const strength = password ? getStrength(password) : null

  return (
    <ToolErrorBoundary>
      <div className="max-w-lg space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">长度：{length}</p>
          <input
            type="range" min={4} max={64} value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>4</span><span>64</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">字符类型</p>
          <div className="flex flex-wrap gap-2">
            {CHAR_OPTS.map(({ key, label }) => (
              <button key={key} onClick={() => toggle(key)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                  opts[key] ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:border-primary/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {password && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <code className="flex-1 break-all rounded border bg-muted px-3 py-2 font-mono text-sm">{password}</code>
              <div className="flex shrink-0 flex-col gap-1 self-start">
                <Button variant="outline" size="sm" onClick={copy}>{copied ? '已复制！' : '复制'}</Button>
                <Button variant="ghost" size="sm" onClick={() => setTick(t => t + 1)}>刷新</Button>
              </div>
            </div>
            {strength && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">强度</span>
                  <span className={strengthStyle[strength].text}>{strengthStyle[strength].label}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div className={`h-full rounded-full transition-all ${strengthStyle[strength].bar}`} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
