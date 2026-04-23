import { describe, it, expect } from 'vitest'
import { normalizeJson, diffJson, isSame } from './logic'

describe('normalizeJson', () => {
  it('formats JSON with 2-space indent', () => {
    const result = normalizeJson('{"a":1,"b":2}')
    expect(result).toBe('{\n  "a": 1,\n  "b": 2\n}')
  })

  it('throws on invalid JSON', () => {
    expect(() => normalizeJson('not json')).toThrow()
  })

  it('sorts consistently regardless of key order', () => {
    const a = normalizeJson('{"b":2,"a":1}')
    expect(a).toContain('"b": 2')
    expect(a).toContain('"a": 1')
  })
})

describe('isSame', () => {
  it('returns true for semantically equal JSON', () => {
    expect(isSame('{"a":1}', '{"a":1}')).toBe(true)
  })

  it('returns false for different values', () => {
    expect(isSame('{"a":1}', '{"a":2}')).toBe(false)
  })

  it('returns false for added key', () => {
    expect(isSame('{"a":1}', '{"a":1,"b":2}')).toBe(false)
  })
})

describe('diffJson', () => {
  it('returns only unchanged lines for equal JSON', () => {
    const lines = diffJson('{"a":1}', '{"a":1}')
    expect(lines.every(l => l.type === 'unchanged')).toBe(true)
  })

  it('marks added lines', () => {
    const lines = diffJson('{"a":1}', '{"a":1,"b":2}')
    expect(lines.some(l => l.type === 'added')).toBe(true)
  })

  it('marks removed lines', () => {
    const lines = diffJson('{"a":1,"b":2}', '{"a":1}')
    expect(lines.some(l => l.type === 'removed')).toBe(true)
  })

  it('detects value change as removed+added', () => {
    const lines = diffJson('{"a":1}', '{"a":2}')
    expect(lines.some(l => l.type === 'removed')).toBe(true)
    expect(lines.some(l => l.type === 'added')).toBe(true)
  })
})
