export type GradientType = 'linear' | 'radial' | 'conic'

export type ColorStop = {
  id: string
  color: string
  position: number
}

export type GradientConfig = {
  type: GradientType
  angle: number
  stops: ColorStop[]
}

export const DEFAULT_CONFIG: GradientConfig = {
  type: 'linear',
  angle: 90,
  stops: [
    { id: '1', color: '#6366f1', position: 0 },
    { id: '2', color: '#ec4899', position: 100 },
  ],
}

export function generateCSS(config: GradientConfig): string {
  const sorted = [...config.stops].sort((a, b) => a.position - b.position)
  const stops = sorted.map(s => `${s.color} ${s.position}%`).join(', ')
  if (config.type === 'linear') return `linear-gradient(${config.angle}deg, ${stops})`
  if (config.type === 'radial') return `radial-gradient(circle, ${stops})`
  return `conic-gradient(from ${config.angle}deg, ${stops})`
}

export function generateFullCSS(config: GradientConfig): string {
  const value = generateCSS(config)
  return `background: ${value};`
}
