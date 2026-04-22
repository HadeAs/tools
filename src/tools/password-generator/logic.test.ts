import { describe, it, expect } from 'vitest'
import { generatePassword, getStrength } from './logic'

describe('password-generator', () => {
  it('generates password of correct length', () => {
    expect(generatePassword({ length: 16, uppercase: true, lowercase: true, numbers: true, symbols: false })).toHaveLength(16)
  })
  it('only numbers when only numbers selected', () => {
    const pwd = generatePassword({ length: 12, uppercase: false, lowercase: false, numbers: true, symbols: false })
    expect(pwd).toMatch(/^[0-9]+$/)
  })
  it('throws when no char type selected', () => {
    expect(() => generatePassword({ length: 8, uppercase: false, lowercase: false, numbers: false, symbols: false })).toThrow()
  })
  it('includes at least one char from each selected set', () => {
    for (let i = 0; i < 20; i++) {
      const pwd = generatePassword({ length: 10, uppercase: true, lowercase: true, numbers: true, symbols: true })
      expect(pwd).toMatch(/[A-Z]/)
      expect(pwd).toMatch(/[a-z]/)
      expect(pwd).toMatch(/[0-9]/)
      expect(pwd).toMatch(/[^A-Za-z0-9]/)
    }
  })
  it('getStrength: weak for short', () => { expect(getStrength('abc')).toBe('weak') })
  it('getStrength: strong for complex', () => { expect(getStrength('Abc123!@#defGHI')).toBe('strong') })
})
