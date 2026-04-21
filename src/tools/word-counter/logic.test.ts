import { describe, it, expect } from 'vitest'
import { countStats } from './logic'

describe('countStats', () => {
  it('counts words', () => expect(countStats('hello world').words).toBe(2))
  it('counts characters', () => expect(countStats('hello').chars).toBe(5))
  it('counts lines', () => expect(countStats('a\nb\nc').lines).toBe(3))
  it('handles empty string', () => {
    expect(countStats('').words).toBe(0)
    expect(countStats('').chars).toBe(0)
  })
  it('counts sentences', () => expect(countStats('Hello. World!').sentences).toBe(2))
})
