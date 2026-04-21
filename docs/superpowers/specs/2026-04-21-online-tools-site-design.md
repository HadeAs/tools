# Online Developer Tools Site — Design Spec

**Date:** 2026-04-21  
**Status:** Approved

---

## Overview

A public-facing online tools collection website targeting developers. All tools run entirely in the browser (pure frontend). Backend can be added later via Next.js API Routes on a per-tool basis. Deployed on Vercel.

**Design goals:**
- SEO-friendly individual tool pages (shareable URLs)
- Fast, zero-config deployment on Vercel
- Easy to add new tools without touching routing or navigation code
- Clean, developer-oriented UI

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Deployment | Vercel |
| Theme | next-themes (handles dark mode + FOUC prevention via inline script in root layout) |
| State | React local state (no global state library needed initially) |

---

## Architecture

### Directory Structure

```
src/
├── app/
│   ├── page.tsx                  # Homepage: categorized tool grid + search
│   ├── tools/
│   │   ├── [slug]/
│   │   │   └── page.tsx          # Dynamic tool page (SSG via generateStaticParams)
│   │   └── layout.tsx            # Shared tool layout
│   └── layout.tsx                # Root layout (header, theme provider)
├── tools/                        # Tool definitions and implementations
│   ├── registry.ts               # Central tool registry (metadata only, no components)
│   ├── components.ts             # slug → dynamic import map (for code splitting)
│   ├── json-formatter/
│   │   ├── index.tsx             # Tool UI component
│   │   └── logic.ts              # Pure functions (no React, easy to test)
│   ├── base64/
│   └── ...
└── components/
    ├── tool-layout.tsx           # Shared page skeleton for all tools
    ├── tool-card.tsx             # Card used on homepage
    ├── search-bar.tsx
    └── theme-toggle.tsx
```

### Tool Registry

`src/tools/registry.ts` stores metadata only — no component imports. This keeps the registry tree-shakeable and bundle-safe.

```ts
type ToolCategory = 'developer' | 'text' | 'conversion' | 'encoding';

type ToolMeta = {
  slug: string;          // URL: /tools/<slug>
  name: string;
  description: string;   // One-sentence summary
  category: ToolCategory;
  icon: React.ComponentType; // Imported directly from lucide-react per entry
}
```

Tool components are resolved separately via `src/tools/components.ts`, a `Record<string, () => Promise<...>>` dynamic import map. The tool page does `const Component = lazy(() => components[slug]())`.

Adding a new tool = one registry entry + one implementation file + one line in `components.ts`. No changes to routing, navigation, or SEO config.

### Static Generation

`generateStaticParams` reads from the registry to emit one static page per tool at build time. Each page gets its own `<title>`, `<meta description>`, and Open Graph tags generated from registry metadata.

---

## Tool Categories & Initial Tool Set (13 tools)

### Developer Tools
| Slug | Tool |
|---|---|
| `json-formatter` | JSON format / minify / validate |
| `base64` | Base64 encode / decode |
| `url-encoder` | URL encode / decode |
| `regex-tester` | Regex tester with match highlighting |
| `timestamp` | Unix timestamp ↔ human-readable date |

### Text Processing
| Slug | Tool |
|---|---|
| `markdown-preview` | Markdown live preview |
| `word-counter` | Word / character / line count |
| `text-diff` | Text diff comparison |
| `case-converter` | camelCase / snake_case / PascalCase / kebab-case |

### Encoding & Crypto
| Slug | Tool |
|---|---|
| `hash-generator` | MD5 / SHA-1 / SHA-256 hash |
| `jwt-decoder` | JWT decode and inspect |
| `qr-generator` | QR code generator |

### Conversion
| Slug | Tool |
|---|---|
| `color-converter` | HEX ↔ RGB ↔ HSL color format conversion |

---

## Pages

### Homepage (`/`)
- Fixed header: Logo + search input + GitHub link + theme toggle
- Search filters the tool grid in real time (client-side, no API)
- Tools grouped by category, card grid layout
- Each card: icon + name + one-line description → links to `/tools/<slug>`

### Tool Page (`/tools/[slug]`)
- Breadcrumb: Home → Category → Tool Name
- Tool name + description at top
- Main area: input panel → output panel (layout adapts per tool: side-by-side on desktop, stacked on mobile)
- Action buttons: Copy, Clear, Load Example
- Bottom: "Related Tools" strip — up to 4 cards from the same category; if fewer than 2 exist in the category, fill remaining slots with tools from other categories

---

## UI & Design

- **Style:** Minimal, high-density developer aesthetic (inspired by transform.tools / it-tools)
- **Theme:** Light / dark mode toggle via `next-themes`; persisted in `localStorage`; FOUC prevented by next-themes' inline script injected into root layout
- **Components:** shadcn/ui primitives (Button, Textarea, Badge, Tabs, etc.)
- **No login, no user accounts**
- **Error handling:** Each tool wraps its main area in a React error boundary that catches runtime errors and shows an inline "Something went wrong" fallback (no page crash)

---

## Extensibility

When a tool needs backend processing (file conversion, AI features, etc.):
1. Add a Next.js API Route at `src/app/api/tools/<slug>/route.ts`
2. The tool component calls its own API route — no architectural change needed

---

## Out of Scope (v1)

- User accounts / authentication
- Saving history or favorites
- Paid/premium tools
- i18n / multi-language
- Analytics / telemetry
