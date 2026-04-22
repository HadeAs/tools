import Link from 'next/link'
import type { ToolMeta, ToolCategory } from '@/tools/registry'

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
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex items-start gap-3 rounded-lg border bg-card p-4 text-card-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className={`mt-0.5 shrink-0 rounded-md p-1.5 ${iconClass[tool.category]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="font-medium leading-none group-hover:text-primary transition-colors">{tool.name}</p>
        {!compact && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
        )}
      </div>
    </Link>
  )
}
