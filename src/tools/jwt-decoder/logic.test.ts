import { describe, it, expect } from 'vitest'
import { decodeJWT } from './logic'

const SAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

describe('decodeJWT', () => {
  it('decodes a valid JWT header', () => expect(decodeJWT(SAMPLE).header.alg).toBe('HS256'))
  it('decodes a valid JWT payload', () => expect(decodeJWT(SAMPLE).payload.name).toBe('John Doe'))
  it('throws on wrong number of parts', () => expect(() => decodeJWT('a.b')).toThrow())
  it('throws on non-base64 content', () => expect(() => decodeJWT('!!!.!!!.!!!')).toThrow())
  it('returns the signature as-is', () => {
    expect(decodeJWT(SAMPLE).signature).toBe('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
  })
  it('handles URL-safe base64 chars (- and _) in signature', () => {
    const decoded = decodeJWT(SAMPLE)
    expect(decoded.signature).toMatch(/[_-]/)
  })
  it('decodes iat field', () => {
    expect(decodeJWT(SAMPLE).payload.iat).toBe(1516239022)
  })
})
