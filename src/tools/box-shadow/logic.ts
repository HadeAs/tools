export type Shadow = {
  id: string
  hOffset: number
  vOffset: number
  blur: number
  spread: number
  color: string
  opacity: number
  inset: boolean
}

export const DEFAULT_SHADOW: Shadow = {
  id: '1',
  hOffset: 4,
  vOffset: 4,
  blur: 10,
  spread: 0,
  color: '#000000',
  opacity: 25,
  inset: false,
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`
}

export function shadowToCSS(s: Shadow): string {
  const inset = s.inset ? 'inset ' : ''
  const color = hexToRgba(s.color, s.opacity)
  return `${inset}${s.hOffset}px ${s.vOffset}px ${s.blur}px ${s.spread}px ${color}`
}

export function generateBoxShadowCSS(shadows: Shadow[]): string {
  if (shadows.length === 0) return 'none'
  return shadows.map(shadowToCSS).join(',\n         ')
}

export function generateFullCSS(shadows: Shadow[]): string {
  return `box-shadow: ${generateBoxShadowCSS(shadows)};`
}
