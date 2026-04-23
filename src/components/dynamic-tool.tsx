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
  'yaml-json':          dynamic(() => import('@/tools/yaml-json'),          { ssr: false, loading }),
  'url-parser':         dynamic(() => import('@/tools/url-parser'),         { ssr: false, loading }),
  'line-tools':         dynamic(() => import('@/tools/line-tools'),         { ssr: false, loading }),
  'http-status':        dynamic(() => import('@/tools/http-status'),        { ssr: false, loading }),
  'unit-converter':     dynamic(() => import('@/tools/unit-converter'),     { ssr: false, loading }),
  'date-diff':          dynamic(() => import('@/tools/date-diff'),          { ssr: false, loading }),
  'date-add':           dynamic(() => import('@/tools/date-add'),           { ssr: false, loading }),
  'age-calculator':     dynamic(() => import('@/tools/age-calculator'),     { ssr: false, loading }),
  'json-diff':          dynamic(() => import('@/tools/json-diff'),          { ssr: false, loading }),
  'jwt-generator':      dynamic(() => import('@/tools/jwt-generator'),      { ssr: false, loading }),
  'aes-crypto':         dynamic(() => import('@/tools/aes-crypto'),         { ssr: false, loading }),
  'timezone':           dynamic(() => import('@/tools/timezone'),           { ssr: false, loading }),
  'gradient-generator': dynamic(() => import('@/tools/gradient-generator'), { ssr: false, loading }),
  'sql-formatter':      dynamic(() => import('@/tools/sql-formatter'),      { ssr: false, loading }),
  'box-shadow':         dynamic(() => import('@/tools/box-shadow'),         { ssr: false, loading }),
  'border-radius':      dynamic(() => import('@/tools/border-radius'),      { ssr: false, loading }),
  'clip-path':          dynamic(() => import('@/tools/clip-path'),          { ssr: false, loading }),
  'css-transform':      dynamic(() => import('@/tools/css-transform'),      { ssr: false, loading }),
  'pinyin':             dynamic(() => import('@/tools/pinyin'),             { ssr: false, loading }),
  'simp-trad':          dynamic(() => import('@/tools/simp-trad'),          { ssr: false, loading }),
  'number-zh':          dynamic(() => import('@/tools/number-zh'),          { ssr: false, loading }),
  'image-editor':       dynamic(() => import('@/tools/image-editor'),       { ssr: false, loading }),
}

export function DynamicTool({ slug }: { slug: string }) {
  const Component = dynamicTools[slug]
  if (!Component) return null
  return <Component />
}
