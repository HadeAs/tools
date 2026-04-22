export type CssUnit = 'px' | 'rem' | 'em' | 'vw' | 'vh' | 'pt' | '%'

export const UNITS: CssUnit[] = ['px', 'rem', 'em', 'vw', 'vh', 'pt', '%']

export interface ConvertOptions {
  value: number
  from: CssUnit
  baseFontSize: number  // px, default 16
  viewportW: number     // px, default 1440
  viewportH: number     // px, default 900
}

function toPx(v: number, unit: CssUnit, base: number, vw: number, vh: number): number {
  switch (unit) {
    case 'px':  return v
    case 'rem':
    case 'em':  return v * base
    case 'vw':  return v * vw / 100
    case 'vh':  return v * vh / 100
    case 'pt':  return v * 96 / 72
    case '%':   return v * base / 100
  }
}

function fromPx(px: number, unit: CssUnit, base: number, vw: number, vh: number): number {
  switch (unit) {
    case 'px':  return px
    case 'rem':
    case 'em':  return px / base
    case 'vw':  return px * 100 / vw
    case 'vh':  return px * 100 / vh
    case 'pt':  return px * 72 / 96
    case '%':   return px * 100 / base
  }
}

export function convertAll(opts: ConvertOptions): Record<CssUnit, number> {
  const { value, from, baseFontSize: base, viewportW: vw, viewportH: vh } = opts
  const px = toPx(value, from, base, vw, vh)
  return Object.fromEntries(UNITS.map(u => [u, fromPx(px, u, base, vw, vh)])) as Record<CssUnit, number>
}

export function fmt(n: number): string {
  if (Math.abs(n) >= 1000) return n.toFixed(2)
  if (Math.abs(n) >= 1) return n.toFixed(4).replace(/\.?0+$/, '')
  return n.toPrecision(4).replace(/\.?0+$/, '')
}
