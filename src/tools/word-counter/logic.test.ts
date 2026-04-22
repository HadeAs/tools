import { describe, it, expect } from 'vitest'
import { countStats } from './logic'

describe('countStats', () => {
  it('counts latin words', () => expect(countStats('hello world').words).toBe(2))
  it('counts characters', () => expect(countStats('hello').chars).toBe(5))
  it('counts lines', () => expect(countStats('a\nb\nc').lines).toBe(3))
  it('handles empty string', () => {
    expect(countStats('').words).toBe(0)
    expect(countStats('').chars).toBe(0)
  })
  it('counts sentences with latin punctuation', () => expect(countStats('Hello. World!').sentences).toBe(2))
  it('counts chinese characters', () => expect(countStats('你好世界').chineseChars).toBe(4))
  it('counts sentences with chinese punctuation', () => expect(countStats('你好。世界！').sentences).toBe(2))
  it('mixed chinese and latin', () => {
    const stats = countStats('hello 你好 world')
    expect(stats.words).toBe(2)
    expect(stats.chineseChars).toBe(2)
  })
  it('counts charsNoSpaces', () => {
    expect(countStats('hello world').charsNoSpaces).toBe(10)
  })
  it('charsNoSpaces excludes tabs and newlines', () => {
    expect(countStats('a\tb\nc').charsNoSpaces).toBe(3)
  })
  it('spaces-only input has 0 words and 0 sentences', () => {
    const stats = countStats('   ')
    expect(stats.words).toBe(0)
    expect(stats.sentences).toBe(0)
  })
})
