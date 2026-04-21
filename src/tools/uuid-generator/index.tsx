'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { generateBatch } from './logic'

const COUNTS = [1, 5, 10]

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  const generate = (count: number) => setUuids(generateBatch(count))

  const copy = async (uuid: string) => {
    await navigator.clipboard.writeText(uuid)
    setCopied(uuid)
    setTimeout(() => setCopied(null), 1500)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'))
    setCopied('all')
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {COUNTS.map(n => (
            <Button key={n} variant="outline" onClick={() => generate(n)}>
              生成 {n} 个
            </Button>
          ))}
          {uuids.length > 1 && (
            <Button variant="ghost" onClick={copyAll}>{copied === 'all' ? '已复制全部！' : '复制全部'}</Button>
          )}
        </div>
        {uuids.length > 0 && (
          <div className="space-y-2">
            {uuids.map(uuid => (
              <div key={uuid} className="flex items-center gap-2">
                <code className="flex-1 rounded border bg-muted px-3 py-2 text-sm font-mono">{uuid}</code>
                <Button variant="outline" size="sm" onClick={() => copy(uuid)}>{copied === uuid ? '已复制！' : '复制'}</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
