import { describe, it, expect } from 'vitest'
import { calculateAge } from './logic'

describe('calculateAge', () => {
  it('exact years with no remainder', () => {
    const r = calculateAge('1990-06-15', '2024-06-15')
    expect(r.years).toBe(34)
    expect(r.months).toBe(0)
    expect(r.days).toBe(0)
    expect(r.isBirthdayToday).toBe(true)
    expect(r.daysUntilNextBirthday).toBe(0)
  })

  it('years + months + days', () => {
    const r = calculateAge('1990-01-01', '2024-06-15')
    expect(r.years).toBe(34)
    expect(r.months).toBe(5)
    expect(r.days).toBe(14)
  })

  it('totalDays is positive', () => {
    const r = calculateAge('2000-01-01', '2024-01-01')
    expect(r.totalDays).toBe(8766)
  })

  it('totalWeeks = floor(totalDays / 7)', () => {
    const r = calculateAge('2000-01-01', '2024-01-01')
    expect(r.totalWeeks).toBe(Math.floor(r.totalDays / 7))
  })

  it('nextBirthdayDate is after reference when not today', () => {
    const r = calculateAge('1990-12-31', '2024-06-15')
    expect(new Date(r.nextBirthdayDate) > new Date('2024-06-15')).toBe(true)
    expect(r.daysUntilNextBirthday).toBeGreaterThan(0)
  })

  it('throws when birthday is in the future', () => {
    expect(() => calculateAge('2099-01-01', '2024-01-01')).toThrow()
  })

  it('throws on invalid birthday', () => {
    expect(() => calculateAge('not-a-date')).toThrow()
  })

  it('born today means age 0', () => {
    const today = new Date().toISOString().slice(0, 10)
    const r = calculateAge(today, today)
    expect(r.years).toBe(0)
    expect(r.months).toBe(0)
    expect(r.days).toBe(0)
    expect(r.isBirthdayToday).toBe(true)
  })
})
