import { describe, it, expect } from 'vitest'
import { md5Hash, sha1Hash, sha256Hash } from './logic'

describe('hash-generator', () => {
  it('generates md5 hash', () => {
    expect(md5Hash('hello')).toBe('5d41402abc4b2a76b9719d911017c592')
  })
  it('generates sha1 hash', () => {
    expect(sha1Hash('hello')).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d')
  })
  it('generates sha256 hash', async () => {
    const hash = await sha256Hash('hello')
    expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
  })
  it('md5 of empty string is known value', () => {
    expect(md5Hash('')).toBe('d41d8cd98f00b204e9800998ecf8427e')
  })
  it('sha1 of empty string is known value', () => {
    expect(sha1Hash('')).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709')
  })
  it('md5 is deterministic', () => {
    expect(md5Hash('test')).toBe(md5Hash('test'))
  })
  it('different inputs produce different hashes', () => {
    expect(md5Hash('hello')).not.toBe(md5Hash('world'))
  })
})
