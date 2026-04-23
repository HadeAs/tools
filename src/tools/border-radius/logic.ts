export type RadiusUnit = 'px' | '%'

export type RadiusConfig = {
  topLeft: number
  topRight: number
  bottomRight: number
  bottomLeft: number
  unit: RadiusUnit
}

export const DEFAULT_CONFIG: RadiusConfig = {
  topLeft: 8,
  topRight: 8,
  bottomRight: 8,
  bottomLeft: 8,
  unit: 'px',
}

export function generateBorderRadiusCSS(config: RadiusConfig): string {
  const { topLeft, topRight, bottomRight, bottomLeft, unit } = config
  const all = [topLeft, topRight, bottomRight, bottomLeft]
  if (all.every(v => v === topLeft)) return `${topLeft}${unit}`
  if (topLeft === bottomRight && topRight === bottomLeft) {
    return `${topLeft}${unit} ${topRight}${unit}`
  }
  return `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`
}

export function generateFullCSS(config: RadiusConfig): string {
  return `border-radius: ${generateBorderRadiusCSS(config)};`
}
