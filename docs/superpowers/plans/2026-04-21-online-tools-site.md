# Online Developer Tools Site — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public-facing online developer tools website with 13 browser-based tools, deployed on Vercel.

**Architecture:** Next.js 15 App Router with SSG for each tool page. A central registry holds tool metadata; a separate dynamic import map handles code splitting so each tool is only loaded when visited. All tools run client-side.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, next-themes, lucide-react, react-markdown, remark-gfm, diff, qrcode.react, crypto-js, @tailwindcss/typography, vitest, @testing-library/react

---

## Chunk 1: Project Setup & Core Infrastructure

### Task 1: Scaffold Next.js Project & Install Dependencies

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts` (via scaffold)
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Scaffold the project**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias
```

When prompted: "Would you like to use Turbopack for `next dev`?" → Yes

- [ ] **Step 2: Install additional dependencies**

```bash
npm install next-themes lucide-react react-markdown remark-gfm diff qrcode.react crypto-js @tailwindcss/typography
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom @types/diff
```

- [ ] **Step 3: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted: Default style, slate base color, CSS variables: yes.

```bash
npx shadcn@latest add button textarea badge tabs card input separator skeleton
```

- [ ] **Step 4: Create vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 5: Create test setup file**

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Add test scripts to package.json**

In `package.json`, add under `scripts`:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 7: Add path alias to tsconfig.json**

The `--no-import-alias` flag disables the `@` alias. Add it back manually. In `tsconfig.json`, under `compilerOptions`, add:
```json
"paths": {
  "@/*": ["./src/*"]
}
```

- [ ] **Step 8: Add @tailwindcss/typography to tailwind config**

In `tailwind.config.ts`, update plugins array:
```ts
plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
```

- [ ] **Step 9: Verify dev server starts**

```bash
npm run dev
```

Expected: Next.js dev server starts on http://localhost:3000 with no errors.

- [ ] **Step 10: Commit**

```bash
git add .
git commit -m "feat: scaffold Next.js 15 project with all dependencies"
```

---

### Task 2: Tool Registry & Component Map

**Files:**
- Create: `src/tools/registry.ts`
- Create: `src/tools/registry.test.ts`
- Create: `src/tools/components.ts`

- [ ] **Step 1: Write failing tests**

Create `src/tools/registry.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { tools, getToolBySlug, getToolsByCategory, getRelatedTools } from './registry'

describe('registry', () => {
  it('has no duplicate slugs', () => {
    const slugs = tools.map(t => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('getToolBySlug returns correct tool', () => {
    const tool = getToolBySlug('json-formatter')
    expect(tool?.name).toBe('JSON Formatter')
  })

  it('getToolBySlug returns undefined for unknown slug', () => {
    expect(getToolBySlug('nonexistent')).toBeUndefined()
  })

  it('getToolsByCategory returns only tools in that category', () => {
    const devTools = getToolsByCategory('developer')
    expect(devTools.every(t => t.category === 'developer')).toBe(true)
    expect(devTools.length).toBeGreaterThan(0)
  })

  it('getRelatedTools returns up to 4 tools excluding current', () => {
    const related = getRelatedTools('json-formatter')
    expect(related.length).toBeLessThanOrEqual(4)
    expect(related.find(t => t.slug === 'json-formatter')).toBeUndefined()
  })

  it('getRelatedTools fills from other categories when same category has fewer than 2', () => {
    const related = getRelatedTools('color-converter')
    expect(related.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/tools/registry.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create the registry**

Create `src/tools/registry.ts`:

```ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/tools/registry.test.ts
```

Expected: All 6 tests PASS.

- [ ] **Step 5: Create the dynamic component map**

Note: `components.ts` contains only import declarations — no logic to unit-test. It is verified implicitly when tool pages load in the browser (Task 7 Step 3).

Create `src/tools/components.ts`:

```ts
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
```

- [ ] **Step 6: Commit**

```bash
git add src/tools/registry.ts src/tools/registry.test.ts src/tools/components.ts src/test/
git commit -m "feat: add tool registry, component map, and registry tests"
```

---

### Task 3: Root Layout, Header & Theme

**Files:**
- Create: `src/components/theme-toggle.tsx`
- Create: `src/components/header.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create ThemeToggle component**

Create `src/components/theme-toggle.tsx`:

```tsx
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
```

- [ ] **Step 2: Create Header component**

Create `src/components/header.tsx`:

```tsx
import Link from 'next/link'
import { Github, Wrench } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Wrench className="h-5 w-5" />
          <span>DevTools</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Update root layout**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Header } from '@/components/header'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'DevTools — Online Developer Tools', template: '%s | DevTools' },
  description: 'A collection of free online tools for developers.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Open http://localhost:3000. Verify:
- Header is sticky and visible on all routes
- Theme toggle switches between dark and light mode
- After toggling and refreshing the page, the selected theme is restored (no flash of wrong theme)

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/components/header.tsx src/components/theme-toggle.tsx
git commit -m "feat: add root layout with ThemeProvider, header, and theme toggle"
```

---

### Task 4: Error Boundary

**Files:**
- Create: `src/components/error-boundary.tsx`

- [ ] **Step 1: Create ToolErrorBoundary**

Create `src/components/error-boundary.tsx`:

```tsx
'use client'

import { Component, ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ToolErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-sm text-destructive">Something went wrong. Please refresh and try again.</p>
        </div>
      )
    }
    return this.props.children
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/error-boundary.tsx
git commit -m "feat: add ToolErrorBoundary component"
```

---

## Chunk 2: Shared UI Components, Homepage & Tool Page Shell

### Task 5: ToolCard & ToolLayout Components

**Files:**
- Create: `src/components/tool-card.tsx`
- Create: `src/components/tool-layout.tsx`

- [ ] **Step 1: Create ToolCard**

Create `src/components/tool-card.tsx`:

