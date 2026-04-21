import type { ComponentType } from 'react'

type ToolComponentModule = { default: ComponentType }

export const toolComponents: Record<string, () => Promise<ToolComponentModule>> = {
  'json-formatter': () => import('./json-formatter'),
  'base64': () => import('./base64'),
  'url-encoder': () => import('./url-encoder'),
  'regex-tester': () => import('./regex-tester'),
  'timestamp': () => import('./timestamp'),
  'markdown-preview': () => import('./markdown-preview'),
  'word-counter': () => import('./word-counter'),
  'text-diff': () => import('./text-diff'),
  'case-converter': () => import('./case-converter'),
  'hash-generator': () => import('./hash-generator'),
  'jwt-decoder': () => import('./jwt-decoder'),
  'qr-generator': () => import('./qr-generator'),
  'color-converter': () => import('./color-converter'),
}
