import { kv } from '@vercel/kv'
import { getToolBySlug } from '@/tools/registry'

export const runtime = 'edge'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const count = (await kv.get<number>(`visits:${slug}`)) ?? 0
    return Response.json({ slug, count })
  } catch {
    return Response.json({ slug, count: 0 })
  }
}

export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getToolBySlug(slug)) {
    return Response.json({ error: 'unknown tool' }, { status: 404 })
  }
  try {
    const count = await kv.incr(`visits:${slug}`)
    return Response.json({ slug, count })
  } catch {
    return Response.json({ slug, count: 0 })
  }
}
