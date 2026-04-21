import Link from 'next/link'
import type { ToolMeta } from '@/tools/registry'

interface ToolCardProps {
  tool: ToolMeta
  compact?: boolean
}

export function ToolCard({ tool, compact = false }: ToolCardProps) {
  const Icon = tool.icon
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex items-start gap-3 rounded-lg border bg-card p-4 text-card-foreground transition-colors hover:border-primary/50 hover:bg-accent"
    >
      <div className="mt-0.5 rounded-md bg-primary/10 p-1.5">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="font-medium leading-none group-hover:text-primary">{tool.name}</p>
        {!compact && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
        )}
      </div>
    </Link>
  )
}
