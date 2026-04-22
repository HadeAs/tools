'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const loading = () => <Skeleton className="h-64 w-full" />

const dynamicTools: Record<string, ComponentType> = {
  'json-formatter': dynamic(() => import('@/tools/json-formatter'), { ssr: false, loading }),
  'base64': dynamic(() => import('@/tools/base64'), { ssr: false, loading }),
  'url-encoder': dynamic(() => import('@/tools/url-encoder'), { ssr: false, loading }),
  'regex-tester': dynamic(() => import('@/tools/regex-tester'), { ssr: false, loading }),
  'timestamp': dynamic(() => import('@/tools/timestamp'), { ssr: false, loading }),
  'markdown-preview': dynamic(() => import('@/tools/markdown-preview'), { ssr: false, loading }),
  'word-counter': dynamic(() => import('@/tools/word-counter'), { ssr: false, loading }),
  'text-diff': dynamic(() => import('@/tools/text-diff'), { ssr: false, loading }),
  'case-converter': dynamic(() => import('@/tools/case-converter'), { ssr: false, loading }),
  'hash-generator': dynamic(() => import('@/tools/hash-generator'), { ssr: false, loading }),
  'jwt-decoder': dynamic(() => import('@/tools/jwt-decoder'), { ssr: false, loading }),
  'qr-generator': dynamic(() => import('@/tools/qr-generator'), { ssr: false, loading }),
  'color-converter': dynamic(() => import('@/tools/color-converter'), { ssr: false, loading }),
  'uuid-generator': dynamic(() => import('@/tools/uuid-generator'), { ssr: false, loading }),
  'number-base': dynamic(() => import('@/tools/number-base'), { ssr: false, loading }),
  'cron-parser':        dynamic(() => import('@/tools/cron-parser'),        { ssr: false, loading }),
  'password-generator': dynamic(() => import('@/tools/password-generator'), { ssr: false, loading }),
  'html-entities':      dynamic(() => import('@/tools/html-entities'),      { ssr: false, loading }),
  'json-csv':           dynamic(() => import('@/tools/json-csv'),           { ssr: false, loading }),
  'image-base64':       dynamic(() => import('@/tools/image-base64'),       { ssr: false, loading }),
  'css-units':          dynamic(() => import('@/tools/css-units'),          { ssr: false, loading }),
  'lorem-ipsum':        dynamic(() => import('@/tools/lorem-ipsum'),        { ssr: false, loading }),
}

export function DynamicTool({ slug }: { slug: string }) {
  const Component = dynamicTools[slug]
  if (!Component) return null
  return <Component />
}
