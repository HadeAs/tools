'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

function CoffeeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  )
}

export function DonationFloat() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-xl animate-fade-up">
          <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3">
            <div>
              <p className="font-mono text-sm font-bold tracking-tight">支持一下</p>
              <p className="text-xs text-muted-foreground">扫码请作者喝杯咖啡</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
              aria-label="关闭"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-3">
            <div className="overflow-hidden rounded-xl border">
              <Image src="/pay.png" alt="收款码" width={180} height={194} className="w-44 object-cover" />
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(v => !v)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
        aria-label="打赏"
        title="支持作者"
      >
        <CoffeeIcon className="h-5 w-5" />
      </button>
    </div>
  )
}
