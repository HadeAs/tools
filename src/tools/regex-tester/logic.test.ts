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
})
