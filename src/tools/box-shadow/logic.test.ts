import { describe, it, expect } from 'vitest'
import { shadowToCSS, generateBoxShadowCSS, generateFullCSS, DEFAULT_SHADOW } from './logic'

describe('shadowToCSS', () => {
  it('generates correct CSS for default shadow', () => {
    const css = shadowToCSS(DEFAULT_SHADOW)
    expect(css).toContain('px')
    expect(css).toContain('rgba(')
  })

  it('includes inset keyword when inset is true', () => {
    const css = shadowToCSS({ ...DEFAULT_SHADOW, inset: true })
    expect(css.startsWith('inset ')).toBe(true)
  })

  it('does not include inset keyword when inset is false', () => {
    const css = shadowToCSS({ ...DEFAULT_SHADOW, inset: false })
    expect(css.startsWith('inset')).toBe(false)
  })

  it('converts hex color to rgba with correct opacity', () => {
    const css = shadowToCSS({ ...DEFAULT_SHADOW, color: '#ff0000', opacity: 50 })
    expect(css).toContain('rgba(255, 0, 0, 0.50)')
  })

  it('uses correct offset values', () => {
    const css = shadowToCSS({ ...DEFAULT_SHADOW, hOffset: 10, vOffset: 20, blur: 5, spread: 2 })
    expect(css).toContain('10px 20px 5px 2px')
  })
})

describe('generateBoxShadowCSS', () => {
  it('returns none for empty array', () => {
    expect(generateBoxShadowCSS([])).toBe('none')
  })

  it('handles single shadow', () => {
    const result = generateBoxShadowCSS([DEFAULT_SHADOW])
    expect(result).not.toBe('none')
    expect(result).toContain('rgba(')
  })

  it('separates multiple shadows with comma', () => {
    const result = generateBoxShadowCSS([DEFAULT_SHADOW, { ...DEFAULT_SHADOW, id: '2' }])
    expect(result).toContain(',')
  })
})

describe('generateFullCSS', () => {
  it('wraps with box-shadow property', () => {
    const result = generateFullCSS([DEFAULT_SHADOW])
    expect(result.startsWith('box-shadow:')).toBe(true)
    expect(result.endsWith(';')).toBe(true)
  })
})
