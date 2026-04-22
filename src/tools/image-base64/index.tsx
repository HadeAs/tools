'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { getMimeType, getApproxSize, formatSize } from './logic'

export default function ImageBase64() {
  const [dataUrl, setDataUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = e => setDataUrl(e.target?.result as string ?? '')
    reader.readAsDataURL(file)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith('image/')) handleFile(file)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(dataUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/50 hover:bg-muted/60"
        >
          <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl} alt="preview" className="max-h-40 rounded object-contain" />
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              <p className="font-medium">点击或拖拽图片到此处</p>
              <p className="mt-1 text-xs">支持 PNG、JPG、GIF、WebP、SVG</p>
            </div>
          )}
        </div>

        {dataUrl && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span>类型：<code className="font-mono">{getMimeType(dataUrl)}</code></span>
              <span>大小：{formatSize(getApproxSize(dataUrl))}</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Data URL</p>
              <Textarea readOnly value={dataUrl} className="min-h-[120px] font-mono text-xs" />
            </div>
            <div className="flex gap-2">
              <Button onClick={copy}>{copied ? '已复制！' : '复制 Data URL'}</Button>
              <Button variant="outline" onClick={() => { setDataUrl(''); if (inputRef.current) inputRef.current.value = '' }}>清除</Button>
            </div>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
