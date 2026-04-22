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
  it('equal parts have correct value', () => {
    const parts = computeDiff('hello', 'hello')
    expect(parts[0].value).toBe('hello')
  })
  it('added part has correct value', () => {
    const parts = computeDiff('hi', 'hi there')
    const added = parts.find(p => p.type === 'added')
    expect(added?.value).toContain('there')
  })
  it('removed part has correct value', () => {
    const parts = computeDiff('hello world', 'hello')
    const removed = parts.find(p => p.type === 'removed')
    expect(removed?.value).toContain('world')
  })
  it('handles empty strings', () => {
    const parts = computeDiff('', '')
    expect(parts.every(p => p.type === 'equal')).toBe(true)
  })
  it('completely different strings have no equal parts', () => {
    const parts = computeDiff('abc', 'xyz')
    expect(parts.some(p => p.type === 'removed')).toBe(true)
    expect(parts.some(p => p.type === 'added')).toBe(true)
  })
})
