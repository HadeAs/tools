'use client'

import { useState, useMemo } from 'react'
import { tools, categoryLabels, getToolBySlug, type ToolCategory } from '@/tools/registry'
import { ToolCard } from '@/components/tool-card'
import { SearchBar } from '@/components/search-bar'
import { useRecentTools } from '@/hooks/use-recent-tools'
import { useFavorites } from '@/hooks/use-favorites'

const categories: ToolCategory[] = ['developer', 'text', 'encoding', 'conversion']

const categoryAccent: Record<ToolCategory, string> = {
  developer: 'accent-developer',
  text:      'accent-text',
  encoding:  'accent-encoding',
  conversion:'accent-conversion',
}


export default function HomePage() {
  const [search, setSearch] = useState('')
  const { recent } = useRecentTools()
  const { favorites } = useFavorites()

  const recentTools = useMemo(
    () => recent.map(slug => getToolBySlug(slug)).filter(Boolean),
    [recent]
  )

  const favoriteTools = useMemo(
    () => favorites.map(slug => getToolBySlug(slug)).filter(Boolean),
    [favorites]
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
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="min-w-0">
        {/* Hero */}
          <div className="hero-bg animate-fade-up mb-8 rounded-2xl px-6 py-8">
            <h1 className="text-3xl font-bold tracking-tight">在线开发者工具</h1>
            <p className="mt-2 text-muted-foreground">免费的在线开发者工具集合，所有计算均在浏览器本地完成。</p>
          </div>

          {/* Search */}
          <div className="animate-fade-up-delay mb-8 max-w-md">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          {!search && favoriteTools.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 flex items-center gap-2 border-l-2 border-amber-400 pl-3 text-sm font-semibold uppercase tracking-wider text-foreground/60">
                收藏
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {favoriteTools.map(tool => tool && <ToolCard key={tool.slug} tool={tool} compact />)}
              </div>
            </section>
          )}

          {!search && recentTools.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 border-l-2 border-primary/40 pl-3 text-sm font-semibold uppercase tracking-wider text-foreground/60">
                最近使用
              </h2>
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
                  <h2 className={`mb-3 border-l-2 pl-3 text-sm font-semibold uppercase tracking-wider text-foreground/60 ${categoryAccent[category]}`}>
                    {label}
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {tools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
                  </div>
                </section>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}
