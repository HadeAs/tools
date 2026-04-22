import { describe, it, expect } from 'vitest'
import { convertAll } from './logic'

const base = { baseFontSize: 16, viewportW: 1440, viewportH: 900 }

describe('css-units', () => {
  it('px to rem', () => {
    const r = convertAll({ value: 16, from: 'px', ...base })
    expect(r.rem).toBeCloseTo(1)
  })
  it('rem to px', () => {
    const r = convertAll({ value: 1, from: 'rem', ...base })
    expect(r.px).toBeCloseTo(16)
  })
  it('px to pt', () => {
    const r = convertAll({ value: 96, from: 'px', ...base })
    expect(r.pt).toBeCloseTo(72)
  })
  it('vw to px', () => {
    const r = convertAll({ value: 100, from: 'vw', ...base })
    expect(r.px).toBeCloseTo(1440)
  })
  it('px to vw', () => {
    const r = convertAll({ value: 144, from: 'px', ...base })
    expect(r.vw).toBeCloseTo(10)
  })
  it('same unit roundtrip', () => {
    const r = convertAll({ value: 42, from: 'px', ...base })
    expect(r.px).toBeCloseTo(42)
  })
  it('em to px (same as rem with base 16)', () => {
    const r = convertAll({ value: 2, from: 'em', ...base })
    expect(r.px).toBeCloseTo(32)
  })
  it('vh to px', () => {
    const r = convertAll({ value: 50, from: 'vh', ...base })
    expect(r.px).toBeCloseTo(450)
  })
  it('% to px (relative to base font size)', () => {
    const r = convertAll({ value: 200, from: '%', ...base })
    expect(r.px).toBeCloseTo(32)
  })
  it('zero value stays zero', () => {
    const r = convertAll({ value: 0, from: 'px', ...base })
    expect(r.rem).toBe(0)
    expect(r.vw).toBe(0)
  })
})

import { fmt } from './logic'

describe('fmt', () => {
  it('formats integer-like values cleanly', () => {
    expect(fmt(1)).toBe('1')
    expect(fmt(16)).toBe('16')
  })
  it('trims trailing zeros', () => {
    expect(fmt(1.5)).toBe('1.5')
  })
  it('uses toPrecision for small values (trailing zeros stripped)', () => {
    expect(fmt(0.001)).toBe('0.001')
  })
  it('uses toFixed(2) for large values', () => {
    expect(fmt(1234)).toBe('1234.00')
  })
})