```tsx
import Link from 'next/link'
import type { ToolMeta } from '@/tools/registry'

interface ToolCardProps {
  tool: ToolMeta
  compact?: boolean
}

export function ToolCard({ tool, compact = false }: ToolCardProps) {
  const Icon = tool.icon
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex items-start gap-3 rounded-lg border bg-card p-4 text-card-foreground transition-colors hover:border-primary/50 hover:bg-accent"
    >
      <div className="mt-0.5 rounded-md bg-primary/10 p-1.5">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="font-medium leading-none group-hover:text-primary">{tool.name}</p>
        {!compact && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
        )}
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Create ToolLayout**

Create `src/components/tool-layout.tsx`:

```tsx
import { ToolErrorBoundary } from './error-boundary'

interface ToolLayoutProps {
  children?: React.ReactNode
  input: React.ReactNode
  output: React.ReactNode
  actions?: React.ReactNode
}

export function ToolLayout({ children, input, output, actions }: ToolLayoutProps) {
  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        {children}
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Input</p>
            {input}
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Output</p>
            {output}
          </div>
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/tool-card.tsx src/components/tool-layout.tsx
git commit -m "feat: add ToolCard and ToolLayout components"
```

---

### Task 6: Homepage

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/search-bar.tsx`

- [ ] **Step 1: Create SearchBar**

Create `src/components/search-bar.tsx`:

```tsx
'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search tools..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  )
}
```

- [ ] **Step 2: Create Homepage**

Replace `src/app/page.tsx`:

```tsx
'use client'

import { useState, useMemo } from 'react'
import { tools, categoryLabels, type ToolCategory } from '@/tools/registry'
import { ToolCard } from '@/components/tool-card'
import { SearchBar } from '@/components/search-bar'

const categories: ToolCategory[] = ['developer', 'text', 'encoding', 'conversion']

export default function HomePage() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return tools
    const q = search.toLowerCase()
    return tools.filter(t =>
      t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    )
  }, [search])

  const grouped = useMemo(() =>
    categories
      .map(cat => ({ category: cat, label: categoryLabels[cat], tools: filtered.filter(t => t.category === cat) }))
      .filter(g => g.tools.length > 0),
    [filtered]
  )

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Developer Tools</h1>
        <p className="text-muted-foreground">A collection of free browser-based tools for developers.</p>
      </div>
      <div className="mb-8 max-w-sm">
        <SearchBar value={search} onChange={setSearch} />
      </div>
      {grouped.length === 0 ? (
        <p className="text-muted-foreground">No tools match &quot;{search}&quot;.</p>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ category, label, tools }) => (
            <section key={category}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{label}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify homepage in browser**

```bash
npm run dev
```

Open http://localhost:3000. Verify: 4 categories, 13 tool cards, search filters in real time.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/components/search-bar.tsx
git commit -m "feat: add homepage with tool grid and real-time search"
```

---

### Task 7: Tool Page Shell

**Files:**
- Create: `src/app/tools/layout.tsx`
- Create: `src/components/dynamic-tool.tsx`
- Create: `src/app/tools/[slug]/page.tsx`

Note: `React.lazy` is not available in Next.js App Router server components. Tool components are loaded via `next/dynamic` inside a dedicated client wrapper (`dynamic-tool.tsx`). The page itself stays a server component so `generateMetadata` and `generateStaticParams` work correctly.

- [ ] **Step 1: Create tools layout**

Create `src/app/tools/layout.tsx`:

```tsx
export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Create DynamicTool client component**

Create `src/components/dynamic-tool.tsx`:

```tsx
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
}

