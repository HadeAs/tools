import {
  Code2, Key, Link, Regex, Clock,
  Eye, AlignLeft, FileText, CaseSensitive,
  Lock, Hash as HashIcon, QrCode, Palette,
} from 'lucide-react'
import type { ComponentType } from 'react'

export type ToolCategory = 'developer' | 'text' | 'encoding' | 'conversion'

export type ToolMeta = {
  slug: string
  name: string
  description: string
  category: ToolCategory
  icon: ComponentType<{ className?: string }>
}

export const tools: ToolMeta[] = [
  { slug: 'json-formatter', name: 'JSON Formatter', description: 'Format, minify, and validate JSON', category: 'developer', icon: Code2 },
  { slug: 'base64', name: 'Base64', description: 'Encode and decode Base64 strings', category: 'developer', icon: Key },
  { slug: 'url-encoder', name: 'URL Encoder', description: 'Encode and decode URL components', category: 'developer', icon: Link },
  { slug: 'regex-tester', name: 'Regex Tester', description: 'Test regular expressions with match highlighting', category: 'developer', icon: Regex },
  { slug: 'timestamp', name: 'Timestamp', description: 'Convert Unix timestamps to human-readable dates', category: 'developer', icon: Clock },
  { slug: 'markdown-preview', name: 'Markdown Preview', description: 'Live preview Markdown as rendered HTML', category: 'text', icon: Eye },
  { slug: 'word-counter', name: 'Word Counter', description: 'Count words, characters, and lines', category: 'text', icon: AlignLeft },
  { slug: 'text-diff', name: 'Text Diff', description: 'Compare two texts and highlight differences', category: 'text', icon: FileText },
  { slug: 'case-converter', name: 'Case Converter', description: 'Convert text between camelCase, snake_case, PascalCase, and more', category: 'text', icon: CaseSensitive },
  { slug: 'hash-generator', name: 'Hash Generator', description: 'Generate MD5, SHA-1, and SHA-256 hashes', category: 'encoding', icon: Lock },
  { slug: 'jwt-decoder', name: 'JWT Decoder', description: 'Decode and inspect JWT tokens', category: 'encoding', icon: HashIcon },
  { slug: 'qr-generator', name: 'QR Code Generator', description: 'Generate QR codes from any text or URL', category: 'encoding', icon: QrCode },
  { slug: 'color-converter', name: 'Color Converter', description: 'Convert colors between HEX, RGB, and HSL formats', category: 'conversion', icon: Palette },
]

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return tools.find(t => t.slug === slug)
}

export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return tools.filter(t => t.category === category)
}

export function getRelatedTools(currentSlug: string, count = 4): ToolMeta[] {
  const current = getToolBySlug(currentSlug)
  if (!current) return []
  const sameCategory = tools.filter(t => t.slug !== currentSlug && t.category === current.category)
  const result = sameCategory.slice(0, count)
  if (result.length < 2) {
    const others = tools.filter(t => t.slug !== currentSlug && t.category !== current.category)
    result.push(...others.slice(0, count - result.length))
  }
  return result.slice(0, count)
}

export const categoryLabels: Record<ToolCategory, string> = {
  developer: 'Developer Tools',
  text: 'Text Processing',
  encoding: 'Encoding & Crypto',
  conversion: 'Conversion',
}
