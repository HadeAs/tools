import { describe, it, expect } from 'vitest'
import { unixToDate, dateToUnix, nowUnix } from './logic'

describe('timestamp', () => {
  it('converts unix 0 to 1970 ISO date', () => expect(unixToDate(0)).toContain('1970-01-01'))
  it('converts ISO date to unix', () => expect(dateToUnix('1970-01-01T00:00:00Z')).toBe(0))
  it('nowUnix is close to current time', () => {
    const now = Math.floor(Date.now() / 1000)
    expect(Math.abs(nowUnix() - now)).toBeLessThan(2)
  })
  it('throws on invalid date string', () => expect(() => dateToUnix('not-a-date')).toThrow())
  it('converts unix 1000000000 to expected date', () => {
    expect(unixToDate(1000000000)).toContain('2001')
  })
  it('converts known date to unix', () => {
    expect(dateToUnix('2001-09-09T01:46:40Z')).toBe(1000000000)
  })
  it('handles negative unix timestamp (pre-1970)', () => {
    expect(unixToDate(-86400)).toContain('1969')
  })
})
