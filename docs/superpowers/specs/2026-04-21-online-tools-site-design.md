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
│   ├── registry.ts               # Central tool registry (metadata)
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

`src/tools/registry.ts` is the single source of truth for all tools. Each entry contains:

```ts
type Tool = {
  slug: string;          // URL: /tools/<slug>
  name: string;
  description: string;   // One-sentence summary
  category: ToolCategory;
  icon: string;          // Lucide icon name
  component: React.ComponentType;
}
```

Adding a new tool = one registry entry + one implementation file. No changes to routing, navigation, or SEO config.

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
| `color-converter` | HEX ↔ RGB ↔ HSL |
| `qr-generator` | QR code generator |
| `jwt-decoder` | JWT decode and inspect |

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
- Bottom: "Related Tools" strip (3–4 cards from same category)

---

## UI & Design

- **Style:** Minimal, high-density developer aesthetic (inspired by transform.tools / it-tools)
- **Theme:** Light / dark mode toggle, persisted via `localStorage`
- **Components:** shadcn/ui primitives (Button, Textarea, Badge, Tabs, etc.)
- **No login, no user accounts, no analytics initially**

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
- Analytics
