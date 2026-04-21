import { describe, it, expect } from 'vitest'
import { encodeURL, decodeURL } from './logic'

describe('url-encoder', () => {
  it('encodes spaces', () => expect(encodeURL('hello world')).toBe('hello%20world'))
  it('decodes encoded string', () => expect(decodeURL('hello%20world')).toBe('hello world'))
  it('encodes special characters', () => expect(encodeURL('a=1&b=2')).toBe('a%3D1%26b%3D2'))
  it('round-trips correctly', () => {
    const original = 'https://example.com/path?q=hello world&foo=bar'
    expect(decodeURL(encodeURL(original))).toBe(original)
  })
})
