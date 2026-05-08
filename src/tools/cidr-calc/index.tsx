'use client'

import { useMemo, useState } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { parseCIDR, splitSubnets } from './logic'

const EXAMPLES = ['192.168.1.0/24', '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '8.8.8.8/32']

function InfoRow({ label, value, mono = true }: { label: string; value: string | number; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 border-b last:border-0">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className={`text-sm font-medium text-right break-all ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}

export default function CidrCalc() {
  const [input, setInput] = usePersistedState('tool:cidr-calc:input', '192.168.1.0/24')
  const [splitPrefix, setSplitPrefix] = useState(26)
  const [copied, setCopied] = useState<string | null>(null)

  const result = useMemo(() => parseCIDR(input), [input])

  const subnets = useMemo(() => {
    if (!result.ok) return []
    return splitSubnets(`${result.info.networkAddress}/${result.info.prefix}`, splitPrefix)
  }, [result, splitPrefix])

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const maxSplitPrefix = result.ok ? Math.min(result.info.prefix + 8, 32) : 32
  const minSplitPrefix = result.ok ? result.info.prefix + 1 : 1

  return (
    <ToolErrorBoundary>
      <div className="space-y-5">
        {/* 输入区 */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            CIDR 地址
          </label>
          <div className="flex gap-2 flex-wrap">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="192.168.1.0/24"
              spellCheck={false}
              className="h-9 flex-1 min-w-48 rounded-md border bg-background px-3 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          {/* 快捷示例 */}
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.map(ex => (
              <button
                key={ex}
                onClick={() => setInput(ex)}
                className="rounded border px-2 py-0.5 font-mono text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* 结果 */}
        {!result.ok ? (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {result.error}
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {/* 地址信息 */}
            <div className="rounded-lg border p-4 space-y-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">地址信息</h3>
                <div className="flex gap-1">
                  {result.info.isPrivate && (
                    <span className="rounded-full bg-green-100 dark:bg-green-900/40 px-2 py-0.5 text-xs text-green-700 dark:text-green-300">私有</span>
                  )}
                  <span className="rounded-full bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-xs text-blue-700 dark:text-blue-300">
                    Class {result.info.ipClass}
                  </span>
                </div>
              </div>
              <InfoRow label="网络地址" value={result.info.networkAddress} />
              <InfoRow label="广播地址" value={result.info.broadcastAddress} />
              <InfoRow label="子网掩码" value={result.info.subnetMask} />
              <InfoRow label="通配符掩码" value={result.info.wildcardMask} />
              <InfoRow label="首个可用主机" value={result.info.firstHost} />
              <InfoRow label="最后可用主机" value={result.info.lastHost} />
              <InfoRow label="总主机数" value={result.info.totalHosts.toLocaleString()} mono={false} />
              <InfoRow label="可用主机数" value={result.info.usableHosts.toLocaleString()} mono={false} />
              <InfoRow label="前缀长度" value={`/${result.info.prefix}`} />
            </div>

            {/* 二进制 + 子网拆分 */}
            <div className="space-y-4">
              {/* 二进制展示 */}
              <div className="rounded-lg border p-4 space-y-2">
                <h3 className="text-sm font-semibold mb-2">二进制表示</h3>
                <div className="space-y-1.5">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">IP 地址</p>
                    <code className="block rounded bg-muted px-2 py-1 font-mono text-xs break-all">
                      {result.info.ipBinary}
                    </code>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">子网掩码</p>
                    <code className="block rounded bg-muted px-2 py-1 font-mono text-xs break-all">
                      {result.info.maskBinary}
                    </code>
                  </div>
                </div>
                {/* CIDR 格式复制 */}
                <div className="pt-1 flex items-center justify-between">
                  <code className="font-mono text-sm">{result.info.networkAddress}/{result.info.prefix}</code>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => copy(`${result.info.networkAddress}/${result.info.prefix}`, 'cidr')}
                  >
                    {copied === 'cidr' ? '已复制！' : '复制 CIDR'}
                  </Button>
                </div>
              </div>

              {/* 子网拆分 */}
              {result.info.prefix < 32 && (
                <div className="rounded-lg border p-4 space-y-3">
                  <h3 className="text-sm font-semibold">子网拆分</h3>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground whitespace-nowrap">新前缀</label>
                    <input
                      type="range"
                      min={minSplitPrefix}
                      max={maxSplitPrefix}
                      value={splitPrefix}
                      onChange={e => setSplitPrefix(Number(e.target.value))}
                      className="flex-1 accent-primary"
                    />
                    <span className="text-sm font-mono w-8 text-right">/{splitPrefix}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    拆分为 {subnets.length} 个子网，每个含 {Math.pow(2, 32 - splitPrefix).toLocaleString()} 个地址
                  </p>
                  <div className="max-h-44 overflow-y-auto space-y-1">
                    {subnets.slice(0, 64).map((s, i) => (
                      <div key={s} className="flex items-center justify-between">
                        <span className="font-mono text-xs">{i + 1}. {s}</span>
                        <button
                          onClick={() => copy(s, s)}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copied === s ? '✓' : '复制'}
                        </button>
                      </div>
                    ))}
                    {subnets.length > 64 && (
                      <p className="text-xs text-muted-foreground text-center pt-1">
                        仅显示前 64 条，共 {subnets.length} 个子网
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
