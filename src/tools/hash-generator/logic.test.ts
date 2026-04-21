import { describe, it, expect } from 'vitest'
import { md5Hash, sha256Hash } from './logic'

describe('hash-generator', () => {
  it('generates md5 hash', () => {
    expect(md5Hash('hello')).toBe('5d41402abc4b2a76b9719d911017c592')
  })
  it('generates sha256 hash', async () => {
    const hash = await sha256Hash('hello')
    expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
  })
})
