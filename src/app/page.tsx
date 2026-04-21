'use client'

import { useState, useMemo } from 'react'
import { tools, categoryLabels, getToolBySlug, type ToolCategory } from '@/tools/registry'
import { ToolCard } from '@/components/tool-card'
import { SearchBar } from '@/components/search-bar'
import { useRecentTools } from '@/hooks/use-recent-tools'

const categories: ToolCategory[] = ['developer', 'text', 'encoding', 'conversion']

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
    <div className="container mx-auto max-w-5xl px-4 py-8">
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
  )
}
