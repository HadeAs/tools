import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'DevTools — 在线开发者工具'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 24 }}>🛠️</div>
        <div style={{ fontSize: 64, fontWeight: 700, color: '#f8fafc', letterSpacing: '-2px' }}>
          DevTools
        </div>
        <div style={{ fontSize: 28, color: '#94a3b8', marginTop: 16 }}>
          免费的在线开发者工具集合
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['JSON 格式化', 'Base64', '哈希生成器', '二维码', '正则测试器'].map(label => (
            <div
              key={label}
              style={{
                background: '#1e40af',
                color: '#bfdbfe',
                borderRadius: 8,
                padding: '6px 16px',
                fontSize: 22,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
