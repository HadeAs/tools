export interface RGB { r: number; g: number; b: number }
export interface HSL { h: number; s: number; l: number }
export interface ColorResult { hex: string; rgb: string; hsl: string }

export function parseColor(input: string): ColorResult {
  const s = input.trim()
  let rgb: RGB

  const hexMatch = s.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  const rgbMatch = s.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i)
  const hslMatch = s.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)$/i)

  if (hexMatch) {
    rgb = { r: parseInt(hexMatch[1], 16), g: parseInt(hexMatch[2], 16), b: parseInt(hexMatch[3], 16) }
  } else if (rgbMatch) {
    const [r, g, b] = [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])]
    if (r > 255 || g > 255 || b > 255) throw new Error('RGB 值必须在 0–255 之间')
    rgb = { r, g, b }
  } else if (hslMatch) {
    const [h, s, l] = [Number(hslMatch[1]), Number(hslMatch[2]), Number(hslMatch[3])]
    if (h > 360) throw new Error('H 值必须在 0–360 之间')
    if (s > 100 || l > 100) throw new Error('S/L 值必须在 0–100 之间')
    rgb = hslToRgb(h, s, l)
  } else {
    throw new Error('格式无效，支持 #rrggbb、rgb(r,g,b)、hsl(h,s,l)')
  }

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  return {
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
  }
}

export function hexToRgb(hex: string): RGB {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (!match) throw new Error(`Invalid hex color: ${hex}`)
  return { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
  else if (max === gn) h = ((bn - rn) / d + 2) / 6
  else h = ((rn - gn) / d + 4) / 6
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  const hn = h / 360, sn = s / 100, ln = l / 100
  if (sn === 0) {
    const v = Math.round(ln * 255)
    return { r: v, g: v, b: v }
  }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
  const p = 2 * ln - q
  return {
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  }
}
