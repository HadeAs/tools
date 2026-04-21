import { describe, it, expect } from 'vitest'
import { parseCron } from './logic'

describe('cron-parser', () => {
  it('parses a standard cron expression', () => {
    const result = parseCron('0 9 * * 1')
    expect(result.description).toContain('分钟 0')
    expect(result.description).toContain('小时 9')
  })
  it('returns 5 next run times', () => {
    const result = parseCron('* * * * *')
    expect(result.nextRuns.length).toBe(5)
  })
  it('throws on invalid expression', () => {
    expect(() => parseCron('* * *')).toThrow()
  })
  it('handles step syntax', () => {
    const result = parseCron('*/15 * * * *')
    expect(result.description).toContain('每 15 分钟')
  })
})
