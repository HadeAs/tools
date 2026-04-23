import { describe, it, expect } from 'vitest'
import { generateCSS, generateFullCSS, DEFAULT_CONFIG } from './logic'

describe('generateCSS', () => {
  it('generates linear-gradient with correct angle', () => {
    const css = generateCSS({
      type: 'linear', angle: 45,
      stops: [{ id: '1', color: '#ff0000', position: 0 }, { id: '2', color: '#0000ff', position: 100 }],
    })
    expect(css).toBe('linear-gradient(45deg, #ff0000 0%, #0000ff 100%)')
  })

  it('generates radial-gradient', () => {
    const css = generateCSS({
      type: 'radial', angle: 0,
      stops: [{ id: '1', color: '#fff', position: 0 }, { id: '2', color: '#000', position: 100 }],
    })
    expect(css).toContain('radial-gradient')
  })

  it('generates conic-gradient', () => {
    const css = generateCSS({
      type: 'conic', angle: 90,
      stops: [{ id: '1', color: '#ff0000', position: 0 }, { id: '2', color: '#0000ff', position: 100 }],
    })
    expect(css).toContain('conic-gradient')
    expect(css).toContain('90deg')
  })

  it('sorts stops by position', () => {
    const css = generateCSS({
      type: 'linear', angle: 0,
      stops: [
        { id: '2', color: '#0000ff', position: 100 },
        { id: '1', color: '#ff0000', position: 0 },
      ],
    })
    expect(css.indexOf('#ff0000')).toBeLessThan(css.indexOf('#0000ff'))
  })
})

describe('generateFullCSS', () => {
  it('wraps with background property', () => {
    const full = generateFullCSS(DEFAULT_CONFIG)
    expect(full).toMatch(/^background:/)
    expect(full.endsWith(';')).toBe(true)
  })
})
