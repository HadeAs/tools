import { kv } from '@vercel/kv'
import { tools } from '@/tools/registry'

export const runtime = 'edge'

export async function GET() {
  try {
    const keys = tools.map(t => `visits:${t.slug}`)
    const counts = await kv.mget<number[]>(...keys)
    const result: Record<string, number> = {}
    tools.forEach((t, i) => { result[t.slug] = counts[i] ?? 0 })
    return Response.json(result)
  } catch {
    const result: Record<string, number> = {}
    tools.forEach(t => { result[t.slug] = 0 })
    return Response.json(result)
  }
}
