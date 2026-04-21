import { describe, it, expect } from 'vitest'
import { encode, decode } from './logic'

describe('base64', () => {
  it('encodes a string', () => expect(encode('Hello')).toBe('SGVsbG8='))
  it('decodes a base64 string', () => expect(decode('SGVsbG8=')).toBe('Hello'))
  it('round-trips correctly', () => {
    const original = 'Developer Tools 123!@#'
    expect(decode(encode(original))).toBe(original)
  })
  it('throws on invalid base64', () => expect(() => decode('not!valid@base64#')).toThrow())
})
