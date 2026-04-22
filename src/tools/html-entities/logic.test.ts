import { describe, it, expect } from 'vitest'
import { encodeEntities, decodeEntities } from './logic'

describe('html-entities', () => {
  it('encodes special chars', () => {
    expect(encodeEntities('<div class="x">it\'s</div>')).toBe('&lt;div class=&quot;x&quot;&gt;it&#39;s&lt;/div&gt;')
  })
  it('encodes ampersand first', () => {
    expect(encodeEntities('a & b')).toBe('a &amp; b')
  })
  it('decodes named entities', () => {
    expect(decodeEntities('&lt;b&gt;hello&lt;/b&gt;')).toBe('<b>hello</b>')
  })
  it('decodes numeric entities', () => {
    expect(decodeEntities('&#65;&#66;&#67;')).toBe('ABC')
  })
  it('decodes hex entities', () => {
    expect(decodeEntities('&#x41;&#x42;')).toBe('AB')
  })
  it('roundtrip: encode then decode', () => {
    const original = '<script>alert("xss")</script>'
    expect(decodeEntities(encodeEntities(original))).toBe(original)
  })
})
