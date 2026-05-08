import Link from 'next/link'
import type { ToolMeta, ToolCategory } from '@/tools/registry'
import { FavoriteButton } from './favorite-button'
import { formatCount } from '@/hooks/use-stats'

interface ToolCardProps {
  tool: ToolMeta
  count?: number
}

const iconClass: Record<ToolCategory, string> = {
  developer: 'icon-developer',
  text:      'icon-text',
  encoding:  'icon-encoding',
  conversion:'icon-conversion',
}

// hover 时左边框颜色（行内 style 用 CSS 变量）
const hoverBorderColor: Record<ToolCategory, string> = {
  developer: 'oklch(0.52 0.2 245)',
  text:      'oklch(0.5 0.18 160)',
  encoding:  'oklch(0.56 0.18 55)',
  conversion:'oklch(0.55 0.18 300)',
}

export function ToolCard({ tool, count }: ToolCardProps) {
  const Icon = tool.icon
  const color = hoverBorderColor[tool.category]

  return (
    <div
      className="group relative"
      style={{ '--card-accent': color } as React.CSSProperties}
    >
      <Link
        href={`/tools/${tool.slug}`}
        className="tool-card flex items-start gap-3 rounded-lg border bg-card p-4 text-card-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        {/* 图标 */}
        <div className={`mt-0.5 shrink-0 rounded-lg p-2 ${iconClass[tool.category]}`}>
          <Icon className="h-4 w-4" />
        </div>

        {/* 文字 */}
        <div className="min-w-0 flex-1 pr-5">
          <div className="flex items-center gap-2">
            <p className="font-medium leading-none transition-colors group-hover:text-primary">
              {tool.name}
            </p>
            {count != null && count > 0 && (
              <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {formatCount(count)}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {tool.description}
          </p>
        </div>
      </Link>

      <FavoriteButton slug={tool.slug} />
    </div>
  )
}
