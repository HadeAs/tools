import { describe, it, expect } from 'vitest'
import { generateClipPathCSS, generateFullCSS, POLYGON_PRESETS } from './logic'

describe('generateClipPathCSS', () => {
  it('generates circle', () => {
    const result = generateClipPathCSS({ type: 'circle', radius: 50, cx: 50, cy: 50 })
    expect(result).toBe('circle(50% at 50% 50%)')
  })

  it('generates ellipse', () => {
    const result = generateClipPathCSS({ type: 'ellipse', rx: 40, ry: 30, cx: 50, cy: 50 })
    expect(result).toBe('ellipse(40% 30% at 50% 50%)')
  })

  it('generates inset without radius', () => {
    const result = generateClipPathCSS({ type: 'inset', top: 10, right: 10, bottom: 10, left: 10, radius: 0 })
    expect(result).toBe('inset(10% 10% 10% 10%)')
  })

  it('generates inset with radius', () => {
    const result = generateClipPathCSS({ type: 'inset', top: 10, right: 10, bottom: 10, left: 10, radius: 8 })
    expect(result).toContain('round 8px')
  })

  it('generates polygon from preset', () => {
    const result = generateClipPathCSS({ type: 'polygon', preset: 'triangle', custom: '' })
    expect(result).toContain('polygon(')
    expect(result).toContain('50% 0%')
  })

  it('generates polygon from custom points', () => {
    const result = generateClipPathCSS({ type: 'polygon', preset: 'custom', custom: '0% 0%, 100% 0%, 50% 100%' })
    expect(result).toBe('polygon(0% 0%, 100% 0%, 50% 100%)')
  })
})

describe('POLYGON_PRESETS', () => {
  it('has all expected presets', () => {
    expect(POLYGON_PRESETS.triangle).toBeDefined()
    expect(POLYGON_PRESETS.diamond).toBeDefined()
    expect(POLYGON_PRESETS.pentagon).toBeDefined()
    expect(POLYGON_PRESETS.hexagon).toBeDefined()
    expect(POLYGON_PRESETS.star).toBeDefined()
  })
})

describe('generateFullCSS', () => {
  it('wraps with clip-path property', () => {
    const result = generateFullCSS({ type: 'circle', radius: 50, cx: 50, cy: 50 })
    expect(result.startsWith('clip-path:')).toBe(true)
    expect(result.endsWith(';')).toBe(true)
  })
})
