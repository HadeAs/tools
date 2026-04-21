import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { tools, getToolBySlug, getRelatedTools, categoryLabels } from '@/tools/registry'
import { DynamicTool } from '@/components/dynamic-tool'
import { ToolCard } from '@/components/tool-card'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return tools.map(t => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return {}
  return {
    title: tool.name,
    description: tool.description,
    openGraph: { title: `${tool.name} | DevTools`, description: tool.description },
  }
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) notFound()

  const related = getRelatedTools(slug)
  const Icon = tool.icon

  return (
    <div className="space-y-8">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <span>{categoryLabels[tool.category]}</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{tool.name}</span>
      </nav>

      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{tool.name}</h1>
          <p className="text-muted-foreground">{tool.description}</p>
        </div>
      </div>

      <DynamicTool slug={slug} />

      {related.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Related Tools</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map(t => <ToolCard key={t.slug} tool={t} compact />)}
          </div>
        </section>
      )}
    </div>
  )
}
