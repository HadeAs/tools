import { describe, it, expect } from 'vitest'
import { testRegex } from './logic'

describe('testRegex', () => {
  it('returns matches for a simple pattern', () => {
    const result = testRegex('\\d+', 'abc 123 def 456', 'g')
    expect(result.matches).toEqual(['123', '456'])
  })
  it('returns empty array when no matches', () => {
    expect(testRegex('xyz', 'abc', 'g').matches).toEqual([])
  })
  it('returns an error for invalid regex', () => {
    expect(testRegex('[invalid', 'test', 'g').error).toBeTruthy()
  })
  it('returns match indices', () => {
    expect(testRegex('a', 'banana', 'g').indices).toEqual([1, 3, 5])
  })
  it('captures groups', () => {
    const result = testRegex('(\\d+)-(\\d+)', '12-34 56-78', 'g')
    expect(result.groups[0]).toEqual(['12', '34'])
    expect(result.groups[1]).toEqual(['56', '78'])
  })
  it('case-insensitive flag', () => {
    expect(testRegex('hello', 'Hello World', 'gi').matches).toEqual(['Hello'])
  })
})

import { replaceRegex } from './logic'

describe('replaceRegex', () => {
  it('replaces first match without g flag', () => {
    expect(replaceRegex('foo', 'foo bar foo', '', 'baz')).toBe('baz bar foo')
  })
  it('replaces all matches with g flag', () => {
    expect(replaceRegex('foo', 'foo bar foo', 'g', 'baz')).toBe('baz bar baz')
  })
  it('supports capture group references', () => {
    expect(replaceRegex('(\\w+)', 'hello', 'g', '[$1]')).toBe('[hello]')
  })
  it('throws on invalid pattern', () => {
    expect(() => replaceRegex('[invalid', 'test', 'g', 'x')).toThrow()
  })
})
