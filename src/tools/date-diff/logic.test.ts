import { describe, it, expect } from 'vitest'
import { dateDiff } from './logic'

describe('dateDiff', () => {
  it('exactly 1 year', () => {
    const r = dateDiff('2023-01-01', '2024-01-01')
    expect(r.years).toBe(1)
    expect(r.months).toBe(0)
    expect(r.days).toBe(0)
    expect(r.totalDays).toBe(365)
    expect(r.isPast).toBe(false)
  })

  it('exactly 1 month', () => {
    const r = dateDiff('2024-01-01', '2024-02-01')
    expect(r.years).toBe(0)
    expect(r.months).toBe(1)
    expect(r.days).toBe(0)
  })

  it('cross month boundary — non-ambiguous', () => {
    const r = dateDiff('2024-01-15', '2024-03-20')
    expect(r.years).toBe(0)
    expect(r.months).toBe(2)
    expect(r.days).toBe(5)
  })

  it('order independence — A > B returns isPast=true', () => {
    const r = dateDiff('2024-06-01', '2024-01-01')
    expect(r.isPast).toBe(true)
    expect(r.totalDays).toBeGreaterThan(0)
  })

  it('same date returns all zeros', () => {
    const r = dateDiff('2024-05-15', '2024-05-15')
    expect(r.years).toBe(0)
    expect(r.months).toBe(0)
    expect(r.days).toBe(0)
    expect(r.totalDays).toBe(0)
  })

  it('totalHours = totalDays * 24 for whole-day diff', () => {
    const r = dateDiff('2024-01-01', '2024-01-11')
    expect(r.totalDays).toBe(10)
    expect(r.totalHours).toBe(240)
  })

  it('throws on invalid date', () => {
    expect(() => dateDiff('not-a-date', '2024-01-01')).toThrow()
  })

  it('leap year — 2024 has 366 days', () => {
    const r = dateDiff('2024-01-01', '2025-01-01')
    expect(r.totalDays).toBe(366)
  })
})
