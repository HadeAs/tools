'use client'

import ReactMarkdown from 'react-markdown'
import { usePersistedState } from '@/hooks/use-persisted-state'
import remarkGfm from 'remark-gfm'
import { Textarea } from '@/components/ui/textarea'
import { ToolErrorBoundary } from '@/components/error-boundary'

const EXAMPLE = `# Markdown 预览示例

这是 **粗体**，这是 _斜体_，这是 ~~删除线~~。

## 支持的语法

- [x] GFM 任务列表
- [x] 表格
- [x] 代码块
- [ ] 待完成事项

## 代码示例

\`\`\`ts
function greet(name: string): string {
  return \`你好，\${name}！\`
}
\`\`\`

## 表格

| 工具 | 分类 | 说明 |
|------|------|------|
| JSON 格式化 | 开发者 | 格式化与验证 |
| 哈希生成器 | 编码 | MD5 / SHA-256 |
| 二维码 | 编码 | 生成与下载 |

> 提示：在左侧编辑 Markdown，右侧实时预览渲染效果。
`

export default function MarkdownPreview() {
  const [input, setInput] = usePersistedState('tool:markdown-preview:input', EXAMPLE)

  return (
    <ToolErrorBoundary>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Markdown 源码</p>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="min-h-[400px] font-mono text-sm" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">预览</p>
          <div className="min-h-[400px] rounded-md border bg-background p-4 prose prose-sm dark:prose-invert max-w-none overflow-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{input}</ReactMarkdown>
          </div>
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
