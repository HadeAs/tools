'use client'

import { useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { convertBase, type BaseResult } from './logic'

const bases = [
  { label: '二进制',   base: 2  },
  { label: '八进制',   base: 8  },
  { label: '十进制',   base: 10 },
  { label: '十六进制', base: 16 },
]

const resultKeys: { key: keyof BaseResult; label: string }[] = [
  { key: 'binary',  label: '二进制 (2)'   },
  { key: 'octal',   label: '八进制 (8)'   },
  { key: 'decimal', label: '十进制 (10)'  },
  { key: 'hex',     label: '十六进制 (16)' },
]

export default function NumberBase() {
  const [input, setInput]     = usePersistedState('tool:number-base:input', '')
  const [fromBase, setFromBase] = usePersistedState('tool:number-base:fromBase', 10)

  const { result, error } = useMemo((): { result: BaseResult | null; error: string } => {
    if (!input.trim()) return { result: null, error: '' }
    try { return { result: convertBase(input.trim(), fromBase), error: '' } }
    catch (e) { return { result: null, error: e instanceof Error ? e.message : '转换失败' } }
  }, [input, fromBase])

  return (
    <ToolErrorBoundary>
      <div className="space-y-4 max-w-lg">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">输入进制</p>
          <div className="flex flex-wrap gap-2">
            {bases.map(({ label, base }) => (
              <Button key={base} variant={fromBase === base ? 'default' : 'outline'} size="sm" onClick={() => setFromBase(base)}>
                {label}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">数值</p>
          <p className="text-xs text-muted-foreground">支持负数，如 -255</p>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`输入${bases.find(b => b.base === fromBase)?.label}数值...`}
            className="font-mono"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {result && (
          <div className="space-y-2">
            {resultKeys.map(({ key, label }) => (
              <div key={key} className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                <code className="block rounded border bg-muted px-3 py-2 text-sm font-mono">{result[key]}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
