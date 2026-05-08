'use client'

import { useState, useMemo } from 'react'
import { tools, categoryLabels, getToolBySlug, type ToolCategory } from '@/tools/registry'
import { ToolCard } from '@/components/tool-card'
import { SearchBar } from '@/components/search-bar'
import { useRecentTools } from '@/hooks/use-recent-tools'
import { useFavorites } from '@/hooks/use-favorites'
import { useStats } from '@/hooks/use-stats'

const categories: ToolCategory[] = ['developer', 'text', 'encoding', 'conversion']

const categoryEmoji: Record<ToolCategory, string> = {
  developer: '⚙️',
  text:      '📝',
  encoding:  '🔐',
  conversion:'🔄',
}

const categoryTabActive: Record<ToolCategory, string> = {
  developer: 'bg-[oklch(0.52_0.2_245)] text-white shadow-sm',
  text:      'bg-[oklch(0.5_0.18_160)] text-white shadow-sm',
  encoding:  'bg-[oklch(0.56_0.18_55)] text-white shadow-sm',
  conversion:'bg-[oklch(0.55_0.18_300)] text-white shadow-sm',
}

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<ToolCategory | null>(null)
  const { recent } = useRecentTools()
  const { favorites } = useFavorites()
  const { stats } = useStats()

  const recentTools = useMemo(
    () => recent.slice(0, 8).map(slug => getToolBySlug(slug)).filter(Boolean),
    [recent],
  )

  const favoriteTools = useMemo(
    () => favorites.map(slug => getToolBySlug(slug)).filter(Boolean),
    [favorites],
  )

  const topTools = useMemo(() => {
    const hasData = Object.values(stats).some(v => v > 0)
    if (!hasData) return []
    return [...tools]
      .sort((a, b) => (stats[b.slug] ?? 0) - (stats[a.slug] ?? 0))
      .slice(0, 8)
  }, [stats])

  const isSearching = search.trim().length > 0

  const filtered = useMemo(() => {
    let list = activeCategory ? tools.filter(t => t.category === activeCategory) : tools
    if (isSearching) {
      const q = search.toLowerCase()
      list = list.filter(
        t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
      )
    }
    return list
  }, [search, activeCategory, isSearching])

  const grouped = useMemo(() => {
    if (activeCategory) {
      return [{ category: activeCategory, label: categoryLabels[activeCategory], tools: filtered }]
    }
    return categories
      .map(cat => ({ category: cat, label: categoryLabels[cat], tools: filtered.filter(t => t.category === cat) }))
      .filter(g => g.tools.length > 0)
  }, [filtered, activeCategory])

  const categoryCounts = useMemo(
    () => Object.fromEntries(categories.map(cat => [cat, tools.filter(t => t.category === cat).length])),
    [],
  )

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">

      {/* ── Hero ── */}
      <div className="hero-bg animate-fade-up mb-8 rounded-2xl px-6 py-12 text-center">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
          <span>🧰</span>
          <span>{tools.length} 个在线工具 · 全部在浏览器本地运行</span>
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight">在线开发者工具</h1>
        <p className="mb-7 text-muted-foreground">格式化 · 转换 · 加解密 · 生成 · 计算，一站解决</p>
        <div className="mx-auto max-w-lg">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      {/* ── 分类标签栏 ── */}
      <div className="animate-fade-up-delay mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
            activeCategory === null
              ? 'bg-foreground text-background shadow-sm'
              : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground'
          }`}
        >
          全部 · {tools.length}
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              activeCategory === cat
                ? categoryTabActive[cat]
                : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground'
            }`}
          >
            {categoryEmoji[cat]} {categoryLabels[cat]} · {categoryCounts[cat]}
          </button>
        ))}
      </div>

      {/* ── 个性化区块（无搜索 + 无分类筛选时显示） ── */}
      {!isSearching && !activeCategory && (
        <>
          {favoriteTools.length > 0 && (
            <section className="mb-8">
              <SectionTitle accent="amber" count={favoriteTools.length}>⭐ 收藏</SectionTitle>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {favoriteTools.map(tool => tool && (
                  <ToolCard key={tool.slug} tool={tool} count={stats[tool.slug]} />
                ))}
              </div>
            </section>
          )}

          {recentTools.length > 0 && (
            <section className="mb-8">
              <SectionTitle accent="blue" count={recentTools.length}>🕐 最近使用</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {recentTools.map(tool => tool && (
                  <RecentChip key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          )}

          {topTools.length > 0 && (
            <section className="mb-8">
              <SectionTitle accent="green" count={topTools.length}>🔥 使用最多</SectionTitle>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {topTools.map(tool => (
                  <ToolCard key={tool.slug} tool={tool} count={stats[tool.slug]} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* ── 主工具列表 ── */}
      {grouped.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-muted-foreground">没有找到与 &quot;{search}&quot; 匹配的工具</p>
        </div>
      ) : (
        <div className="space-y-10">
          {grouped.map(({ category, label, tools: groupTools }) => (
            <section key={category}>
              <SectionTitle
                accent={category}
                count={groupTools.length}
              >
                {label}
              </SectionTitle>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {groupTools.map(tool => (
                  <ToolCard key={tool.slug} tool={tool} count={stats[tool.slug]} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

// ── 区块标题组件 ──────────────────────────────────────────
type AccentColor = ToolCategory | 'amber' | 'blue' | 'green'

const accentBorder: Record<AccentColor, string> = {
  developer: 'border-[oklch(0.52_0.2_245)]',
  text:      'border-[oklch(0.5_0.18_160)]',
  encoding:  'border-[oklch(0.56_0.18_55)]',
  conversion:'border-[oklch(0.55_0.18_300)]',
  amber:     'border-amber-400',
  blue:      'border-blue-400',
  green:     'border-green-500',
}

const accentBadge: Record<AccentColor, string> = {
  developer: 'bg-[oklch(0.92_0.05_245)] text-[oklch(0.45_0.2_245)]',
  text:      'bg-[oklch(0.92_0.06_160)] text-[oklch(0.42_0.18_160)]',
  encoding:  'bg-[oklch(0.93_0.08_60)] text-[oklch(0.46_0.18_55)]',
  conversion:'bg-[oklch(0.92_0.05_300)] text-[oklch(0.45_0.18_300)]',
  amber:     'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  blue:      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  green:     'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

function SectionTitle({
  children, accent, count,
}: {
  children: React.ReactNode
  accent: AccentColor
  count?: number
}) {
  return (
    <div className={`mb-4 flex items-center gap-3 border-l-[3px] pl-3 ${accentBorder[accent]}`}>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/70">
        {children}
      </h2>
      {count != null && (
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${accentBadge[accent]}`}>
          {count}
        </span>
      )}
    </div>
  )
}

// ── 最近使用 Chip ────────────────────────────────────────
import Link from 'next/link'
import type { ToolMeta } from '@/tools/registry'

const iconClass: Record<ToolCategory, string> = {
  developer: 'icon-developer',
  text:      'icon-text',
  encoding:  'icon-encoding',
  conversion:'icon-conversion',
}

function RecentChip({ tool }: { tool: ToolMeta }) {
  const Icon = tool.icon
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
    >
      <div className={`shrink-0 rounded-full p-1 ${iconClass[tool.category]}`}>
        <Icon className="h-3 w-3" />
      </div>
      <span className="font-medium">{tool.name}</span>
    </Link>
  )
}
