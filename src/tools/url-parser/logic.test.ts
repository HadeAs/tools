import { describe, it, expect } from 'vitest'
import { parseUrl } from './logic'

describe('parseUrl', () => {
  it('parses full URL', () => {
    const r = parseUrl('https://example.com:8080/path?a=1&b=2#section')
    expect(r.protocol).toBe('https:')
    expect(r.hostname).toBe('example.com')
    expect(r.port).toBe('8080')
    expect(r.pathname).toBe('/path')
    expect(r.hash).toBe('#section')
  })

  it('parses query params', () => {
    const r = parseUrl('https://example.com/?foo=bar&baz=qux')
    expect(r.params).toEqual([
      { key: 'foo', value: 'bar' },
      { key: 'baz', value: 'qux' },
    ])
  })

  it('handles no params', () => {
    const r = parseUrl('https://example.com/')
    expect(r.params).toEqual([])
    expect(r.search).toBe('')
  })

  it('adds https if missing protocol', () => {
    const r = parseUrl('example.com/page')
    expect(r.protocol).toBe('https:')
    expect(r.hostname).toBe('example.com')
  })

  it('handles empty hash', () => {
    const r = parseUrl('https://example.com/')
    expect(r.hash).toBe('')
  })

  it('throws on invalid URL', () => {
    expect(() => parseUrl('not a url !!!')).toThrow()
  })
})
