import Link from 'next/link'
import type { ToolMeta, ToolCategory } from '@/tools/registry'
import { FavoriteButton } from './favorite-button'
import { formatCount } from '@/hooks/use-stats'

interface ToolCardProps {
  tool: ToolMeta
  compact?: boolean
  count?: number
}

const iconClass: Record<ToolCategory, string> = {
  developer: 'icon-developer',
  text:      'icon-text',
  encoding:  'icon-encoding',
  conversion:'icon-conversion',
}

export function ToolCard({ tool, compact = false, count }: ToolCardProps) {
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
        <div className="min-w-0 flex-1 pr-5">
          <div className="flex items-center gap-2">
            <p className="font-medium leading-none transition-colors group-hover:text-primary">{tool.name}</p>
            {count != null && count > 0 && (
              <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {formatCount(count)}
              </span>
            )}
          </div>
          {!compact && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
          )}
        </div>
      </Link>
      <FavoriteButton slug={tool.slug} />
    </div>
  )
}
