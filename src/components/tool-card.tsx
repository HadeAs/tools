import Link from 'next/link'
import type { ToolMeta, ToolCategory } from '@/tools/registry'
import { FavoriteButton } from './favorite-button'

interface ToolCardProps {
  tool: ToolMeta
  compact?: boolean
}

const iconClass: Record<ToolCategory, string> = {
  developer: 'icon-developer',
  text:      'icon-text',
  encoding:  'icon-encoding',
  conversion:'icon-conversion',
}

export function ToolCard({ tool, compact = false }: ToolCardProps) {
  const Icon = tool.icon
  return (
    <div className="group relative">
      <Link
        href={`/tools/${tool.slug}`}
        className="flex items-start gap-3 rounded-lg border bg-card p-4 text-card-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
      >
        <div className={`mt-0.5 shrink-0 rounded-md p-1.5 ${iconClass[tool.category]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 pr-5">
          <p className="font-medium leading-none transition-colors group-hover:text-primary">{tool.name}</p>
          {!compact && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
          )}
        </div>
      </Link>
      <FavoriteButton slug={tool.slug} />
    </div>
  )
}