export function DynamicTool({ slug }: { slug: string }) {
  const Component = dynamicTools[slug]
  if (!Component) return null
  return <Component />
}
```

Note: `components.ts` (from Task 2) is no longer needed since `dynamic-tool.tsx` consolidates the import map. Delete or leave it unused — it won't be imported anywhere.

- [ ] **Step 3: Create tool page (server component)**

Create `src/app/tools/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { tools, getToolBySlug, getRelatedTools, categoryLabels } from '@/tools/registry'
import { DynamicTool } from '@/components/dynamic-tool'
import { ToolCard } from '@/components/tool-card'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return tools.map(t => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return {}
  return {
    title: tool.name,
    description: tool.description,
    openGraph: { title: `${tool.name} | DevTools`, description: tool.description },
  }
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) notFound()

  const related = getRelatedTools(slug)
  const Icon = tool.icon

  return (
    <div className="space-y-8">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <span>{categoryLabels[tool.category]}</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{tool.name}</span>
      </nav>

      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{tool.name}</h1>
          <p className="text-muted-foreground">{tool.description}</p>
        </div>
      </div>

      <DynamicTool slug={slug} />

      {related.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Related Tools</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map(t => <ToolCard key={t.slug} tool={t} compact />)}
          </div>
        </section>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Verify tool page loads correctly**

```bash
npm run dev
```

Navigate to http://localhost:3000/tools/json-formatter. Verify: breadcrumb shows "Home → Developer Tools → JSON Formatter", tool UI loads after skeleton, related tools appear below.

- [ ] **Step 5: Commit**

```bash
git add src/app/tools/ src/components/dynamic-tool.tsx
git commit -m "feat: add tool page shell with SSG, metadata, and dynamic tool loading"
```

---

## Chunk 3: Developer Tools (5 tools)

### Task 8: JSON Formatter

**Files:**
- Create: `src/tools/json-formatter/logic.ts`
- Create: `src/tools/json-formatter/logic.test.ts`
- Create: `src/tools/json-formatter/index.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/tools/json-formatter/logic.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { formatJSON, minifyJSON, validateJSON } from './logic'

describe('formatJSON', () => {
  it('formats valid JSON', () => expect(formatJSON('{"a":1}')).toBe('{\n  "a": 1\n}'))
  it('throws on invalid JSON', () => expect(() => formatJSON('not json')).toThrow())
})

describe('minifyJSON', () => {
  it('minifies formatted JSON', () => expect(minifyJSON('{\n  "a": 1\n}')).toBe('{"a":1}'))
})

describe('validateJSON', () => {
  it('returns true for valid JSON', () => expect(validateJSON('{"a":1}')).toBe(true))
  it('returns false for invalid JSON', () => expect(validateJSON('bad')).toBe(false))
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/tools/json-formatter/logic.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement logic**

Create `src/tools/json-formatter/logic.ts`:

```ts
export function formatJSON(input: string): string {
  return JSON.stringify(JSON.parse(input), null, 2)
}

export function minifyJSON(input: string): string {
  return JSON.stringify(JSON.parse(input))
}

export function validateJSON(input: string): boolean {
  try { JSON.parse(input); return true } catch { return false }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/tools/json-formatter/logic.test.ts
```

Expected: All 4 tests PASS.

- [ ] **Step 5: Implement UI component**

Create `src/tools/json-formatter/index.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ToolLayout } from '@/components/tool-layout'
import { formatJSON, minifyJSON, validateJSON } from './logic'

const EXAMPLE = '{"name":"DevTools","version":"1.0","features":["format","minify","validate"]}'

export default function JSONFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handle = (fn: (s: string) => string) => {
    try { setOutput(fn(input)); setError('') }
    catch (e) { setError((e as Error).message); setOutput('') }
  }

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const isValid = input ? validateJSON(input) : null

  return (
    <ToolLayout
      input={
        <div className="space-y-2">
          <Textarea
            placeholder="Paste JSON here..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="min-h-[240px] font-mono text-sm"
          />
          {isValid !== null && (
            <Badge variant={isValid ? 'default' : 'destructive'}>
              {isValid ? 'Valid JSON' : 'Invalid JSON'}
            </Badge>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      }
      output={
        <Textarea readOnly value={output} className="min-h-[240px] font-mono text-sm" placeholder="Output appears here..." />
      }
      actions={
        <>
          <Button onClick={() => handle(formatJSON)} disabled={!input}>Format</Button>
          <Button variant="outline" onClick={() => handle(minifyJSON)} disabled={!input}>Minify</Button>
          <Button variant="outline" onClick={copyOutput} disabled={!output}>{copied ? 'Copied!' : 'Copy'}</Button>
          <Button variant="ghost" onClick={() => setInput(EXAMPLE)}>Load Example</Button>
          <Button variant="ghost" onClick={() => { setInput(''); setOutput(''); setError('') }}>Clear</Button>
        </>
      }
    />
  )
}
```

- [ ] **Step 6: Verify tool in browser**

Navigate to http://localhost:3000/tools/json-formatter. Paste `{"a":1}`, click Format. Verify formatted output. Try invalid JSON, verify error badge.

- [ ] **Step 7: Commit**

```bash
git add src/tools/json-formatter/
git commit -m "feat: add JSON Formatter tool"
```

---

### Task 9: Base64 Encoder/Decoder

**Files:**
- Create: `src/tools/base64/logic.ts`
- Create: `src/tools/base64/logic.test.ts`
- Create: `src/tools/base64/index.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/tools/base64/logic.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { encode, decode } from './logic'

describe('base64', () => {
  it('encodes a string', () => expect(encode('Hello')).toBe('SGVsbG8='))
  it('decodes a base64 string', () => expect(decode('SGVsbG8=')).toBe('Hello'))
  it('round-trips correctly', () => {
    const original = 'Developer Tools 123!@#'
    expect(decode(encode(original))).toBe(original)
  })
  it('throws on invalid base64', () => expect(() => decode('not!valid@base64#')).toThrow())
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/tools/base64/logic.test.ts
```

- [ ] **Step 3: Implement logic**

Create `src/tools/base64/logic.ts`:

```ts
export function encode(input: string): string {
  return btoa(unescape(encodeURIComponent(input)))
}

export function decode(input: string): string {
  try { return decodeURIComponent(escape(atob(input))) }
  catch { throw new Error('Invalid Base64 string') }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/tools/base64/logic.test.ts
```

- [ ] **Step 5: Implement UI component**

Create `src/tools/base64/index.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ToolLayout } from '@/components/tool-layout'
import { encode, decode } from './logic'

const EXAMPLE = 'Hello, World!'

export default function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handle = (fn: (s: string) => string) => {
    try { setOutput(fn(input)); setError('') }
    catch (e) { setError((e as Error).message); setOutput('') }
  }

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolLayout
      input={
        <div className="space-y-2">
          <Textarea
            placeholder="Enter text or Base64..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      }
      output={
        <Textarea readOnly value={output} className="min-h-[200px] font-mono text-sm" placeholder="Output appears here..." />
      }
      actions={
        <>
          <Button onClick={() => handle(encode)} disabled={!input}>Encode</Button>
          <Button variant="outline" onClick={() => handle(decode)} disabled={!input}>Decode</Button>
          <Button variant="outline" onClick={copyOutput} disabled={!output}>{copied ? 'Copied!' : 'Copy'}</Button>
          <Button variant="ghost" onClick={() => setInput(EXAMPLE)}>Load Example</Button>
          <Button variant="ghost" onClick={() => { setInput(''); setOutput(''); setError('') }}>Clear</Button>
        </>
      }
    />
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/tools/base64/
git commit -m "feat: add Base64 encoder/decoder tool"
```

---

### Task 10: URL Encoder/Decoder

**Files:**
- Create: `src/tools/url-encoder/logic.ts`
- Create: `src/tools/url-encoder/logic.test.ts`
- Create: `src/tools/url-encoder/index.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/tools/url-encoder/logic.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { encodeURL, decodeURL } from './logic'

describe('url-encoder', () => {
  it('encodes spaces', () => expect(encodeURL('hello world')).toBe('hello%20world'))
  it('decodes encoded string', () => expect(decodeURL('hello%20world')).toBe('hello world'))
  it('encodes special characters', () => expect(encodeURL('a=1&b=2')).toBe('a%3D1%26b%3D2'))
  it('round-trips correctly', () => {
    const original = 'https://example.com/path?q=hello world&foo=bar'
    expect(decodeURL(encodeURL(original))).toBe(original)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/tools/url-encoder/logic.test.ts
```

- [ ] **Step 3: Implement logic**

Create `src/tools/url-encoder/logic.ts`:

```ts
export function encodeURL(input: string): string {
  return encodeURIComponent(input)
}

export function decodeURL(input: string): string {
  return decodeURIComponent(input)
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/tools/url-encoder/logic.test.ts
```

- [ ] **Step 5: Implement UI**

Create `src/tools/url-encoder/index.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ToolLayout } from '@/components/tool-layout'
import { encodeURL, decodeURL } from './logic'

const EXAMPLE = 'https://example.com/search?q=hello world&lang=en'

export default function URLEncoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handle = (fn: (s: string) => string) => {
    try { setOutput(fn(input)); setError('') }
    catch (e) { setError((e as Error).message); setOutput('') }
  }

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolLayout
      input={
        <div className="space-y-2">
          <Textarea
            placeholder="Enter URL or encoded string..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      }
      output={
        <Textarea readOnly value={output} className="min-h-[200px] font-mono text-sm" placeholder="Output appears here..." />
      }
      actions={
        <>
          <Button onClick={() => handle(encodeURL)} disabled={!input}>Encode</Button>
          <Button variant="outline" onClick={() => handle(decodeURL)} disabled={!input}>Decode</Button>
          <Button variant="outline" onClick={copyOutput} disabled={!output}>{copied ? 'Copied!' : 'Copy'}</Button>
          <Button variant="ghost" onClick={() => setInput(EXAMPLE)}>Load Example</Button>
          <Button variant="ghost" onClick={() => { setInput(''); setOutput(''); setError('') }}>Clear</Button>
        </>
      }
    />
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/tools/url-encoder/
git commit -m "feat: add URL encoder/decoder tool"
```

---

### Task 11: Regex Tester

**Files:**
- Create: `src/tools/regex-tester/logic.ts`
- Create: `src/tools/regex-tester/logic.test.ts`
- Create: `src/tools/regex-tester/index.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/tools/regex-tester/logic.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { testRegex } from './logic'

describe('testRegex', () => {
  it('returns matches for a simple pattern', () => {
    const result = testRegex('\\d+', 'abc 123 def 456', 'g')
    expect(result.matches).toEqual(['123', '456'])
  })
  it('returns empty array when no matches', () => {
    expect(testRegex('xyz', 'abc', 'g').matches).toEqual([])
  })
  it('returns an error for invalid regex', () => {
    expect(testRegex('[invalid', 'test', 'g').error).toBeTruthy()
  })
  it('returns match indices', () => {
    expect(testRegex('a', 'banana', 'g').indices).toEqual([1, 3, 5])
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/tools/regex-tester/logic.test.ts
```

- [ ] **Step 3: Implement logic**

Create `src/tools/regex-tester/logic.ts`:

```ts
export type RegexResult = {
  matches: string[]
  indices: number[]
  error?: string
}

export function testRegex(pattern: string, input: string, flags: string): RegexResult {
  try {
    const globalFlags = flags.includes('g') ? flags : flags + 'g'
    const regex = new RegExp(pattern, globalFlags)
    const matches: string[] = []
    const indices: number[] = []
    let m: RegExpExecArray | null
    while ((m = regex.exec(input)) !== null) {
      matches.push(m[0])
      indices.push(m.index)
    }
    return { matches, indices }
  } catch (e) {
    return { matches: [], indices: [], error: (e as Error).message }
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/tools/regex-tester/logic.test.ts
```

- [ ] **Step 5: Implement UI**

Create `src/tools/regex-tester/index.tsx`:

```tsx
'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { testRegex } from './logic'

const EXAMPLE_PATTERN = '\\b\\w+@\\w+\\.\\w+\\b'
const EXAMPLE_INPUT = 'Contact us at hello@example.com or support@devtools.io'

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [input, setInput] = useState('')

  const result = useMemo(() => {
    if (!pattern || !input) return null
    return testRegex(pattern, input, flags)
  }, [pattern, flags, input])

  const highlighted = useMemo(() => {
    if (!result || result.error || result.indices.length === 0) return input
    let offset = 0
    let out = input
    result.matches.forEach((match, i) => {
      const idx = result.indices[i] + offset
      const tag = `<mark class="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">${match}</mark>`
      out = out.slice(0, idx) + tag + out.slice(idx + match.length)
      offset += tag.length - match.length
    })
    return out
  }, [result, input])

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pattern</label>
            <Input value={pattern} onChange={e => setPattern(e.target.value)} placeholder="e.g. \d+" className="font-mono" />
          </div>
          <div className="w-24 space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Flags</label>
            <Input value={flags} onChange={e => setFlags(e.target.value)} placeholder="g, i, m" className="font-mono" />
          </div>
        </div>

        {result?.error && <p className="text-xs text-destructive">{result.error}</p>}

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Test String</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to test against..." className="min-h-[140px] font-mono text-sm" />
        </div>

        {input && result && !result.error && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Matches</span>
              <Badge variant={result.matches.length > 0 ? 'default' : 'secondary'}>{result.matches.length}</Badge>
            </div>
            <div
              className="rounded-md border bg-muted/50 p-3 font-mono text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </div>
        )}

        <Button variant="ghost" size="sm" onClick={() => { setPattern(EXAMPLE_PATTERN); setInput(EXAMPLE_INPUT) }}>
          Load Example
        </Button>
      </div>
    </ToolErrorBoundary>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/tools/regex-tester/
git commit -m "feat: add Regex Tester tool"
```

---

### Task 12: Timestamp Converter

**Files:**
- Create: `src/tools/timestamp/logic.ts`
- Create: `src/tools/timestamp/logic.test.ts`
- Create: `src/tools/timestamp/index.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/tools/timestamp/logic.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { unixToDate, dateToUnix, nowUnix } from './logic'

describe('timestamp', () => {
  it('converts unix 0 to 1970 ISO date', () => expect(unixToDate(0)).toContain('1970-01-01'))
  it('converts ISO date to unix', () => expect(dateToUnix('1970-01-01T00:00:00Z')).toBe(0))
  it('nowUnix is close to current time', () => {
    const now = Math.floor(Date.now() / 1000)
    expect(Math.abs(nowUnix() - now)).toBeLessThan(2)
  })
  it('throws on invalid date string', () => expect(() => dateToUnix('not-a-date')).toThrow())
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/tools/timestamp/logic.test.ts
```

- [ ] **Step 3: Implement logic**

Create `src/tools/timestamp/logic.ts`:

```ts
export function unixToDate(unix: number): string {
  return new Date(unix * 1000).toISOString()
}

export function dateToUnix(dateStr: string): number {
  const ts = new Date(dateStr).getTime()
  if (isNaN(ts)) throw new Error('Invalid date')
  return Math.floor(ts / 1000)
}

export function nowUnix(): number {
  return Math.floor(Date.now() / 1000)
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/tools/timestamp/logic.test.ts
```

- [ ] **Step 5: Implement UI**

Create `src/tools/timestamp/index.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { unixToDate, dateToUnix, nowUnix } from './logic'

export default function TimestampConverter() {
  const [unix, setUnix] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState('')

  const handleUnixToDate = () => {
    try { setDate(unixToDate(Number(unix))); setError('') }
    catch (e) { setError((e as Error).message) }
  }

  const handleDateToUnix = () => {
    try { setUnix(String(dateToUnix(date))); setError('') }
    catch (e) { setError((e as Error).message) }
  }

  return (
    <ToolErrorBoundary>
      <div className="max-w-lg space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Unix Timestamp</label>
          <div className="flex gap-2">
            <Input value={unix} onChange={e => setUnix(e.target.value)} placeholder="e.g. 1713700000" className="font-mono" type="number" />
            <Button onClick={handleUnixToDate} disabled={!unix}>→ Date</Button>
            <Button variant="outline" onClick={() => setUnix(String(nowUnix()))}>Now</Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date / ISO 8601</label>
          <div className="flex gap-2">
            <Input value={date} onChange={e => setDate(e.target.value)} placeholder="e.g. 2024-01-01T00:00:00Z" className="font-mono" />
            <Button onClick={handleDateToUnix} disabled={!date}>→ Unix</Button>
          </div>
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </ToolErrorBoundary>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/tools/timestamp/
git commit -m "feat: add Timestamp converter tool"
```

---

## Chunk 4: Text Processing & Remaining Tools

### Task 13: Markdown Preview

**Files:**
- Create: `src/tools/markdown-preview/index.tsx`

Note: No `logic.ts` or `logic.test.ts` — rendering is delegated entirely to `react-markdown`. Do not create an empty test file; vitest will collect it and fail on an empty suite.

- [ ] **Step 1: Implement UI**

Create `src/tools/markdown-preview/index.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify in browser**

Navigate to http://localhost:3000/tools/markdown-preview. Verify live preview renders GFM (task lists, tables, code blocks).

- [ ] **Step 3: Commit**

```bash
git add src/tools/markdown-preview/
git commit -m "feat: add Markdown Preview tool"
```

---

### Task 14: Word Counter

**Files:**
- Create: `src/tools/word-counter/logic.ts`
- Create: `src/tools/word-counter/logic.test.ts`
- Create: `src/tools/word-counter/index.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/tools/word-counter/logic.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { countStats } from './logic'

describe('countStats', () => {
  it('counts words', () => expect(countStats('hello world').words).toBe(2))
  it('counts characters', () => expect(countStats('hello').chars).toBe(5))
  it('counts lines', () => expect(countStats('a\nb\nc').lines).toBe(3))
  it('handles empty string', () => {
    expect(countStats('').words).toBe(0)
    expect(countStats('').chars).toBe(0)
  })
  it('counts sentences', () => expect(countStats('Hello. World!').sentences).toBe(2))
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/tools/word-counter/logic.test.ts
```

- [ ] **Step 3: Implement logic**

Create `src/tools/word-counter/logic.ts`:

```ts
export type TextStats = {
  words: number
  chars: number
  charsNoSpaces: number
  lines: number
  sentences: number
}

export function countStats(text: string): TextStats {
  return {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    lines: text.split('\n').length,
    sentences: text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0,
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/tools/word-counter/logic.test.ts
```

- [ ] **Step 5: Implement UI**

Create `src/tools/word-counter/index.tsx`:

```tsx
'use client'

import { useState, useMemo } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { countStats } from './logic'

export default function WordCounter() {
  const [text, setText] = useState('')
  const stats = useMemo(() => countStats(text), [text])

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <Textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          className="min-h-[300px] text-sm"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: 'Words', value: stats.words },
            { label: 'Characters', value: stats.chars },
            { label: 'No Spaces', value: stats.charsNoSpaces },
            { label: 'Lines', value: stats.lines },
            { label: 'Sentences', value: stats.sentences },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border bg-card p-3 text-center">
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/tools/word-counter/
git commit -m "feat: add Word Counter tool"
```

---

### Task 15: Text Diff

**Files:**
- Create: `src/tools/text-diff/logic.ts`
- Create: `src/tools/text-diff/logic.test.ts`
- Create: `src/tools/text-diff/index.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/tools/text-diff/logic.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { computeDiff } from './logic'

describe('computeDiff', () => {
  it('returns equal parts for identical strings', () => {
    expect(computeDiff('hello', 'hello').every(p => p.type === 'equal')).toBe(true)
  })
  it('detects added text', () => {
    expect(computeDiff('hello', 'hello world').some(p => p.type === 'added')).toBe(true)
  })
  it('detects removed text', () => {
    expect(computeDiff('hello world', 'hello').some(p => p.type === 'removed')).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/tools/text-diff/logic.test.ts
```

- [ ] **Step 3: Implement logic**

Create `src/tools/text-diff/logic.ts`:

```ts
import { diffWords } from 'diff'

export type DiffPart = { type: 'equal' | 'added' | 'removed'; value: string }

export function computeDiff(original: string, modified: string): DiffPart[] {
  return diffWords(original, modified).map(part => ({
    type: part.added ? 'added' : part.removed ? 'removed' : 'equal',
    value: part.value,
  }))
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/tools/text-diff/logic.test.ts
```

- [ ] **Step 5: Implement UI**

Create `src/tools/text-diff/index.tsx`:

```tsx
'use client'

import { useState, useMemo } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { computeDiff } from './logic'

export default function TextDiff() {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')

  const parts = useMemo(() => (left || right) ? computeDiff(left, right) : null, [left, right])

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Original</p>
            <Textarea value={left} onChange={e => setLeft(e.target.value)} placeholder="Original text..." className="min-h-[200px] font-mono text-sm" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Modified</p>
            <Textarea value={right} onChange={e => setRight(e.target.value)} placeholder="Modified text..." className="min-h-[200px] font-mono text-sm" />
          </div>
        </div>

        {parts && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Diff</p>
            <div className="rounded-md border bg-muted/30 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
              {parts.map((part, i) => (
                <span
                  key={i}
                  className={
                    part.type === 'added' ? 'bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100' :
                    part.type === 'removed' ? 'bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-100 line-through' : ''
                  }
                >
                  {part.value}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/tools/text-diff/
git commit -m "feat: add Text Diff tool"
```

---

### Task 16: Case Converter

**Files:**
- Create: `src/tools/case-converter/logic.ts`
- Create: `src/tools/case-converter/logic.test.ts`
- Create: `src/tools/case-converter/index.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/tools/case-converter/logic.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { toCamel, toSnake, toPascal, toKebab, toUpper, toLower } from './logic'

describe('case-converter', () => {
  it('converts to camelCase', () => expect(toCamel('hello world')).toBe('helloWorld'))
  it('converts to snake_case', () => expect(toSnake('Hello World')).toBe('hello_world'))
  it('converts to PascalCase', () => expect(toPascal('hello world')).toBe('HelloWorld'))
  it('converts to kebab-case', () => expect(toKebab('Hello World')).toBe('hello-world'))
  it('converts to UPPER_CASE', () => expect(toUpper('hello world')).toBe('HELLO_WORLD'))
  it('converts to lowercase', () => expect(toLower('HELLO WORLD')).toBe('hello world'))
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/tools/case-converter/logic.test.ts
```

- [ ] **Step 3: Implement logic**

Create `src/tools/case-converter/logic.ts`:

```ts
function words(input: string): string[] {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-\s]+/g, ' ')
    .trim().split(' ').filter(Boolean)
}

export const toCamel = (s: string) => words(s).map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()).join('')
export const toPascal = (s: string) => words(s).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('')
export const toSnake = (s: string) => words(s).map(w => w.toLowerCase()).join('_')
export const toKebab = (s: string) => words(s).map(w => w.toLowerCase()).join('-')
export const toUpper = (s: string) => words(s).map(w => w.toUpperCase()).join('_')
export const toLower = (s: string) => words(s).map(w => w.toLowerCase()).join(' ')
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/tools/case-converter/logic.test.ts
```

- [ ] **Step 5: Implement UI**

Create `src/tools/case-converter/index.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { toCamel, toPascal, toSnake, toKebab, toUpper, toLower } from './logic'

const conversions = [
  { label: 'camelCase', fn: toCamel },
  { label: 'PascalCase', fn: toPascal },
  { label: 'snake_case', fn: toSnake },
  { label: 'kebab-case', fn: toKebab },
  { label: 'UPPER_CASE', fn: toUpper },
  { label: 'lowercase', fn: toLower },
]

export default function CaseConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [activeLabel, setActiveLabel] = useState('')
  const [copied, setCopied] = useState(false)

  const convert = (label: string, fn: (s: string) => string) => {
    setOutput(fn(input))
    setActiveLabel(label)
  }

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Input</p>
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to convert..." className="min-h-[120px] font-mono text-sm" />
        </div>
        <div className="flex flex-wrap gap-2">
          {conversions.map(({ label, fn }) => (
            <Button key={label} variant={activeLabel === label ? 'default' : 'outline'} onClick={() => convert(label, fn)} disabled={!input} className="font-mono">
              {label}
            </Button>
          ))}
        </div>
        {output && (
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Output</p>
              <Textarea readOnly value={output} className="min-h-[120px] font-mono text-sm" />
            </div>
            <Button variant="outline" size="sm" onClick={copyOutput}>{copied ? 'Copied!' : 'Copy'}</Button>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/tools/case-converter/
git commit -m "feat: add Case Converter tool"
```

---

### Task 17: Hash Generator

**Files:**
- Create: `src/tools/hash-generator/logic.ts`
- Create: `src/tools/hash-generator/logic.test.ts`
- Create: `src/tools/hash-generator/index.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/tools/hash-generator/logic.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { md5Hash, sha256Hash } from './logic'

describe('hash-generator', () => {
  it('generates md5 hash', () => {
    expect(md5Hash('hello')).toBe('5d41402abc4b2a76b9719d911017c592')
  })
  it('generates sha256 hash', async () => {
    const hash = await sha256Hash('hello')
    expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/tools/hash-generator/logic.test.ts
```

- [ ] **Step 3: Implement logic**

Create `src/tools/hash-generator/logic.ts`:

```ts
import CryptoJS from 'crypto-js'

export function md5Hash(input: string): string {
  return CryptoJS.MD5(input).toString()
}

export function sha1Hash(input: string): string {
  return CryptoJS.SHA1(input).toString()
}

export async function sha256Hash(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input)
  const buffer = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/tools/hash-generator/logic.test.ts
```

- [ ] **Step 5: Implement UI**

Create `src/tools/hash-generator/index.tsx`:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { md5Hash, sha1Hash, sha256Hash } from './logic'

export default function HashGenerator() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState({ md5: '', sha1: '', sha256: '' })
  const [copied, setCopied] = useState('')

  useEffect(() => {
    if (!input) { setHashes({ md5: '', sha1: '', sha256: '' }); return }
    const md5 = md5Hash(input)
    const sha1 = sha1Hash(input)
    sha256Hash(input).then(sha256 => setHashes({ md5, sha1, sha256 }))
  }, [input])

  const copy = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Input</p>
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to hash..." className="min-h-[120px] font-mono text-sm" />
        </div>
        <div className="space-y-3">
          {(['md5', 'sha1', 'sha256'] as const).map(key => (
            <div key={key} className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">{key === 'sha1' ? 'SHA-1' : key === 'sha256' ? 'SHA-256' : 'MD5'}</p>
              <div className="flex gap-2">
                <Input readOnly value={hashes[key]} className="font-mono text-xs" />
                <Button variant="outline" size="sm" onClick={() => copy(hashes[key], key)} disabled={!hashes[key]}>
                  {copied === key ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/tools/hash-generator/
git commit -m "feat: add Hash Generator tool"
```

---

### Task 18: JWT Decoder

**Files:**
- Create: `src/tools/jwt-decoder/logic.ts`
- Create: `src/tools/jwt-decoder/logic.test.ts`
- Create: `src/tools/jwt-decoder/index.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/tools/jwt-decoder/logic.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { decodeJWT } from './logic'

const SAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

describe('decodeJWT', () => {
  it('decodes a valid JWT header', () => expect(decodeJWT(SAMPLE).header.alg).toBe('HS256'))
  it('decodes a valid JWT payload', () => expect(decodeJWT(SAMPLE).payload.name).toBe('John Doe'))
  it('throws on wrong number of parts', () => expect(() => decodeJWT('a.b')).toThrow())
  it('throws on non-base64 content', () => expect(() => decodeJWT('!!!.!!!.!!!')).toThrow())
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/tools/jwt-decoder/logic.test.ts
```

- [ ] **Step 3: Implement logic**

Create `src/tools/jwt-decoder/logic.ts`:

```ts
function base64UrlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + (4 - str.length % 4) % 4, '=')
  return atob(padded)
}

export type JWTDecoded = {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
}

export function decodeJWT(token: string): JWTDecoded {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid JWT: must have 3 parts')
  try {
    return {
      header: JSON.parse(base64UrlDecode(parts[0])),
      payload: JSON.parse(base64UrlDecode(parts[1])),
      signature: parts[2],
    }
  } catch {
    throw new Error('Invalid JWT: could not decode')
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/tools/jwt-decoder/logic.test.ts
```

- [ ] **Step 5: Implement UI**

Create `src/tools/jwt-decoder/index.tsx`:

```tsx
'use client'

import { useState, useMemo } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { decodeJWT } from './logic'

const EXAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

export default function JWTDecoder() {
  const [input, setInput] = useState('')

  const result = useMemo(() => {
    if (!input.trim()) return null
    try { return { data: decodeJWT(input.trim()), error: null } }
    catch (e) { return { data: null, error: (e as Error).message } }
  }, [input])

  return (
    <ToolErrorBoundary>
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">JWT Token</p>
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste JWT token here..." className="min-h-[100px] font-mono text-xs" />
          <Button variant="ghost" size="sm" onClick={() => setInput(EXAMPLE)}>Load Example</Button>
        </div>

        {result?.error && <p className="text-xs text-destructive">{result.error}</p>}

        {result?.data && (
          <div className="space-y-4">
            {[
              { label: 'Header', data: result.data.header, color: 'text-red-500' },
              { label: 'Payload', data: result.data.payload, color: 'text-purple-500' },
            ].map(({ label, data, color }) => (
              <div key={label} className="space-y-1">
                <p className={`text-xs font-semibold uppercase tracking-wide ${color}`}>{label}</p>
                <pre className="rounded-md border bg-muted/50 p-4 text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
              </div>
            ))}
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">Signature</p>
              <p className="font-mono text-xs text-muted-foreground break-all">{result.data.signature}</p>
            </div>
            <Badge variant="outline" className="text-yellow-600 border-yellow-600">Signature not verified</Badge>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/tools/jwt-decoder/
git commit -m "feat: add JWT Decoder tool"
```

---

### Task 19: QR Code Generator

**Files:**
- Create: `src/tools/qr-generator/index.tsx`

- [ ] **Step 1: Implement UI**

Create `src/tools/qr-generator/index.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToolErrorBoundary } from '@/components/error-boundary'

export default function QRGenerator() {
  const [value, setValue] = useState('https://example.com')
  const [size, setSize] = useState(256)

  const downloadSVG = () => {
    const svg = document.querySelector('#qr-code svg')
    if (!svg) return
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'qrcode.svg'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ToolErrorBoundary>
      <div className="max-w-md space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Content</label>
          <Input value={value} onChange={e => setValue(e.target.value)} placeholder="Enter URL or text..." />
        </div>
        {value && (
          <div className="space-y-4">
            <div id="qr-code" className="flex justify-center rounded-lg border bg-white p-6">
              <QRCodeSVG value={value} size={size} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={downloadSVG}>Download SVG</Button>
              <Button variant="ghost" size="sm" onClick={() => setSize(s => Math.min(s + 64, 512))}>Larger</Button>
              <Button variant="ghost" size="sm" onClick={() => setSize(s => Math.max(s - 64, 128))}>Smaller</Button>
            </div>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/tools/qr-generator/
git commit -m "feat: add QR Code Generator tool"
```

---

### Task 20: Color Converter

**Files:**
- Create: `src/tools/color-converter/logic.ts`
- Create: `src/tools/color-converter/logic.test.ts`
- Create: `src/tools/color-converter/index.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/tools/color-converter/logic.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from './logic'

describe('color-converter', () => {
  it('converts hex to rgb', () => expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 }))
  it('converts rgb to hex', () => expect(rgbToHex(255, 0, 0)).toBe('#ff0000'))
  it('converts rgb to hsl', () => {
    const hsl = rgbToHsl(255, 0, 0)
    expect(hsl.h).toBe(0); expect(hsl.s).toBe(100); expect(hsl.l).toBe(50)
  })
  it('converts hsl to rgb', () => expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 }))
  it('throws on invalid hex', () => expect(() => hexToRgb('notahex')).toThrow())
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- src/tools/color-converter/logic.test.ts
```

- [ ] **Step 3: Implement logic**

Create `src/tools/color-converter/logic.ts`:

```ts
export type RGB = { r: number; g: number; b: number }
export type HSL = { h: number; s: number; l: number }

export function hexToRgb(hex: string): RGB {
  const m = hex.replace('#', '').match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (!m) throw new Error('Invalid hex color')
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255]
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = max === rn ? (gn - bn) / d + (gn < bn ? 6 : 0)
         : max === gn ? (bn - rn) / d + 2
         : (rn - gn) / d + 4
  return { h: Math.round(h / 6 * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  const [hn, sn, ln] = [h / 360, s / 100, l / 100]
  if (sn === 0) { const v = Math.round(ln * 255); return { r: v, g: v, b: v } }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
  const p = 2 * ln - q
  return {
    r: Math.round(hue2rgb(p, q, hn + 1/3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1/3) * 255),
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/tools/color-converter/logic.test.ts
```

- [ ] **Step 5: Implement UI**

Create `src/tools/color-converter/index.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from './logic'

export default function ColorConverter() {
  const [hex, setHex] = useState('#3b82f6')
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })
  const [error, setError] = useState('')

  const fromHex = (value: string) => {
    setHex(value)
    try { const r = hexToRgb(value); setRgb(r); setHsl(rgbToHsl(r.r, r.g, r.b)); setError('') }
    catch { setError('Invalid hex color') }
  }

  const fromRgb = (key: 'r' | 'g' | 'b', val: number) => {
    const next = { ...rgb, [key]: val }
    setRgb(next); setHex(rgbToHex(next.r, next.g, next.b)); setHsl(rgbToHsl(next.r, next.g, next.b)); setError('')
  }

  const fromHsl = (key: 'h' | 's' | 'l', val: number) => {
    const next = { ...hsl, [key]: val }
    setHsl(next); const r = hslToRgb(next.h, next.s, next.l); setRgb(r); setHex(rgbToHex(r.r, r.g, r.b)); setError('')
  }

  return (
    <ToolErrorBoundary>
      <div className="max-w-md space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-lg border shadow-sm flex-shrink-0" style={{ backgroundColor: error ? '#ccc' : hex }} />
          <div>
            <p className="font-mono text-lg font-semibold">{hex}</p>
            <p className="text-xs text-muted-foreground">rgb({rgb.r}, {rgb.g}, {rgb.b})</p>
            <p className="text-xs text-muted-foreground">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</p>
          </div>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">HEX</label>
          <div className="flex gap-2">
            <Input value={hex} onChange={e => fromHex(e.target.value)} className="font-mono" />
            <input type="color" value={error ? '#000000' : hex} onChange={e => fromHex(e.target.value)} className="h-10 w-10 cursor-pointer rounded border" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">RGB</label>
          {(['r', 'g', 'b'] as const).map(key => (
            <div key={key} className="flex items-center gap-2">
              <span className="w-4 text-xs font-mono uppercase text-muted-foreground">{key}</span>
              <Input type="number" min={0} max={255} value={rgb[key]} onChange={e => fromRgb(key, Number(e.target.value))} className="font-mono" />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">HSL</label>
          {([['h', 360], ['s', 100], ['l', 100]] as const).map(([key, max]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="w-4 text-xs font-mono uppercase text-muted-foreground">{key}</span>
              <Input type="number" min={0} max={max} value={hsl[key]} onChange={e => fromHsl(key, Number(e.target.value))} className="font-mono" />
            </div>
          ))}
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/tools/color-converter/
git commit -m "feat: add Color Converter tool"
```

---

### Task 21: Run All Tests, Build & CLAUDE.md

- [ ] **Step 1: Run all tests**

```bash
npm run test:run
```

Expected: All tests across all logic files PASS.

- [ ] **Step 2: Build the project**

```bash
npm run build
```

Expected: Build succeeds. Output shows all 13 tool pages statically generated (e.g., `/tools/json-formatter`, `/tools/base64`, etc.).

- [ ] **Step 3: Smoke test key pages**

```bash
npm run dev
```

Verify:
- http://localhost:3000 — homepage loads with 4 categories, search works
- http://localhost:3000/tools/json-formatter — format and minify JSON
- http://localhost:3000/tools/markdown-preview — live preview renders GFM
- http://localhost:3000/tools/color-converter — color swatch updates with hex input
- http://localhost:3000/tools/qr-generator — QR code renders for entered text

- [ ] **Step 4: Create CLAUDE.md**

Create `CLAUDE.md` in project root:

```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server (http://localhost:3000, uses Turbopack)
- `npm run build` — production build; SSG emits one page per tool
- `npm run test` — run tests in watch mode
- `npm run test:run` — run all tests once
- `npm run test:run -- src/tools/<slug>/logic.test.ts` — run tests for a single tool
- `npm run lint` — ESLint

## Architecture

Next.js 15 App Router project. Each tool lives in `src/tools/<slug>/` with two files: `logic.ts` (pure functions, unit-tested with vitest) and `index.tsx` (React UI, default export).

**Tool Registry** (`src/tools/registry.ts`): metadata only (slug, name, description, category, icon from lucide-react). No component imports — keeps it tree-shakeable.

**Dynamic Tool Loader** (`src/components/dynamic-tool.tsx`): client component (`'use client'`) that contains all `next/dynamic` import declarations at module level (not inside render). The server page renders `<DynamicTool slug={slug} />` — this is the only place tool components are loaded.

**Adding a tool**: add one `ToolMeta` entry to `registry.ts`, create `src/tools/<slug>/index.tsx`, add one `next/dynamic` line to the `dynamicTools` map in `dynamic-tool.tsx`. SEO metadata, navigation, and static params update automatically.

**Static Generation**: `generateStaticParams` in `src/app/tools/[slug]/page.tsx` reads the registry to emit one static HTML page per tool at build time.

**Shared UI**: `src/components/tool-layout.tsx` provides the two-column input/output shell. `src/components/error-boundary.tsx` (`ToolErrorBoundary`) wraps each tool to catch runtime errors without crashing the page.

**Theme**: `next-themes` with `suppressHydrationWarning` on `<html>` — FOUC is prevented by next-themes' inline script injected before hydration.
```

- [ ] **Step 5: Final commit**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md with commands and architecture overview"
```
