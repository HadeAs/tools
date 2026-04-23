import { describe, it, expect } from 'vitest'
import { generateBorderRadiusCSS, generateFullCSS, DEFAULT_CONFIG } from './logic'

describe('generateBorderRadiusCSS', () => {
  it('outputs single value when all corners are equal', () => {
    const result = generateBorderRadiusCSS({ topLeft: 8, topRight: 8, bottomRight: 8, bottomLeft: 8, unit: 'px' })
    expect(result).toBe('8px')
  })

  it('outputs two values when opposite corners match', () => {
    const result = generateBorderRadiusCSS({ topLeft: 10, topRight: 20, bottomRight: 10, bottomLeft: 20, unit: 'px' })
    expect(result).toBe('10px 20px')
  })

  it('outputs four values for different corners', () => {
    const result = generateBorderRadiusCSS({ topLeft: 1, topRight: 2, bottomRight: 3, bottomLeft: 4, unit: 'px' })
    expect(result).toBe('1px 2px 3px 4px')
  })

  it('uses % unit correctly', () => {
    const result = generateBorderRadiusCSS({ topLeft: 50, topRight: 50, bottomRight: 50, bottomLeft: 50, unit: '%' })
    expect(result).toBe('50%')
  })

  it('works with default config', () => {
    const result = generateBorderRadiusCSS(DEFAULT_CONFIG)
    expect(result).toBeTruthy()
  })
})

describe('generateFullCSS', () => {
  it('wraps with border-radius property', () => {
    const result = generateFullCSS(DEFAULT_CONFIG)
    expect(result.startsWith('border-radius:')).toBe(true)
    expect(result.endsWith(';')).toBe(true)
  })
})
