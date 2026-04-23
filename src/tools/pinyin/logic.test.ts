import { describe, it, expect } from 'vitest'
import { convertToPinyin, convertToArray } from './logic'

describe('convertToPinyin', () => {
  it('returns empty string for empty input', () => {
    expect(convertToPinyin('', 'symbol')).toBe('')
    expect(convertToPinyin('   ', 'num')).toBe('')
  })

  it('converts basic Chinese to pinyin with tone symbols', () => {
    const result = convertToPinyin('中文', 'symbol')
    expect(result).toContain('zhōng')
    expect(result).toContain('wén')
  })

  it('converts to pinyin with tone numbers', () => {
    const result = convertToPinyin('中文', 'num')
    expect(result).toContain('zhong1')
    expect(result).toContain('wen2')
  })

  it('converts to pinyin without tones', () => {
    const result = convertToPinyin('中文', 'none')
    expect(result).toContain('zhong')
    expect(result).toContain('wen')
    expect(result).not.toMatch(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/)
  })

  it('preserves non-Chinese characters', () => {
    const result = convertToPinyin('Hello中文', 'none')
    expect(result).toContain('H')
    expect(result).toContain('zhong')
  })
})

describe('convertToArray', () => {
  it('returns array of pinyin for each character', () => {
    const result = convertToArray('你好', 'symbol')
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('returns empty array for empty input', () => {
    expect(convertToArray('', 'none')).toEqual([])
  })
})
