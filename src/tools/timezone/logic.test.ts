import { describe, it, expect } from 'vitest'
import { convertToZone, getOffset, TIMEZONES } from './logic'

describe('convertToZone', () => {
  it('returns a non-empty string for a valid date and timezone', () => {
    const date = new Date('2024-01-15T12:00:00Z')
    const result = convertToZone(date, 'Asia/Shanghai')
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })

  it('formats UTC time correctly', () => {
    const date = new Date('2024-06-15T00:00:00Z')
    const result = convertToZone(date, 'UTC')
    expect(result).toContain('2024')
    expect(result).toContain('06')
    expect(result).toContain('15')
  })
})

describe('getOffset', () => {
  it('returns UTC+00:00 for UTC timezone', () => {
    const date = new Date('2024-01-15T12:00:00Z')
    const offset = getOffset(date, 'UTC')
    expect(offset).toBe('UTC+00:00')
  })

  it('returns UTC+08:00 for Asia/Shanghai', () => {
    const date = new Date('2024-01-15T12:00:00Z')
    const offset = getOffset(date, 'Asia/Shanghai')
    expect(offset).toBe('UTC+08:00')
  })

  it('returns a string starting with UTC', () => {
    const date = new Date()
    const offset = getOffset(date, 'America/New_York')
    expect(offset).toMatch(/^UTC[+-]\d{2}:\d{2}$/)
  })
})

describe('TIMEZONES', () => {
  it('includes UTC', () => {
    expect(TIMEZONES.some(z => z.value === 'UTC')).toBe(true)
  })

  it('includes Asia/Shanghai', () => {
    expect(TIMEZONES.some(z => z.value === 'Asia/Shanghai')).toBe(true)
  })

  it('has at least 10 entries', () => {
    expect(TIMEZONES.length).toBeGreaterThanOrEqual(10)
  })
})
