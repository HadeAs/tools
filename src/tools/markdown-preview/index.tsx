'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Textarea } from '@/components/ui/textarea'
import { ToolErrorBoundary } from '@/components/error-boundary'

const EXAMPLE = `# Hello, Markdown!

This is **bold** and this is _italic_.

## Features

- [x] GFM task lists
- [x] Tables
- [x] Fenced code blocks

\`\`\`js
console.log('Hello, World!')
\`\`\`

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
`

export default function MarkdownPreview() {
  const [input, setInput] = useState(EXAMPLE)

  return (
    <ToolErrorBoundary>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Markdown</p>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="min-h-[400px] font-mono text-sm" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Preview</p>
          <div className="min-h-[400px] rounded-md border bg-background p-4 prose prose-sm dark:prose-invert max-w-none overflow-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{input}</ReactMarkdown>
          </div>
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
