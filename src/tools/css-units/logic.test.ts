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
})
