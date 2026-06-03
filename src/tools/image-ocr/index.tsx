'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { OCR_LANGS, validateImageFile, formatConfidence, formatProgress } from './logic'

export default function ImageOcr() {
  const [preview, setPreview] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [confidence, setConfidence] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setText('')
    setConfidence(null)
    setProgress(0)
    setError('')
  }

  const handleFile = (f: File) => {
    const validationError = validateImageFile(f)
    if (validationError) {
      setError(validationError)
      return
    }
    reset()
    setFile(f)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string ?? '')
    reader.readAsDataURL(f)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  const recognize = async () => {
    if (!file) return
    reset()
    setRunning(true)
    try {
      const Tesseract = (await import('tesseract.js')).default
      const result = await Tesseract.recognize(file, OCR_LANGS, {
        logger: m => {
          if (m.status === 'recognizing text') setProgress(formatProgress(m.progress))
        },
      })
      setText(result.data.text.trim())
      setConfidence(result.data.confidence)
    } catch (err) {
      setError(err instanceof Error ? err.message : '识别失败')
    } finally {
      setRunning(false)
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const download = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ocr-result.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setPreview('')
    setFile(null)
    reset()
    if (inputRef.current) inputRef.current.value = ''
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
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" className="max-h-40 rounded object-contain" />
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              <p className="font-medium">点击或拖拽图片到此处</p>
              <p className="mt-1 text-xs">支持中英文识别，图片不会上传，全程本地处理</p>
            </div>
          )}
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        {preview && (
          <div className="flex gap-2">
            <Button onClick={recognize} disabled={running}>
              {running ? '识别中…' : '开始识别'}
            </Button>
            <Button variant="outline" onClick={clearAll} disabled={running}>清除</Button>
          </div>
        )}

        {running && (
          <div className="space-y-1.5">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">识别进度 {progress}%（首次需下载语言包，请稍候）</p>
          </div>
        )}

        {text !== '' && !running && (
          <div className="space-y-3">
            {confidence !== null && (
              <p className="text-xs text-muted-foreground">
                整体置信度：<span className="font-mono">{formatConfidence(confidence)}</span>
              </p>
            )}
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">识别结果</p>
              <Textarea readOnly value={text} className="min-h-[160px] text-sm" />
            </div>
            <div className="flex gap-2">
              <Button onClick={copy}>{copied ? '已复制！' : '复制文本'}</Button>
              <Button variant="outline" onClick={download}>下载 .txt</Button>
            </div>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
