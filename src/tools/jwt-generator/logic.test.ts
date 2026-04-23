import { describe, it, expect } from 'vitest'
import { generateJWT } from './logic'

function base64UrlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - str.length % 4) % 4)
  return atob(padded)
}

describe('generateJWT', () => {
  it('produces three dot-separated segments', () => {
    const token = generateJWT('{"sub":"1"}', 'secret')
    const parts = token.split('.')
    expect(parts).toHaveLength(3)
  })

  it('header segment contains correct alg and typ', () => {
    const token = generateJWT('{"sub":"1"}', 'secret', 'HS256')
    const header = JSON.parse(base64UrlDecode(token.split('.')[0]))
    expect(header).toEqual({ alg: 'HS256', typ: 'JWT' })
  })

  it('payload segment encodes the input JSON', () => {
    const payload = '{"sub":"test","name":"Alice"}'
    const token = generateJWT(payload, 'mysecret')
    const decoded = JSON.parse(base64UrlDecode(token.split('.')[1]))
    expect(decoded).toEqual({ sub: 'test', name: 'Alice' })
  })

  it('same input and key produces same token', () => {
    const a = generateJWT('{"sub":"1"}', 'secret')
    const b = generateJWT('{"sub":"1"}', 'secret')
    expect(a).toBe(b)
  })

  it('different keys produce different tokens', () => {
    const a = generateJWT('{"sub":"1"}', 'secret1')
    const b = generateJWT('{"sub":"1"}', 'secret2')
    expect(a).not.toBe(b)
  })

  it('throws on invalid payload JSON', () => {
    expect(() => generateJWT('not json', 'secret')).toThrow()
  })

  it('works with HS384', () => {
    const token = generateJWT('{"sub":"1"}', 'secret', 'HS384')
    const header = JSON.parse(base64UrlDecode(token.split('.')[0]))
    expect(header.alg).toBe('HS384')
  })

  it('works with HS512', () => {
    const token = generateJWT('{"sub":"1"}', 'secret', 'HS512')
    const header = JSON.parse(base64UrlDecode(token.split('.')[0]))
    expect(header.alg).toBe('HS512')
  })
})
