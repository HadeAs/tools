import { describe, it, expect } from 'vitest'
import { dateAdd } from './logic'

describe('dateAdd', () => {
  it('add 1 year', () => {
    const r = dateAdd('2024-01-15', 1, 'years', 'add')
    expect(r.result.getFullYear()).toBe(2025)
    expect(r.result.getMonth()).toBe(0)
    expect(r.result.getDate()).toBe(15)
  })

  it('subtract 1 month from mid-month', () => {
    const r = dateAdd('2024-03-15', 1, 'months', 'subtract')
    expect(r.result.getFullYear()).toBe(2024)
    expect(r.result.getMonth()).toBe(1)
    expect(r.result.getDate()).toBe(15)
  })

  it('add 1 week = 7 days', () => {
    const r = dateAdd('2024-01-01', 1, 'weeks', 'add')
    expect(r.result.getDate()).toBe(8)
  })

  it('add 31 days from Jan 1 reaches Feb 1', () => {
    const r = dateAdd('2024-01-01', 31, 'days', 'add')
    expect(r.result.getMonth()).toBe(1)
    expect(r.result.getDate()).toBe(1)
  })

  it('add 24 hours = next day', () => {
    const r = dateAdd('2024-01-01T00:00:00', 24, 'hours', 'add')
    expect(r.result.getDate()).toBe(2)
  })

  it('subtract 60 minutes', () => {
    const r = dateAdd('2024-01-01T01:00:00', 60, 'minutes', 'subtract')
    expect(r.result.getHours()).toBe(0)
    expect(r.result.getMinutes()).toBe(0)
  })

  it('add 0 days returns same date', () => {
    const r = dateAdd('2024-06-15', 0, 'days', 'add')
    expect(r.result.getDate()).toBe(15)
    expect(r.result.getMonth()).toBe(5)
  })

  it('iso field is valid ISO string', () => {
    const r = dateAdd('2024-01-01', 1, 'days', 'add')
    expect(() => new Date(r.iso)).not.toThrow()
    expect(r.iso).toContain('2024-01-02')
  })

  it('throws on invalid date', () => {
    expect(() => dateAdd('bad-date', 1, 'days', 'add')).toThrow()
  })
})
