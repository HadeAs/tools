import { describe, it, expect } from 'vitest'
import { convertBase } from './logic'

describe('number-base', () => {
  it('converts decimal 255', () => {
    const r = convertBase('255', 10)
    expect(r.binary).toBe('11111111')
    expect(r.octal).toBe('377')
    expect(r.hex).toBe('FF')
  })
  it('converts from binary', () => {
    expect(convertBase('1010', 2).decimal).toBe('10')
  })
  it('converts from hex', () => {
    expect(convertBase('FF', 16).decimal).toBe('255')
  })
  it('throws on invalid input', () => {
    expect(() => convertBase('xyz', 10)).toThrow()
  })
  it('converts negative decimal', () => {
    const r = convertBase('-10', 10)
    expect(r.binary).toBe('-1010')
    expect(r.octal).toBe('-12')
    expect(r.hex).toBe('-A')
  })
  it('converts negative binary', () => {
    expect(convertBase('-1010', 2).decimal).toBe('-10')
  })
  it('throws on binary input with invalid chars', () => {
    expect(() => convertBase('19', 2)).toThrow()
  })
})
