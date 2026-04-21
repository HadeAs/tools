'use client'

import { useState } from 'react'
import { Link } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CopyLink() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button variant="outline" size="sm" onClick={copy} className="gap-1.5">
      <Link className="h-3.5 w-3.5" />
      {copied ? '已复制！' : '复制链接'}
    </Button>
  )
}
