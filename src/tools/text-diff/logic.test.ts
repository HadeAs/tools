import { describe, it, expect } from 'vitest'
import { computeDiff } from './logic'

describe('computeDiff', () => {
  it('returns equal parts for identical strings', () => {
    expect(computeDiff('hello', 'hello').every(p => p.type === 'equal')).toBe(true)
  })
  it('detects added text', () => {
    expect(computeDiff('hello', 'hello world').some(p => p.type === 'added')).toBe(true)
  })
  it('detects removed text', () => {
    expect(computeDiff('hello world', 'hello').some(p => p.type === 'removed')).toBe(true)
  })
})
