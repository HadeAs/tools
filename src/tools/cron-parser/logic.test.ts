import { describe, it, expect } from 'vitest'
import { parseCron } from './logic'

describe('cron-parser', () => {
  it('describes every-minute as plain Chinese', () => {
    expect(parseCron('* * * * *').description).toBe('每分钟执行一次')
  })
  it('describes step syntax concisely', () => {
    expect(parseCron('*/15 * * * *').description).toBe('每 15 分钟执行一次')
  })
  it('parses a specific schedule', () => {
    const result = parseCron('0 9 * * 1')
    expect(result.description).toContain('9 时')
    expect(result.description).toContain('周一')
  })
  it('returns 5 next run times', () => {
    expect(parseCron('* * * * *').nextRuns.length).toBe(5)
  })
  it('throws on invalid expression', () => {
    expect(() => parseCron('* * *')).toThrow()
  })
  it('describes comma list in minutes', () => {
    const result = parseCron('0,30 * * * *')
    expect(result.description).toContain('0,30')
  })
  it('describes range in hours', () => {
    const result = parseCron('0 9-17 * * *')
    expect(result.description).toContain('9-17')
  })
  it('describes a monthly schedule', () => {
    const result = parseCron('0 0 1 * *')
    expect(result.description).toContain('1')
  })
  it('all nextRuns are in the future', () => {
    const { nextRuns } = parseCron('* * * * *')
    const now = Date.now()
    expect(nextRuns.every(r => new Date(r).getTime() > now - 60000)).toBe(true)
  })
  it('returns exactly 5 next runs for specific schedule', () => {
    expect(parseCron('0 9 * * 1').nextRuns).toHaveLength(5)
  })
})
