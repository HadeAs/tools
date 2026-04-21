# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build (runs TypeScript + Turbopack)
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once (CI)
npm run lint         # ESLint
```

Run a single test file:
```bash
npx vitest run src/tools/json-formatter/logic.test.ts
```

## Architecture

**Next.js 15 App Router** with full SSG — every tool page is pre-rendered via `generateStaticParams`.

### Adding a new tool

1. Register it in `src/tools/registry.ts` — metadata only (name, slug, description, category, tags).
2. Add a `next/dynamic` import in `src/components/dynamic-tool.tsx` — all imports must be at module level, not inside render.
3. Create `src/tools/<slug>/logic.ts` (pure functions, no React), `logic.test.ts` (vitest), and `index.tsx` (`'use client'` component).

### Key files

- `src/tools/registry.ts` — single source of truth for tool metadata and categories
- `src/components/dynamic-tool.tsx` — client wrapper for code-splitting via `next/dynamic` (SSR disabled per tool)
- `src/app/tools/[slug]/page.tsx` — server component; calls `generateStaticParams` + `generateMetadata`, renders `<DynamicTool>`
- `src/app/page.tsx` — client component; filters/groups tools from registry, renders search + card grid

### Tech stack notes

- **Tailwind CSS v4**: config is CSS-based — no `tailwind.config.ts`. Plugins via `@plugin` in `globals.css`.
- **shadcn/ui**: components live in `src/components/ui/`. Add new ones with `npx shadcn add <name>`.
- **Testing**: vitest + jsdom + `@testing-library/react`. Setup in `src/test/setup.ts`. `@` alias resolves to `./src`.
- **lucide-react v1**: no brand icons (e.g., no `Github`). Use inline SVG for brand icons.
- **crypto-js**: requires `@types/crypto-js` dev dependency for TypeScript.
