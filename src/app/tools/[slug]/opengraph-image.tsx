import { ImageResponse } from 'next/og'
import { getToolBySlug, categoryLabels } from '@/tools/registry'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function ToolOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getToolBySlug(slug)

  const name = tool?.name ?? 'DevTools'
  const description = tool?.description ?? '在线开发者工具'
  const category = tool ? categoryLabels[tool.category] : ''

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {category && (
          <div style={{ fontSize: 22, color: '#60a5fa', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 3 }}>
            {category}
          </div>
        )}
        <div style={{ fontSize: 72, fontWeight: 700, color: '#f8fafc', lineHeight: 1.1, marginBottom: 24 }}>
          {name}
        </div>
        <div style={{ fontSize: 30, color: '#94a3b8', lineHeight: 1.5 }}>
          {description}
        </div>
        <div style={{ position: 'absolute', bottom: 60, right: 80, fontSize: 24, color: '#475569' }}>
          DevTools
        </div>
      </div>
    ),
    { ...size },
  )
}
