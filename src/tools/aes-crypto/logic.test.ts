import { describe, it, expect } from 'vitest'
import { aesEncrypt, aesDecrypt } from './logic'

describe('AES encrypt/decrypt', () => {
  it('encrypt then decrypt returns original', () => {
    const text = 'Hello, World!'
    const key = 'my-secret-key'
    const encrypted = aesEncrypt(text, key)
    expect(encrypted).not.toBe(text)
    const decrypted = aesDecrypt(encrypted, key)
    expect(decrypted).toBe(text)
  })

  it('returns empty string for empty input', () => {
    expect(aesEncrypt('', 'key')).toBe('')
    expect(aesDecrypt('', 'key')).toBe('')
  })

  it('different keys produce different ciphertext', () => {
    const a = aesEncrypt('hello', 'key1')
    const b = aesEncrypt('hello', 'key2')
    expect(a).not.toBe(b)
  })

  it('decrypt with wrong key throws', () => {
    const encrypted = aesEncrypt('secret', 'correct-key')
    expect(() => aesDecrypt(encrypted, 'wrong-key')).toThrow()
  })

  it('handles unicode text', () => {
    const text = '你好，世界！'
    const key = 'key'
    const decrypted = aesDecrypt(aesEncrypt(text, key), key)
    expect(decrypted).toBe(text)
  })
})
