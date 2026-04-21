import { describe, it, expect } from 'vitest'
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, parseColor } from './logic'

describe('color-converter primitives', () => {
  it('converts hex to rgb', () => expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 }))
  it('converts rgb to hex', () => expect(rgbToHex(255, 0, 0)).toBe('#ff0000'))
  it('converts rgb to hsl', () => {
    const hsl = rgbToHsl(255, 0, 0)
    expect(hsl.h).toBe(0); expect(hsl.s).toBe(100); expect(hsl.l).toBe(50)
  })
  it('converts hsl to rgb', () => expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 }))
  it('throws on invalid hex', () => expect(() => hexToRgb('notahex')).toThrow())
})

describe('parseColor', () => {
  it('parses hex input', () => {
    const r = parseColor('#ff0000')
    expect(r.hex).toBe('#ff0000')
    expect(r.rgb).toBe('rgb(255, 0, 0)')
    expect(r.hsl).toBe('hsl(0, 100%, 50%)')
  })
  it('parses hex without #', () => {
    expect(parseColor('ff0000').hex).toBe('#ff0000')
  })
  it('parses rgb() input', () => {
    const r = parseColor('rgb(255, 0, 0)')
    expect(r.hex).toBe('#ff0000')
    expect(r.hsl).toBe('hsl(0, 100%, 50%)')
  })
  it('parses hsl() input', () => {
    const r = parseColor('hsl(0, 100, 50)')
    expect(r.hex).toBe('#ff0000')
    expect(r.rgb).toBe('rgb(255, 0, 0)')
  })
  it('throws on invalid input', () => {
    expect(() => parseColor('notacolor')).toThrow()
  })
})
