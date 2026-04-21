import { describe, it, expect } from 'vitest'
import { formatJSON, minifyJSON, validateJSON } from './logic'

describe('formatJSON', () => {
  it('formats valid JSON', () => expect(formatJSON('{"a":1}')).toBe('{\n  "a": 1\n}'))
  it('throws on invalid JSON', () => expect(() => formatJSON('not json')).toThrow())
})

describe('minifyJSON', () => {
  it('minifies formatted JSON', () => expect(minifyJSON('{\n  "a": 1\n}')).toBe('{"a":1}'))
})

describe('validateJSON', () => {
  it('returns true for valid JSON', () => expect(validateJSON('{"a":1}')).toBe(true))
  it('returns false for invalid JSON', () => expect(validateJSON('bad')).toBe(false))
})
