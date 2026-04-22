import { describe, it, expect } from 'vitest'
import { convertUnit, formatResult } from './logic'

describe('convertUnit - length', () => {
  it('m to cm', () => {
    expect(convertUnit(1, 'm', 'cm', 'length')).toBeCloseTo(100)
  })
  it('km to m', () => {
    expect(convertUnit(1, 'km', 'm', 'length')).toBeCloseTo(1000)
  })
  it('in to cm', () => {
    expect(convertUnit(1, 'in', 'cm', 'length')).toBeCloseTo(2.54)
  })
  it('mi to km', () => {
    expect(convertUnit(1, 'mi', 'km', 'length')).toBeCloseTo(1.609344)
  })
  it('same unit returns same value', () => {
    expect(convertUnit(42, 'm', 'm', 'length')).toBeCloseTo(42)
  })
})

describe('convertUnit - weight', () => {
  it('kg to g', () => {
    expect(convertUnit(1, 'kg', 'g', 'weight')).toBeCloseTo(1000)
  })
  it('lb to kg', () => {
    expect(convertUnit(1, 'lb', 'kg', 'weight')).toBeCloseTo(0.453592)
  })
  it('jin to g', () => {
    expect(convertUnit(1, 'jin', 'g', 'weight')).toBeCloseTo(500)
  })
})

describe('convertUnit - temperature', () => {
  it('0°C = 32°F', () => {
    expect(convertUnit(0, 'C', 'F', 'temperature')).toBeCloseTo(32)
  })
  it('100°C = 212°F', () => {
    expect(convertUnit(100, 'C', 'F', 'temperature')).toBeCloseTo(212)
  })
  it('0°C = 273.15K', () => {
    expect(convertUnit(0, 'C', 'K', 'temperature')).toBeCloseTo(273.15)
  })
  it('-40°C = -40°F', () => {
    expect(convertUnit(-40, 'C', 'F', 'temperature')).toBeCloseTo(-40)
  })
})

describe('convertUnit - data', () => {
  it('1 KB = 1024 B', () => {
    expect(convertUnit(1, 'KB', 'B', 'data')).toBeCloseTo(1024)
  })
  it('1 GB = 1024 MB', () => {
    expect(convertUnit(1, 'GB', 'MB', 'data')).toBeCloseTo(1024)
  })
  it('1 KB = 8 Kb', () => {
    expect(convertUnit(1, 'KB', 'Kb', 'data')).toBeCloseTo(8.192)
  })
})

describe('formatResult', () => {
  it('formats integer', () => {
    expect(formatResult(1000)).toBe('1000')
  })
  it('strips trailing zeros', () => {
    expect(formatResult(2.54)).toBe('2.54')
  })
  it('handles zero', () => {
    expect(formatResult(0)).toBe('0')
  })
  it('uses exponential for very large', () => {
    expect(formatResult(1e15)).toContain('e')
  })
})
