'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { searchStatus, CATEGORY_COLORS, type StatusCode } from './logic'

function StatusRow({ s }: { s: StatusCode }) {
  return (
    <div className="flex items-start gap-3 px-3 py-2.5">
      <span className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-xs font-semibold ${CATEGORY_COLORS[s.category]}`}>
        {s.code}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium">{s.name}</p>
        <p className="text-xs text-muted-foreground">{s.description}</p>
      </div>
    </div>
  )
}

export default function HttpStatus() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => searchStatus(query), [query])

  const grouped = useMemo(() => {
    const map = new Map<string, StatusCode[]>()
    for (const s of results) {
      const cat = s.category
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(s)
    }
    return map
  }, [results])

  return (
    <ToolErrorBoundary>
      <div className="max-w-2xl space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">搜索</p>
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="输入状态码、名称或关键词，如 404 / not found / 限流"
            className="font-mono text-sm"
          />
        </div>

        {results.length === 0 && (
          <p className="text-sm text-muted-foreground">未找到匹配的状态码</p>
        )}

        <div className="space-y-4">
          {(['1xx', '2xx', '3xx', '4xx', '5xx'] as const).map(cat => {
            const items = grouped.get(cat)
            if (!items?.length) return null
            return (
              <div key={cat} className="space-y-1">
                <p className={`text-xs font-semibold uppercase tracking-wide ${CATEGORY_COLORS[cat].split(' ')[0]}`}>
                  {cat} {cat === '1xx' ? '信息' : cat === '2xx' ? '成功' : cat === '3xx' ? '重定向' : cat === '4xx' ? '客户端错误' : '服务端错误'}
                </p>
                <div className="divide-y rounded-lg border">
                  {items.map(s => <StatusRow key={s.code} s={s} />)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
