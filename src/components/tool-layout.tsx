import { ToolErrorBoundary } from './error-boundary'

interface ToolLayoutProps {
  children?: React.ReactNode
  input: React.ReactNode
  output: React.ReactNode
  actions?: React.ReactNode
}

export function ToolLayout({ children, input, output, actions }: ToolLayoutProps) {
  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        {children}
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Input</p>
            {input}
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Output</p>
            {output}
          </div>
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
