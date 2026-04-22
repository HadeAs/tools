'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { tools, categoryLabels, getToolBySlug, type ToolCategory } from '@/tools/registry'
import { ToolCard } from '@/components/tool-card'
import { SearchBar } from '@/components/search-bar'
import { useRecentTools } from '@/hooks/use-recent-tools'

const categories: ToolCategory[] = ['developer', 'text', 'encoding', 'conversion']

function DonationCard() {
  return (
    <div className="rounded-xl border bg-card p-4 text-center shadow-sm">
      <p className="mb-1 text-sm font-semibold">支持一下</p>
      <p className="mb-3 text-xs text-muted-foreground">如果这些工具对你有帮助，可以请作者喝杯咖啡 ☕</p>
      <div className="overflow-hidden rounded-lg border">
        <Image src="/pay.png" alt="收款码" width={200} height={215} className="w-full object-cover" />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">扫码打赏，感谢支持！</p>
    </div>
  )
}

export default function HomePage() {
  const [search, setSearch] = useState('')
  const { recent } = useRecentTools()

  const recentTools = useMemo(
    () => recent.map(slug => getToolBySlug(slug)).filter(Boolean),
    [recent]
  )

  const filtered = useMemo(() => {
    if (!search.trim()) return tools
    const q = search.toLowerCase()
    return tools.filter(t =>
      t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    )
  }, [search])

  const grouped = useMemo(() =>
    categories
      .map(cat => ({ category: cat, label: categoryLabels[cat], tools: filtered.filter(t => t.category === cat) }))
      .filter(g => g.tools.length > 0),
    [filtered]
  )

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex gap-8">
        <div className="min-w-0 flex-1">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">在线开发者工具</h1>
            <p className="text-muted-foreground">免费的在线开发者工具集合，所有计算均在浏览器本地完成。</p>
          </div>
          <div className="mb-8 max-w-sm">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {!search && recentTools.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">最近使用</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {recentTools.map(tool => tool && <ToolCard key={tool.slug} tool={tool} compact />)}
              </div>
            </section>
          )}

          {grouped.length === 0 ? (
            <p className="text-muted-foreground">没有找到与 &quot;{search}&quot; 匹配的工具。</p>
          ) : (
            <div className="space-y-8">
              {grouped.map(({ category, label, tools }) => (
                <section key={category}>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{label}</h2>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {tools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        <aside className="hidden lg:flex w-52 shrink-0 flex-col">
          <div className="sticky top-24">
            <DonationCard />
          </div>
        </aside>
      </div>
    </div>
  )
}
