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
})
