import { describe, it, expect } from 'vitest'
import { generateTransformCSS, generateFullCSS, DEFAULT_TRANSFORM } from './logic'

describe('generateTransformCSS', () => {
  it('returns none for default (no-op) transform', () => {
    expect(generateTransformCSS(DEFAULT_TRANSFORM)).toBe('none')
  })

  it('generates translate', () => {
    const result = generateTransformCSS({ ...DEFAULT_TRANSFORM, translateX: 10, translateY: 20 })
    expect(result).toContain('translate(10px, 20px)')
  })

  it('generates rotate', () => {
    const result = generateTransformCSS({ ...DEFAULT_TRANSFORM, rotate: 45 })
    expect(result).toContain('rotate(45deg)')
  })

  it('generates scale with single value when scaleX === scaleY', () => {
    const result = generateTransformCSS({ ...DEFAULT_TRANSFORM, scaleX: 2, scaleY: 2 })
    expect(result).toContain('scale(2)')
    expect(result).not.toContain('scale(2, 2)')
  })

  it('generates scale with two values when scaleX !== scaleY', () => {
    const result = generateTransformCSS({ ...DEFAULT_TRANSFORM, scaleX: 2, scaleY: 0.5 })
    expect(result).toContain('scale(2, 0.5)')
  })

  it('generates skew', () => {
    const result = generateTransformCSS({ ...DEFAULT_TRANSFORM, skewX: 10, skewY: 5 })
    expect(result).toContain('skew(10deg, 5deg)')
  })

  it('combines multiple transforms', () => {
    const result = generateTransformCSS({ ...DEFAULT_TRANSFORM, translateX: 10, rotate: 45, scaleX: 2, scaleY: 2 })
    expect(result).toContain('translate(')
    expect(result).toContain('rotate(')
    expect(result).toContain('scale(')
  })
})

describe('generateFullCSS', () => {
  it('wraps with transform property', () => {
    const result = generateFullCSS({ ...DEFAULT_TRANSFORM, rotate: 90 })
    expect(result.startsWith('transform:')).toBe(true)
    expect(result.endsWith(';')).toBe(true)
  })
})
